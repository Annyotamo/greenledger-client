// lib/lwg/utils.ts

import {
    ALLOWED_UNITS_BY_SOURCE,
    ENERGY_GJ_FACTORS,
    LWG_ALL_SECTIONS,
    LWG_CRITICAL_SECTIONS,
    LwgDocumentType,
    LwgEnergySource,
    LwgEnergyUnit,
    LwgMedalRating,
    LwgOutputUnit,
    LwgWaterSource,
} from "./types";

// ============================================================================
// 1. LEATHER AREA NORMALIZATION & CONVERSIONS
// ============================================================================

/**
 * 1 sq ft = 0.092903 m²
 */
export function sqftToM2(sqft: number): number {
    if (!sqft || isNaN(sqft)) return 0;
    return Number((sqft * 0.092903).toFixed(2));
}

/**
 * 1 m² = 10.7639 sq ft
 */
export function m2ToSqft(m2: number): number {
    if (!m2 || isNaN(m2)) return 0;
    return Number((m2 * 10.7639).toFixed(1));
}

/**
 * Converts quantity to both m² and sq ft based on the input unit.
 */
export function normalizeArea(
    quantity: number,
    inputUnit: LwgOutputUnit,
): { areaM2: number; areaSqft: number } {
    const val = Number(quantity) || 0;
    if (inputUnit === "sq_ft") {
        return {
            areaSqft: val,
            areaM2: sqftToM2(val),
        };
    }
    return {
        areaM2: val,
        areaSqft: m2ToSqft(val),
    };
}

/**
 * Formats a numeric area with localized commas and unit label.
 */
export function formatArea(value: number, unit: LwgOutputUnit): string {
    const formatted = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: unit === "sq_ft" ? 0 : 1,
    }).format(value);
    return `${formatted} ${unit === "sq_ft" ? "sq ft" : "m²"}`;
}

// ============================================================================
// 2. ENERGY GJ CALCULATIONS & DYNAMIC UNIT FILTERING
// ============================================================================

/**
 * Computes live energy in Gigajoules (GJ) based on source, quantity, and unit.
 */
export function calculateLiveGj(
    source: LwgEnergySource,
    quantity: number,
    unit: string,
): number {
    if (!quantity || isNaN(quantity) || quantity <= 0) return 0;
    const factorMap = ENERGY_GJ_FACTORS[source];
    if (!factorMap) return 0;

    const factor = factorMap[unit.toLowerCase()];
    if (factor === undefined) return 0;

    return Number((quantity * factor).toFixed(2));
}

/**
 * Returns allowed measurement units for a given energy source.
 */
export function getAllowedUnitsForSource(
    source: LwgEnergySource,
): readonly LwgEnergyUnit[] {
    return ALLOWED_UNITS_BY_SOURCE[source] ?? ["kwh"];
}

// ============================================================================
// 3. MANDATORY FIELD & ENFORCEMENT RULES
// ============================================================================

/**
 * Borewell and municipal water intake mandate a physical meter ID.
 */
export function requiresMeterId(source: LwgWaterSource): boolean {
    return source === "borewell" || source === "municipal_supply";
}

/**
 * Groundwater / borewell extraction mandates photographic proof of meter.
 */
export function requiresMeterPhoto(source: LwgWaterSource): boolean {
    return source === "borewell";
}

/**
 * Purchased off-site green power requires PPA or green certificate upload.
 */
export function requiresRenewableProof(source: LwgEnergySource): boolean {
    return source === "purchased_renewable_electricity";
}

/**
 * Operating permits (CTO and Hazardous Waste) mandate statutory expiry dates.
 */
export function requiresExpiryDate(docType: LwgDocumentType): boolean {
    return (
        docType === "consent_to_operate" ||
        docType === "hazardous_waste_authorisation"
    );
}

// ============================================================================
// 4. DATE WINDOW & EXPIRY STATUS EVALUATION
// ============================================================================

/**
 * Checks whether a given month date string falls inside the 24-month audit window.
 */
export function isDateInWindow(
    month: string,
    windowStart: string,
    windowEnd: string,
): boolean {
    if (!month || !windowStart || !windowEnd) return false;
    const m = month.slice(0, 7);
    const start = windowStart.slice(0, 7);
    const end = windowEnd.slice(0, 7);
    return m >= start && m <= end;
}

export type ExpiryStatus = "expired" | "warning" | "valid" | "none";

/**
 * Evaluates document validity and returns expiry alert countdown.
 */
export function getExpiryStatus(
    expiryDate: string | null | undefined,
): {
    status: ExpiryStatus;
    daysRemaining: number | null;
    label: string;
} {
    if (!expiryDate) {
        return { status: "none", daysRemaining: null, label: "No expiry date" };
    }

    const exp = new Date(expiryDate);
    if (isNaN(exp.getTime())) {
        return { status: "none", daysRemaining: null, label: "Invalid date" };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    exp.setHours(0, 0, 0, 0);

    const diffMs = exp.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
        return {
            status: "expired",
            daysRemaining,
            label: `Expired ${Math.abs(daysRemaining)} days ago`,
        };
    }

    if (daysRemaining <= 60) {
        return {
            status: "warning",
            daysRemaining,
            label: `Expires in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`,
        };
    }

    return {
        status: "valid",
        daysRemaining,
        label: `Valid (${daysRemaining} days remaining)`,
    };
}

// ============================================================================
// 5. MEDAL RANKING & HOLDING-DOWN BOTTLENECK SIMULATOR
// ============================================================================

const MEDAL_RANK: Record<LwgMedalRating, number> = {
    fail: 0,
    audited: 1,
    bronze: 2,
    silver: 3,
    gold: 4,
};

const RANK_TO_MEDAL: Record<number, LwgMedalRating> = {
    0: "fail",
    1: "audited",
    2: "bronze",
    3: "silver",
    4: "gold",
};

/**
 * Map percentage score (0-100) to LWG medal rating.
 */
export function scoreToMedal(score: number): LwgMedalRating {
    if (score >= 85.0) return "gold";
    if (score >= 75.0) return "silver";
    if (score >= 65.0) return "bronze";
    if (score >= 50.0) return "audited";
    return "fail";
}

export interface MedalEvaluationResult {
    overallMedal: LwgMedalRating;
    sectionRatings: Record<string, LwgMedalRating>;
    holdingDownSections: number[];
    holdingDownSectionNames: string[];
    message: string;
}

/**
 * Evaluates projected overall medal rating from individual section scores.
 * Enforces LWG Protocol Issue 7's Holding-Down Rule:
 * The overall medal cannot exceed the lowest medal achieved among Critical Sections.
 */
export function calculateMedalFromScores(
    sectionScores: Record<string | number, number>,
): MedalEvaluationResult {
    const sectionRatings: Record<string, LwgMedalRating> = {};
    let lowestCriticalRank = 4; // Start at Gold rank
    let unconstrainedRank = 4;
    const holdingDownSections: number[] = [];

    const sectionMetaMap = new Map(LWG_ALL_SECTIONS.map((s) => [s.sectionNumber, s]));

    for (const [key, rawScore] of Object.entries(sectionScores)) {
        const secNum = Number(key);
        const score = Math.max(0, Math.min(100, Number(rawScore) || 0));
        const rating = scoreToMedal(score);
        sectionRatings[key] = rating;

        const rank = MEDAL_RANK[rating];
        unconstrainedRank = Math.min(unconstrainedRank, rank);

        const isCritical = LWG_CRITICAL_SECTIONS.includes(secNum);
        if (isCritical) {
            if (rank < lowestCriticalRank) {
                lowestCriticalRank = rank;
            }
        }
    }

    const overallMedal = RANK_TO_MEDAL[lowestCriticalRank] ?? "fail";

    // Identify sections holding down the medal
    for (const [key, rating] of Object.entries(sectionRatings)) {
        const secNum = Number(key);
        if (LWG_CRITICAL_SECTIONS.includes(secNum)) {
            if (MEDAL_RANK[rating] === lowestCriticalRank && lowestCriticalRank < 4) {
                holdingDownSections.push(secNum);
            }
        }
    }

    const holdingDownSectionNames = holdingDownSections.map(
        (secNum) => sectionMetaMap.get(secNum)?.title || `Section ${secNum}`,
    );

    let message = `Projected Medal: ${overallMedal.toUpperCase()}`;
    if (holdingDownSections.length > 0 && lowestCriticalRank < 4) {
        const sectionList = holdingDownSections
            .map((s) => `Section ${s} (${sectionMetaMap.get(s)?.title || "Unknown"})`)
            .join(", ");
        message = `Critical ${sectionList} caps the overall tannery medal at ${overallMedal.toUpperCase()}.`;
    }

    return {
        overallMedal,
        sectionRatings,
        holdingDownSections,
        holdingDownSectionNames,
        message,
    };
}

// ============================================================================
// 6. 24-MONTH AUDIT WINDOW HELPERS
// ============================================================================

export interface LwgMonthOption {
    value: string; // "YYYY-MM-01"
    label: string; // "Nov 2024 (P12)"
    period: "P12" | "L12";
}

/**
 * Generates the list of 24 audit window months with P12 / L12 tags.
 */
export function generate24MonthOptions(
    windowStart?: string,
    windowEnd?: string,
): LwgMonthOption[] {
    const options: LwgMonthOption[] = [];

    // Default start date if none provided: 23 months ago
    let startYear = 2024;
    let startMonth = 11; // 1-indexed

    if (windowStart) {
        const parts = windowStart.split("-").map(Number);
        if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            startYear = parts[0];
            startMonth = parts[1];
        }
    }

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    for (let i = 0; i < 24; i++) {
        const totalMonths = (startYear * 12) + (startMonth - 1) + i;
        const curYear = Math.floor(totalMonths / 12);
        const curMonthIdx = totalMonths % 12; // 0-11
        const curMonthNum = curMonthIdx + 1; // 1-12

        const monthStr = curMonthNum.toString().padStart(2, "0");
        const val = `${curYear}-${monthStr}-01`;
        const period: "P12" | "L12" = i < 12 ? "P12" : "L12";
        const label = `${monthNames[curMonthIdx]} ${curYear} (${period})`;

        options.push({ value: val, label, period });
    }

    return options;
}

export function formatMonthDisplay(monthStr: string): string {
    if (!monthStr) return "";
    const parts = monthStr.split("-").map(Number);
    if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return monthStr;
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const monthIdx = parts[1] - 1;
    if (monthIdx < 0 || monthIdx > 11) return monthStr;
    return `${monthNames[monthIdx]} ${parts[0]}`;
}

