"use client";

import { Fragment, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { cn } from "@/lib/utils/cn";
import { runTransition, setPolicyFlag } from "@/lib/climateRisk/api";
import { cctsShare, costShareRating, priceInr, SCENARIO_LABEL } from "@/lib/climateRisk/engine";
import { useRiskAction } from "@/lib/climateRisk/hooks";
import type { AssessmentDetail, ScenarioKey, TransitionResult, TriState } from "@/lib/climateRisk/types";
import { ErrorNote, formatCrore, formatDateTime, formatInr, formatPct, formatT, NotRatedNote, QualityTag, RatingBadge, SourceLink, TriTag } from "./RiskUi";
import { LimitsFooter } from "./PhysicalTab";

type Props = { data: AssessmentDetail; canEdit: boolean };
const SCENARIOS: ScenarioKey[] = ["net_zero_2050", "delayed_transition", "current_policies"];
const DOT = { low: "bg-[#0ca30c]", medium: "bg-[#fab219]", high: "bg-[#d03b3b]" } as const;

export function horizonYears(d: AssessmentDetail) {
    return [d.assessment.horizon_short, d.assessment.horizon_medium, d.assessment.horizon_long];
}

/** Company grid: summed facility costs per scenario × year. Facilities with missing Scope 1 are counted, never zeroed. */
export function companyGrid(d: AssessmentDetail) {
    const rev = d.assessment.revenue_inr;
    return SCENARIOS.map((scenario) => ({
        scenario,
        cells: horizonYears(d).map((year) => {
            const rows = d.transition.filter((t) => t.scenario === scenario && t.year === year);
            const known = rows.filter((t) => t.carbon_cost_inr !== null);
            const cost = known.length ? known.reduce((s, t) => s + (t.carbon_cost_inr as number), 0) : null;
            return { year, cost, share: cost !== null && rev ? (cost / rev) * 100 : null, missing: rows.length - known.length };
        }),
    }));
}

export function TransitionTab({ data, canEdit }: Props) {
    const a = data.assessment;
    const action = useRiskAction();
    const company = data.ratings.find((r) => r.scope === "company" && r.risk_type === "transition");
    const years = horizonYears(data);
    const grid = companyGrid(data);
    const t = data.ruleset.thresholds;
    const worst = grid.flatMap((g) => g.cells.map((c) => ({ ...c, scenario: g.scenario }))).reduce<{ share: number | null; scenario?: string; year?: number }>(
        (w, c) => (c.share !== null && (w.share === null || c.share > w.share) ? c : w),
        { share: null },
    );
    const rows = data.facilities.map((f) => ({
        f,
        flag: data.flags.find((x) => x.facility_id === f.id),
        rating: data.ratings.find((r) => r.scope === "facility" && r.entity_id === f.id && r.risk_type === "transition"),
        results: data.transition.filter((x) => x.facility_id === f.id),
    }));
    const ccts = cctsShare(rows.map((r) => ({ scope1_tco2e: r.f.scope1_tco2e, ccts_covered: r.flag?.ccts_covered ?? "unknown" })));
    const scope1Total = rows.reduce((s, r) => s + (r.f.scope1_tco2e ?? 0), 0);
    const scope2Total = rows.reduce((s, r) => s + (r.f.scope2_tco2e ?? 0), 0);
    const missingS1 = rows.filter((r) => r.f.scope1_tco2e === null).length;

    return (
        <div className="space-y-6">
            <Card>
                <CardBody className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <p className="text-[13px] font-semibold">Carbon cost under three NGFS scenarios</p>
                        <p className="text-[12px] text-on-surface-variant">
                            Pulls Scope 1 and 2 per facility from the GHG engine (read, never recalculated), prices Scope 1 at each horizon, and reads CCTS and
                            CBAM flags. Scope 2 is shown but not priced.
                        </p>
                        <p className="text-[12px] text-on-surface-variant">
                            Last run: {formatDateTime(a.transition_run_at)}
                            {a.transition_runs > 1 && ` · run ${a.transition_runs}; earlier runs stay stored and are in the audit trail`}
                        </p>
                        <ErrorNote error={action.error} />
                    </div>
                    {canEdit && (
                        <Button onClick={() => action.mutate(() => runTransition(a.id))} disabled={action.isPending} className="self-start md:self-auto">
                            <MaterialIcon name={action.isPending ? "progress_activity" : "play_arrow"} size="sm" className={action.isPending ? "animate-spin" : ""} />
                            {action.isPending ? "Computing…" : a.transition_run_at ? "Re-run transition step" : "Run transition step"}
                        </Button>
                    )}
                </CardBody>
            </Card>

            {!a.transition_run_at ? (
                <p className="rounded-lg border border-dashed border-outline-variant py-12 text-center text-body-sm text-on-surface-variant">
                    No carbon cost results yet. Run the transition step.
                </p>
            ) : (
                <>
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                        <Card>
                            <CardHeader>
                                <span className="text-[13px] font-semibold">Company carbon cost</span>
                                <span className="text-[11px] text-on-surface-variant">If emissions stay at today’s level</span>
                            </CardHeader>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-outline-variant">
                                            <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Scenario</th>
                                            {years.map((y) => (
                                                <th key={y} className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                                    {y}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/40">
                                        {grid.map((g) => (
                                            <tr key={g.scenario}>
                                                <td className="px-4 py-3">
                                                    <p className="text-[13px] font-medium">{SCENARIO_LABEL[g.scenario]}</p>
                                                    <p className="text-[11px] text-on-surface-variant">
                                                        {data.carbon_prices.find((p) => p.scenario === g.scenario)?.ngfs_family}
                                                    </p>
                                                </td>
                                                {g.cells.map((c) => {
                                                    const isWorst = worst.share !== null && c.share === worst.share && worst.scenario === g.scenario && worst.year === c.year;
                                                    const band = c.share !== null ? costShareRating(c.share, t) : null;
                                                    return (
                                                        <td key={c.year} className={cn("px-4 py-3 text-right align-top", isWorst && "bg-surface-container-low")}>
                                                            <p className="text-[13px] font-semibold tabular-nums">{formatCrore(c.cost)}</p>
                                                            <p className="flex items-center justify-end gap-1.5 text-[12px] tabular-nums text-on-surface-variant">
                                                                {band && <span className={cn("h-2 w-2 rounded-full", DOT[band])} aria-hidden />}
                                                                {c.share !== null ? `${formatPct(c.share, 2)} of revenue` : "Revenue missing"}
                                                            </p>
                                                            {isWorst && <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-on-surface">Worst case</p>}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="border-t border-outline-variant px-card-padding py-2.5 text-[11px] text-on-surface-variant">
                                Bands on {data.ruleset.label} thresholds: below {t.a_pct}% Low · {t.a_pct}–{t.b_pct}% Medium · above {t.b_pct}% High.
                                {missingS1 > 0 && ` Totals exclude ${missingS1} facility with missing Scope 1; it is not counted as zero.`}
                            </p>
                        </Card>

                        <div className="space-y-4">
                            <Card>
                                <CardBody>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Company transition rating</p>
                                    <div className="mt-2">{company && <RatingBadge rating={company.final_rating} size="lg" />}</div>
                                    <p className="mt-2 text-[12px] text-on-surface-variant">{company?.driver}</p>
                                    <NotRatedNote reason={company?.not_rated_reason ?? null} className="mt-2" />
                                    <p className="mt-2 text-[11px] text-on-surface-variant/80">Worst of the nine cost shares</p>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody className="space-y-3">
                                    <Metric label="Scope 1 (priced)" value={`${formatT(scope1Total)} tCO₂e`} note={missingS1 ? `${missingS1} facility missing` : undefined} />
                                    <Metric label="Scope 2 (shown, not priced)" value={`${formatT(scope2Total)} tCO₂e`} />
                                    <Metric
                                        label="Scope 1 under CCTS"
                                        value={formatPct(ccts.pct)}
                                        note={ccts.unknownCount ? `${ccts.unknownCount} facility with unknown coverage left out of the top number` : "Mirrors SASB EM-IS-110a.1"}
                                    />
                                </CardBody>
                            </Card>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <span className="text-[13px] font-semibold">By facility</span>
                            <span className="text-[11px] text-on-surface-variant">Flags sit next to the rating and do not change it</span>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead>Facility</TableHead>
                                        <TableHead className="text-right">Scope 1 tCO₂e</TableHead>
                                        <TableHead>Data quality</TableHead>
                                        <TableHead className="text-right">Scope 2 tCO₂e</TableHead>
                                        <TableHead>CCTS covered</TableHead>
                                        <TableHead>CBAM exporter</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead className="sr-only">Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rows.map((r) => (
                                        <FacilityRow key={r.f.id} row={r} years={years} canEdit={canEdit} assessmentId={a.id} revenue={a.revenue_inr} />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>

                    <PricesUsed data={data} years={years} />
                </>
            )}
            <LimitsFooter />
        </div>
    );
}

function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
    return (
        <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">{label}</p>
            <p className="text-headline-sm tabular-nums text-on-surface">{value}</p>
            {note && <p className="text-[11px] text-on-surface-variant">{note}</p>}
        </div>
    );
}

type Row = {
    f: AssessmentDetail["facilities"][number];
    flag?: AssessmentDetail["flags"][number];
    rating?: AssessmentDetail["ratings"][number];
    results: TransitionResult[];
};

function FacilityRow({ row: r, years, canEdit, assessmentId, revenue }: { row: Row; years: number[]; canEdit: boolean; assessmentId: string; revenue: number | null }) {
    const [open, setOpen] = useState(false);
    const action = useRiskAction();
    return (
        <Fragment>
            <TableRow>
                <TableCell>
                    <p className="font-medium">{r.f.name}</p>
                    <p className="text-[11px] text-on-surface-variant">{r.f.facility_code}</p>
                </TableCell>
                <TableCell className="text-right tabular-nums">{r.f.scope1_tco2e === null ? <span className="text-on-surface-variant">Missing</span> : formatT(r.f.scope1_tco2e)}</TableCell>
                <TableCell>
                    <QualityTag quality={r.f.scope1_quality} />
                </TableCell>
                <TableCell className="text-right tabular-nums text-on-surface-variant">{formatT(r.f.scope2_tco2e)}</TableCell>
                {(["ccts_covered", "cbam_exporter"] as const).map((flag) => (
                    <TableCell key={flag}>
                        {canEdit && r.flag ? (
                            <select
                                aria-label={`${flag === "ccts_covered" ? "CCTS coverage" : "CBAM exporter"} for ${r.f.name}`}
                                className="h-8 rounded-md border border-outline-variant bg-white px-2 text-[12px]"
                                value={r.flag[flag]}
                                disabled={action.isPending}
                                onChange={(e) => {
                                    // Read the choice now: by the time the save runs, React has reset this controlled select.
                                    const value = e.target.value as TriState;
                                    action.mutate(() => setPolicyFlag(assessmentId, r.f.id, { [flag]: value }));
                                }}>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                                <option value="unknown">Unknown</option>
                            </select>
                        ) : (
                            r.flag && <TriTag value={r.flag[flag]} />
                        )}
                    </TableCell>
                ))}
                <TableCell className="min-w-[150px]">
                    {r.rating && <RatingBadge rating={r.rating.final_rating} />}
                    <NotRatedNote reason={r.rating?.not_rated_reason ?? null} className="mt-1" />
                </TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={`Show carbon cost grid for ${r.f.name}`}>
                        <MaterialIcon name={open ? "expand_less" : "expand_more"} size="md" />
                    </Button>
                </TableCell>
            </TableRow>
            {open && (
                <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={8} className="bg-surface-container-low/60">
                        <div className="grid gap-2 sm:grid-cols-3">
                            {SCENARIOS.map((s) => (
                                <div key={s} className="rounded-md border border-outline-variant bg-surface-container-lowest p-3">
                                    <p className="mb-1.5 text-[12px] font-semibold">{SCENARIO_LABEL[s]}</p>
                                    {years.map((y) => {
                                        const res = r.results.find((x) => x.scenario === s && x.year === y);
                                        return (
                                            <div key={y} className="flex justify-between gap-2 text-[12px] tabular-nums">
                                                <span className="text-on-surface-variant">{y}</span>
                                                <span>
                                                    {res?.carbon_cost_inr == null ? "Not rated" : formatCrore(res.carbon_cost_inr)}
                                                    {res?.carbon_cost_inr != null && revenue ? (
                                                        <span className="ml-1.5 text-on-surface-variant">{formatPct((res.carbon_cost_inr / revenue) * 100, 2)}</span>
                                                    ) : null}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                        {r.rating?.driver && <p className="mt-2 text-[11px] text-on-surface-variant">Rating driven by {r.rating.driver}.</p>}
                    </TableCell>
                </TableRow>
            )}
            {action.error && (
                <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={8} className="pt-0">
                        <ErrorNote error={action.error} />
                    </TableCell>
                </TableRow>
            )}
        </Fragment>
    );
}

function PricesUsed({ data, years }: { data: AssessmentDetail; years: number[] }) {
    const rate = data.ruleset.usd_inr_rate;
    return (
        <Card>
            <CardHeader>
                <span className="text-[13px] font-semibold">Carbon prices used</span>
                <span className={cn("text-[11px]", data.ruleset.label === "DEV" ? "font-semibold text-[#9a5b00]" : "text-on-surface-variant")}>
                    {data.ruleset.label === "DEV" ? "DEV placeholders, not NGFS values" : `Ruleset ${data.ruleset.label} v${data.ruleset.version}`}
                </span>
            </CardHeader>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Scenario</TableHead>
                            {years.map((y) => (
                                <TableHead key={y} className="text-right">
                                    {y} · ₹/tCO₂e
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {SCENARIOS.map((s) => (
                            <TableRow key={s}>
                                <TableCell className="font-medium">{SCENARIO_LABEL[s]}</TableCell>
                                {years.map((y) => {
                                    const p = data.carbon_prices.find((x) => x.scenario === s && x.year === y);
                                    return (
                                        <TableCell key={y} className="text-right tabular-nums">
                                            {p ? formatInr(priceInr(p, rate)) : "—"}
                                            {p?.currency === "USD" && <span className="ml-1.5 text-[11px] text-on-surface-variant">(${p.price})</span>}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <p className="border-t border-outline-variant px-card-padding py-2.5 text-[11px] text-on-surface-variant">
                NGFS long-term scenarios, {data.carbon_prices[0]?.ngfs_phase}. USD to INR at {rate}. Only carbon prices are taken from NGFS.{" "}
                <SourceLink href="https://www.ngfs.net/ngfs-scenarios-portal/">NGFS Scenarios Portal</SourceLink>
            </p>
        </Card>
    );
}
