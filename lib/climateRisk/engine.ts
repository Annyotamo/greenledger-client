// Pure scoring rules from the MVP spec, used by the screens for labels and previews.
// The stored ratings come from the server's copy: app/services/climate_risk/climate_risk_calculator.py.
import type {
    CarbonPrice,
    FacilityHazard,
    HazardLevel,
    HazardMappingEntry,
    Rating,
    ScenarioKey,
    Thresholds,
    TriState,
} from "./types";

export type Scored = { rating: Rating; driver: string | null; notRatedReason: string | null };

/** One item of GET https://thinkhazard.org/en/report/{code}.json */
export type ThinkHazardReportItem = {
    hazardtype: { mnemonic: string; hazardtype: string };
    hazardlevel: { mnemonic: string; title: string };
};

export const LEVEL_POINTS: Record<HazardLevel, number | null> = { VLO: 0, LOW: 1, MED: 2, HIG: 3, "no-data": null };
const RATING_RANK: Record<Rating, number> = { not_rated: 0, low: 1, medium: 2, high: 3 };
export const RATING_LABEL: Record<Rating, string> = { low: "Low", medium: "Medium", high: "High", not_rated: "Not rated" };

const notRated = (reason: string): Scored => ({ rating: "not_rated", driver: null, notRatedReason: reason });

export function pointsToRating(points: number): Exclude<Rating, "not_rated"> {
    return points >= 3 ? "high" : points === 2 ? "medium" : "low";
}

/** Map a raw ThinkHazard reply onto facility_hazard rows using the ruleset's hazard mapping. */
export function classifyHazards(
    raw: ThinkHazardReportItem[],
    mapping: HazardMappingEntry[],
    ids: Pick<FacilityHazard, "assessment_id" | "facility_id" | "run">,
): FacilityHazard[] {
    return raw.map((item) => {
        const entry = mapping.find((m) => m.code === item.hazardtype.mnemonic);
        const level = (item.hazardlevel.mnemonic in LEVEL_POINTS ? item.hazardlevel.mnemonic : "no-data") as HazardLevel;
        return {
            ...ids,
            hazard_code: item.hazardtype.mnemonic,
            hazard_name: entry?.name ?? item.hazardtype.hazardtype,
            // A code missing from the mapping never counts: the methodology lead has to classify it first.
            risk_type: entry?.risk_type ?? "non_climate",
            level,
            points: LEVEL_POINTS[level],
            counts_in_rating: entry?.counts_in_rating ?? false,
        };
    });
}

/** Facility physical rating = level of its worst climate hazard. */
export function scorePhysical(hazards: Pick<FacilityHazard, "hazard_name" | "points" | "counts_in_rating">[]): Scored {
    const climate = hazards.filter((h) => h.counts_in_rating && h.points !== null);
    if (climate.length === 0) return notRated("no climate hazard data for this district");
    const top = Math.max(...climate.map((h) => h.points as number));
    const rating = pointsToRating(top);
    const names = climate.filter((h) => h.points === top).map((h) => h.hazard_name);
    return { rating, driver: `${names.join(", ")}: ${RATING_LABEL[rating]}`, notRatedReason: null };
}

export function costShareRating(sharePct: number, t: Thresholds): Exclude<Rating, "not_rated"> {
    if (sharePct < t.a_pct) return "low";
    if (sharePct > t.b_pct) return "high";
    return "medium";
}

export function priceInr(p: Pick<CarbonPrice, "price" | "currency">, usdInrRate: number): number {
    return p.currency === "USD" ? p.price * usdInrRate : p.price;
}

export const SCENARIO_LABEL: Record<ScenarioKey, string> = {
    net_zero_2050: "Net Zero 2050",
    delayed_transition: "Delayed Transition",
    current_policies: "Current Policies",
};

type PricePoint = { scenario: ScenarioKey; year: number; price_inr: number };

function worstShare(scope1: number, prices: PricePoint[], revenueInr: number) {
    let worst = { share: -1, scenario: prices[0]?.scenario, year: prices[0]?.year };
    for (const p of prices) {
        const share = ((scope1 * p.price_inr) / revenueInr) * 100;
        if (share > worst.share) worst = { share, scenario: p.scenario, year: p.year };
    }
    return worst;
}

const describeShare = (w: { share: number; scenario?: ScenarioKey; year?: number }) =>
    `${w.scenario ? SCENARIO_LABEL[w.scenario] : ""} ${w.year}: ${w.share.toFixed(2)}% of revenue`;

/** Facility transition rating: its worst carbon cost against company revenue. */
export function scoreTransitionFacility(
    scope1Tco2e: number | null,
    prices: PricePoint[],
    revenueInr: number | null,
    t: Thresholds,
): Scored {
    if (scope1Tco2e === null) return notRated("emissions missing");
    if (!revenueInr) return notRated("revenue missing");
    if (prices.length === 0) return notRated("no carbon prices in ruleset");
    const w = worstShare(scope1Tco2e, prices, revenueInr);
    return { rating: costShareRating(w.share, t), driver: describeShare(w), notRatedReason: null };
}

/** Company transition rating: worst cost share across the scenario × year grid of summed facility costs. */
export function scoreTransitionCompany(
    facilities: { name: string; scope1_tco2e: number | null }[],
    prices: PricePoint[],
    revenueInr: number | null,
    t: Thresholds,
): Scored {
    if (!revenueInr) return notRated("revenue missing");
    const known = facilities.filter((f) => f.scope1_tco2e !== null);
    const missing = facilities.length - known.length;
    if (known.length === 0) return notRated("emissions missing for every facility");
    const total = known.reduce((s, f) => s + (f.scope1_tco2e as number), 0);
    const w = worstShare(total, prices, revenueInr);
    const rating = costShareRating(w.share, t);
    // Missing emissions can only add cost, so a partial High stands; anything lower could be understated.
    if (missing > 0 && rating !== "high") {
        return notRated(`emissions missing for ${missing} ${missing === 1 ? "facility" : "facilities"}; known facilities alone reach ${RATING_LABEL[rating]}`);
    }
    const note = missing > 0 ? ` (excludes ${missing} ${missing === 1 ? "facility" : "facilities"} with missing emissions)` : "";
    return { rating, driver: describeShare(w) + note, notRatedReason: null };
}

/** Company physical rating = worst facility rating. */
export function rollUpPhysical(entries: { name: string; scored: Scored }[]): Scored {
    const rated = entries.filter((e) => e.scored.rating !== "not_rated");
    const unrated = entries.length - rated.length;
    if (rated.length === 0) return notRated("no facility could be rated");
    const worst = rated.reduce((a, b) => (RATING_RANK[b.scored.rating] > RATING_RANK[a.scored.rating] ? b : a));
    // An unrated facility could be worse than every rated one, so only High is safe to report.
    if (unrated > 0 && worst.scored.rating !== "high") {
        return notRated(`${unrated} ${unrated === 1 ? "facility" : "facilities"} not rated; rated facilities reach ${RATING_LABEL[worst.scored.rating]}`);
    }
    return { rating: worst.scored.rating, driver: `${worst.name}: ${worst.scored.driver}`, notRatedReason: null };
}

/** % of Scope 1 under emissions-limiting rules (CCTS), mirroring SASB EM-IS-110a.1. Unknowns stay out of the top number. */
export function cctsShare(facilities: { scope1_tco2e: number | null; ccts_covered: TriState }[]) {
    const withEmissions = facilities.filter((f) => f.scope1_tco2e !== null);
    const total = withEmissions.reduce((s, f) => s + (f.scope1_tco2e as number), 0);
    const covered = withEmissions.filter((f) => f.ccts_covered === "yes").reduce((s, f) => s + (f.scope1_tco2e as number), 0);
    return {
        pct: total > 0 ? (covered / total) * 100 : null,
        unknownCount: facilities.filter((f) => f.ccts_covered === "unknown").length,
        missingEmissionsCount: facilities.length - withEmissions.length,
    };
}

export const MIN_OVERRIDE_REASON = 20;
export const isValidOverrideReason = (reason: string | null | undefined) => (reason ?? "").trim().length >= MIN_OVERRIDE_REASON;

export function carbonCostInr(scope1Tco2e: number | null, priceInrPerT: number): number | null {
    return scope1Tco2e === null ? null : scope1Tco2e * priceInrPerT;
}

export function worstRating(ratings: Rating[]): Rating {
    return ratings.reduce<Rating>((a, b) => (RATING_RANK[b] > RATING_RANK[a] ? b : a), "not_rated");
}
