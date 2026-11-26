"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { cn } from "@/lib/utils/cn";
import { clearOverride, overrideRating } from "@/lib/climateRisk/api";
import { cctsShare, MIN_OVERRIDE_REASON, RATING_LABEL, SCENARIO_LABEL } from "@/lib/climateRisk/engine";
import { useRiskAction } from "@/lib/climateRisk/hooks";
import type { AssessmentDetail, Rating, RiskRating } from "@/lib/climateRisk/types";
import { ErrorNote, formatCrore, formatDateTime, formatPct, formatT, NotRatedNote, RatingBadge, SectionTitle, SourceLink } from "./RiskUi";
import { companyGrid, horizonYears } from "./TransitionTab";
import { LimitsFooter } from "./PhysicalTab";

type Props = { data: AssessmentDetail; canEdit: boolean };
const IFRS_S2 = "https://www.ifrs.org/issued-standards/ifrs-sustainability-standards-navigator/ifrs-s2-climate-related-disclosures/";

export function ReportTab({ data, canEdit }: Props) {
    const [editing, setEditing] = useState<RiskRating | null>(null);
    const company = (t: RiskRating["risk_type"]) => data.ratings.find((r) => r.scope === "company" && r.risk_type === t);
    const facilityRating = (fid: string, t: RiskRating["risk_type"]) => data.ratings.find((r) => r.scope === "facility" && r.entity_id === fid && r.risk_type === t);
    const ran = data.assessment.physical_run_at || data.assessment.transition_run_at;

    if (!ran) {
        return (
            <p className="rounded-lg border border-dashed border-outline-variant py-12 text-center text-body-sm text-on-surface-variant">
                Nothing to report yet. Run the physical and transition steps first.
            </p>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid gap-4 lg:grid-cols-2">
                <RatingCard title="Physical risk" icon="flood" rating={company("physical")} canEdit={canEdit} onOverride={setEditing} empty="Physical step not run" />
                <RatingCard title="Transition risk" icon="payments" rating={company("transition")} canEdit={canEdit} onOverride={setEditing} empty="Transition step not run" />
            </div>
            <p className="-mt-4 text-[12px] text-on-surface-variant">Two ratings side by side; there is no blended climate score. Each one opens to the facilities behind it below.</p>

            <Card>
                <CardHeader>
                    <span className="text-[13px] font-semibold">What drove each rating</span>
                    <span className="text-[11px] text-on-surface-variant">Facility level</span>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Facility</TableHead>
                                <TableHead>Physical</TableHead>
                                <TableHead>Driver</TableHead>
                                <TableHead>Transition</TableHead>
                                <TableHead>Driver</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.facilities.map((f) => (
                                <TableRow key={f.id}>
                                    <TableCell className="font-medium">{f.name}</TableCell>
                                    {(["physical", "transition"] as const).map((t) => {
                                        const r = facilityRating(f.id, t);
                                        return [
                                            <TableCell key={t} className="min-w-[150px]">
                                                {r ? <RatingWithOverride rating={r} canEdit={canEdit} onOverride={setEditing} /> : <span className="text-on-surface-variant/60">Not run</span>}
                                            </TableCell>,
                                            <TableCell key={`${t}-d`} className="max-w-[260px] text-[12px] text-on-surface-variant">
                                                {r?.driver ?? (r?.not_rated_reason ? `Not rated: ${r.not_rated_reason}` : "—")}
                                            </TableCell>,
                                        ];
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <RisksFound data={data} />
            <HowAssessed data={data} />
            <Metrics data={data} />

            <section className="space-y-3" aria-labelledby="limits">
                <SectionTitle id="limits">Limits</SectionTitle>
                <LimitsFooter />
            </section>

            <Sources data={data} />

            <OverrideDialog rating={editing} onClose={() => setEditing(null)} />
        </div>
    );
}

function RatingCard({
    title,
    icon,
    rating,
    canEdit,
    onOverride,
    empty,
}: {
    title: string;
    icon: string;
    rating?: RiskRating;
    canEdit: boolean;
    onOverride: (r: RiskRating) => void;
    empty: string;
}) {
    return (
        <Card>
            <CardBody className="space-y-3">
                <div className="flex items-center justify-between">
                    <p className="flex items-center gap-2 text-[13px] font-semibold">
                        <MaterialIcon name={icon} size="md" className="text-on-surface-variant" />
                        {title}
                    </p>
                    {rating && canEdit && (
                        <Button variant="secondary" size="sm" onClick={() => onOverride(rating)}>
                            <MaterialIcon name="edit" size="sm" />
                            Override
                        </Button>
                    )}
                </div>
                {rating ? (
                    <>
                        <RatingBadge rating={rating.final_rating} size="lg" />
                        <p className="text-[12px] text-on-surface-variant">{rating.driver}</p>
                        <NotRatedNote reason={rating.not_rated_reason} />
                        <AdjustedNote rating={rating} />
                    </>
                ) : (
                    <p className="text-body-sm text-on-surface-variant">{empty}</p>
                )}
            </CardBody>
        </Card>
    );
}

function AdjustedNote({ rating: r }: { rating: RiskRating }) {
    if (!r.override_reason) return null;
    return (
        <div className="rounded-md border border-outline-variant bg-surface-container-low px-3 py-2 text-[12px]">
            <p className="font-semibold">
                Adjusted by analyst <span className="font-normal text-on-surface-variant">· computed {RATING_LABEL[r.computed_rating]}</span>
            </p>
            <p className="text-on-surface-variant">“{r.override_reason}”</p>
            <p className="text-[11px] text-on-surface-variant/80">
                {r.overridden_by} · {formatDateTime(r.overridden_at)}
            </p>
        </div>
    );
}

function RatingWithOverride({ rating: r, canEdit, onOverride }: { rating: RiskRating; canEdit: boolean; onOverride: (r: RiskRating) => void }) {
    return (
        <div className="flex flex-wrap items-center gap-1.5">
            <RatingBadge rating={r.final_rating} />
            {r.override_reason && (
                <span title={`Computed ${RATING_LABEL[r.computed_rating]}. ${r.override_reason}`} className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                    Adjusted
                </span>
            )}
            {canEdit && (
                <button
                    type="button"
                    onClick={() => onOverride(r)}
                    aria-label="Override this rating"
                    className="cursor-pointer rounded p-0.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface">
                    <MaterialIcon name="edit" size="xs" />
                </button>
            )}
        </div>
    );
}

function OverrideDialog({ rating, onClose }: { rating: RiskRating | null; onClose: () => void }) {
    const ref = useRef<HTMLDialogElement>(null);
    const action = useRiskAction();
    const [value, setValue] = useState<Rating>("medium");
    const [reason, setReason] = useState("");

    useEffect(() => {
        const d = ref.current;
        if (!d) return;
        if (rating) {
            setValue(rating.final_rating);
            setReason(rating.override_reason ?? "");
            action.reset();
            d.showModal();
        } else if (d.open) d.close();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rating]);

    const remaining = MIN_OVERRIDE_REASON - reason.trim().length;
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating) return;
        action.mutate(() => overrideRating(rating.id, value, reason), { onSuccess: onClose });
    };

    return (
        <dialog
            ref={ref}
            onClose={onClose}
            className="m-auto w-[min(480px,calc(100vw-32px))] rounded-lg border border-outline-variant bg-surface-container-lowest p-0 text-on-surface shadow-xl backdrop:bg-black/30">
            {rating && (
                <form onSubmit={submit} className="space-y-4 p-5">
                    <div>
                        <h3 className="text-headline-sm">Override {rating.risk_type} rating</h3>
                        <p className="text-[12px] text-on-surface-variant">
                            Computed: {RATING_LABEL[rating.computed_rating]}
                            {rating.driver ? ` · ${rating.driver}` : ""}. Both ratings and your reason are stored and shown on the report.
                        </p>
                    </div>
                    <fieldset>
                        <legend className="mb-1.5 text-[12px] font-semibold text-on-surface-variant">New rating</legend>
                        <div className="flex flex-wrap gap-2">
                            {(["low", "medium", "high"] as const).map((r) => (
                                <label key={r} className={cn("cursor-pointer rounded-md border p-1", value === r ? "border-on-surface" : "border-transparent")}>
                                    <input type="radio" name="rating" value={r} checked={value === r} onChange={() => setValue(r)} className="sr-only" />
                                    <RatingBadge rating={r} />
                                </label>
                            ))}
                        </div>
                    </fieldset>
                    <label className="block space-y-1.5">
                        <span className="text-[12px] font-semibold text-on-surface-variant">Reason (at least {MIN_OVERRIDE_REASON} characters)</span>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            required
                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md focus:ring-1 focus:ring-primary"
                            placeholder="e.g. Plant has a cyclone-rated structure and a 2024 site survey shows no flood exposure"
                        />
                        <span className={cn("block text-[11px]", remaining > 0 ? "text-on-surface-variant" : "text-secondary")}>
                            {remaining > 0 ? `${remaining} more characters needed` : "Reason is long enough"}
                        </span>
                    </label>
                    <ErrorNote error={action.error} />
                    <div className="flex flex-wrap justify-between gap-2">
                        {rating.override_reason ? (
                            <Button type="button" variant="ghost" onClick={() => action.mutate(() => clearOverride(rating.id), { onSuccess: onClose })}>
                                Remove override
                            </Button>
                        ) : (
                            <span />
                        )}
                        <div className="flex gap-2">
                            <Button type="button" variant="secondary" onClick={onClose}>
                                Cancel
                            </Button>
                            {/* Not gated on reason length, so the API's own refusal (spec case 12) stays visible. */}
                            <Button type="submit" disabled={action.isPending || (value === rating.final_rating && reason.trim() === (rating.override_reason ?? ""))}>
                                Save override
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </dialog>
    );
}

// ─── Report sections (IFRS S2 order) ───────────────────────────────────────────

function Ref({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-[11px] font-normal text-on-surface-variant">
            <SourceLink href={IFRS_S2}>{children}</SourceLink>
        </span>
    );
}

function RisksFound({ data }: { data: AssessmentDetail }) {
    const physical = data.ruleset.hazard_mapping
        .filter((m) => m.counts_in_rating)
        .map((m) => ({
            m,
            hit: data.facilities
                .map((f) => ({ f, h: data.hazards.find((h) => h.facility_id === f.id && h.hazard_code === m.code) }))
                .filter((x) => x.h && (x.h.level === "HIG" || x.h.level === "MED")),
        }))
        .filter((x) => x.hit.length > 0)
        .sort((a, b) => b.hit.filter((x) => x.h!.level === "HIG").length - a.hit.filter((x) => x.h!.level === "HIG").length);
    const priced = data.facilities.filter((f) => f.scope1_tco2e !== null);

    return (
        <section className="space-y-3" aria-labelledby="risks">
            <SectionTitle id="risks" aside={<Ref>IFRS S2 paras 10 and 13(b)</Ref>}>
                Risks found
            </SectionTitle>
            <Card>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Risk</TableHead>
                                <TableHead>Kind</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Time horizon</TableHead>
                                <TableHead>Facilities affected</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {physical.map(({ m, hit }) => (
                                <TableRow key={m.code}>
                                    <TableCell className="font-medium">{m.name}</TableCell>
                                    <TableCell>Physical</TableCell>
                                    <TableCell className="capitalize">{m.risk_type}</TableCell>
                                    <TableCell>Short term (today’s hazard)</TableCell>
                                    <TableCell className="text-[12px]">
                                        {hit.map((x) => `${x.f.name} (${x.h!.level === "HIG" ? "High" : "Medium"})`).join(", ")}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {data.assessment.transition_run_at && (
                                <TableRow>
                                    <TableCell className="font-medium">Carbon pricing</TableCell>
                                    <TableCell>Transition</TableCell>
                                    <TableCell>Policy and legal</TableCell>
                                    <TableCell>{horizonYears(data).join(" · ")}</TableCell>
                                    <TableCell className="text-[12px]">
                                        {priced.length} facilities with Scope 1 emissions
                                        {priced.length < data.facilities.length && ` (${data.facilities.length - priced.length} not rated: emissions missing)`}
                                    </TableCell>
                                </TableRow>
                            )}
                            {physical.length === 0 && !data.assessment.transition_run_at && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-on-surface-variant">
                                        No Medium or High climate hazard found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
            <p className="text-[11px] text-on-surface-variant">Physical risks list climate hazards at Medium or High in at least one facility district.</p>
        </section>
    );
}

function HowAssessed({ data }: { data: AssessmentDetail }) {
    const a = data.assessment;
    const items: [string, React.ReactNode][] = [
        ["Inputs", "Facility districts (analyst-confirmed), Scope 1 and 2 per facility, company revenue, CCTS and CBAM flags"],
        ["Hazard data", "ThinkHazard! (GFDRR), district level, one call per district"],
        ["Scenarios", `NGFS long-term scenarios, ${data.carbon_prices[0]?.ngfs_phase}: Net Zero 2050 (Orderly), Delayed Transition (Disorderly), Current Policies (Hot house world)`],
        ["Time horizons", `Short ${a.horizon_short} · Medium ${a.horizon_medium} · Long ${a.horizon_long}`],
        ["Ruleset", `${data.ruleset.label} v${data.ruleset.version}, effective ${data.ruleset.effective_from}. Thresholds ${data.ruleset.thresholds.a_pct}% / ${data.ruleset.thresholds.b_pct}%, USD→INR ${data.ruleset.usd_inr_rate}`],
        ["Run dates", `Physical ${formatDateTime(a.physical_run_at)} · Transition ${formatDateTime(a.transition_run_at)}`],
        ["Status", a.approved_at ? `Approved by ${a.approved_by}, ${formatDateTime(a.approved_at)}` : "Not yet approved"],
    ];
    return (
        <section className="space-y-3" aria-labelledby="how">
            <SectionTitle id="how" aside={<Ref>IFRS S2 paras 22(b) and 25(a)</Ref>}>
                How we assessed
            </SectionTitle>
            <Card>
                <dl className="divide-y divide-outline-variant/50">
                    {items.map(([k, v]) => (
                        <div key={k} className="grid gap-1 px-card-padding py-2.5 sm:grid-cols-[160px_1fr]">
                            <dt className="text-[12px] font-semibold text-on-surface-variant">{k}</dt>
                            <dd className="text-[13px]">{v}</dd>
                        </div>
                    ))}
                </dl>
            </Card>
        </section>
    );
}

function Metrics({ data }: { data: AssessmentDetail }) {
    const ratingOf = (fid: string) => data.ratings.find((r) => r.scope === "facility" && r.entity_id === fid && r.risk_type === "physical")?.final_rating;
    const high = data.facilities.filter((f) => ratingOf(f.id) === "high").length;
    const s1 = data.facilities.reduce((s, f) => s + (f.scope1_tco2e ?? 0), 0);
    const s2 = data.facilities.reduce((s, f) => s + (f.scope2_tco2e ?? 0), 0);
    const missing = data.facilities.filter((f) => f.scope1_tco2e === null).length;
    const ccts = cctsShare(data.facilities.map((f) => ({ scope1_tco2e: f.scope1_tco2e, ccts_covered: data.flags.find((x) => x.facility_id === f.id)?.ccts_covered ?? "unknown" })));
    const grid = data.assessment.transition_run_at ? companyGrid(data) : [];

    const tiles = [
        { label: "Scope 1", value: `${formatT(s1)} tCO₂e`, note: missing ? `${missing} facility missing` : "GHG engine", ref: "29(a)" },
        { label: "Scope 2", value: `${formatT(s2)} tCO₂e`, note: "Shown, not priced", ref: "29(a)" },
        { label: "Facilities rated High (physical)", value: `${high} of ${data.facilities.length}`, note: `${formatPct((high / data.facilities.length) * 100, 0)} · facility count basis`, ref: "29(c)" },
        { label: "Scope 1 under CCTS", value: formatPct(ccts.pct), note: ccts.unknownCount ? `${ccts.unknownCount} unknown, left out` : "SASB EM-IS-110a.1", ref: "" },
        { label: "SASB industry", value: data.company.sasb_industry_code ?? "Not set", note: data.company.sasb_industry_name ?? "", ref: "" },
    ];

    return (
        <section className="space-y-3" aria-labelledby="metrics">
            <SectionTitle id="metrics" aside={<Ref>IFRS S2 para 29(a), (c), (f)</Ref>}>
                Metrics
            </SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {tiles.map((t) => (
                    <Card key={t.label}>
                        <CardBody className="space-y-1">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">{t.label}</p>
                            <p className="text-headline-sm tabular-nums">{t.value}</p>
                            <p className="text-[11px] text-on-surface-variant">{t.note}</p>
                        </CardBody>
                    </Card>
                ))}
            </div>
            {grid.length > 0 && (
                <Card>
                    <CardHeader>
                        <span className="text-[13px] font-semibold">Carbon cost grid</span>
                        <span className="text-[11px] text-on-surface-variant">If emissions stay at today’s level · INR and % of revenue</span>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Scenario</TableHead>
                                    {horizonYears(data).map((y) => (
                                        <TableHead key={y} className="text-right">
                                            {y}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {grid.map((g) => (
                                    <TableRow key={g.scenario}>
                                        <TableCell className="font-medium">{SCENARIO_LABEL[g.scenario]}</TableCell>
                                        {g.cells.map((c) => (
                                            <TableCell key={c.year} className="text-right tabular-nums">
                                                {formatCrore(c.cost)} {c.share !== null && <span className="text-[12px] text-on-surface-variant">{formatPct(c.share, 2)}</span>}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}
        </section>
    );
}

function Sources({ data }: { data: AssessmentDetail }) {
    const latest = data.snapshots.filter((s) => s.run === data.assessment.physical_runs);
    const ok = latest.filter((s) => s.fetch_status === "ok").length;
    const sources = [
        { name: "ThinkHazard! (GFDRR)", use: `Hazard level per district · ${ok} of ${latest.length} districts fetched in the latest run`, credit: "Hazard levels CC-BY", href: "https://thinkhazard.org/en/about" },
        { name: `NGFS long-term scenarios, ${data.carbon_prices[0]?.ngfs_phase}`, use: "Carbon price per scenario and year", credit: "Free and public; phase cited", href: "https://www.ngfs.net/ngfs-scenarios-portal/" },
        { name: "GreenLedger GHG engine", use: `Scope 1 and 2 per facility, FY ${data.assessment.reporting_year}`, credit: "Internal", href: null },
        { name: "Analyst input", use: "Revenue, district matches, CCTS coverage and CBAM exporter flags", credit: "Internal", href: null },
    ];
    return (
        <section className="space-y-3" aria-labelledby="sources">
            <SectionTitle id="sources">Sources</SectionTitle>
            <Card>
                <ul className="divide-y divide-outline-variant/50">
                    {sources.map((s) => (
                        <li key={s.name} className="grid gap-1 px-card-padding py-2.5 text-[13px] sm:grid-cols-[260px_1fr_200px]">
                            <span className="font-medium">{s.href ? <SourceLink href={s.href}>{s.name}</SourceLink> : s.name}</span>
                            <span className="text-on-surface-variant">{s.use}</span>
                            <span className="text-[12px] text-on-surface-variant">{s.credit}</span>
                        </li>
                    ))}
                </ul>
            </Card>
            <p className="text-[11px] text-on-surface-variant">
                Labels are written in our own words; IFRS S2 and SASB content is referenced by paragraph number and link only.
            </p>
        </section>
    );
}
