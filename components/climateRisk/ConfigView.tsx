"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { cn } from "@/lib/utils/cn";
import { SCENARIO_LABEL } from "@/lib/climateRisk/engine";
import { useRulesets } from "@/lib/climateRisk/hooks";
import type { CarbonPrice, HazardRiskType, RulesetVersion, ScenarioKey } from "@/lib/climateRisk/types";
import { ErrorNote, formatDate, formatInr, SourceLink } from "./RiskUi";

const RISK_TYPE_LABEL: Record<HazardRiskType, string> = { acute: "Acute", chronic: "Chronic", non_climate: "Not climate" };
const SCENARIOS: ScenarioKey[] = ["net_zero_2050", "delayed_transition", "current_policies"];

/** Read-only view of the ruleset versions. The methodology lead edits them in the platform admin (/admin/climate-risk/rulesets). */
export function ConfigView() {
    const { data, isPending, error } = useRulesets();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const rulesets = data?.rulesets ?? [];
    const selected = rulesets.find((r) => r.id === selectedId) ?? rulesets[0];

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <Link href="/risk-assessment" className="inline-flex items-center gap-1 text-[12px] font-medium text-on-surface-variant hover:text-on-surface">
                    <MaterialIcon name="arrow_back" size="sm" />
                    All assessments
                </Link>
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Ruleset config</h2>
                    <p className="mt-1 max-w-2xl text-body-md text-on-surface-variant">
                        Carbon prices, thresholds, hazard mapping and the USD to INR rate. Settings are frozen per version: a change is a new version, and only
                        new assessments pick it up.
                    </p>
                </div>
                <p className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-[12px] text-on-surface-variant">
                    <MaterialIcon name="visibility" size="sm" />
                    Read only. The GreenLedger methodology lead publishes new versions from the platform admin.
                </p>
            </div>

            {isPending && <p className="text-on-surface-variant">Loading rulesets…</p>}
            <ErrorNote error={error} />

            {selected && data && (
                <div className="grid gap-6 xl:grid-cols-[240px_1fr]">
                    <nav aria-label="Ruleset versions" className="space-y-1 self-start">
                        {rulesets.map((r) => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => setSelectedId(r.id)}
                                aria-current={r.id === selected.id ? "true" : undefined}
                                className={cn(
                                    "flex w-full cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-left",
                                    r.id === selected.id ? "border-on-surface bg-surface-container-lowest" : "border-transparent hover:bg-surface-container-high",
                                )}>
                                <span>
                                    <span className="block text-[13px] font-semibold">
                                        {r.label} v{r.version}
                                    </span>
                                    <span className="block text-[11px] text-on-surface-variant">From {formatDate(r.effective_from)}</span>
                                </span>
                                {r.label === "DEV" && <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9a5b00]">Dev</span>}
                            </button>
                        ))}
                    </nav>
                    <RulesetDetails ruleset={selected} prices={data.prices.filter((p) => p.ruleset_version_id === selected.id)} />
                </div>
            )}
        </div>
    );
}

function RulesetDetails({ ruleset, prices }: { ruleset: RulesetVersion; prices: CarbonPrice[] }) {
    const years = [...new Set(prices.map((p) => p.year))].sort();
    const price = (s: ScenarioKey, y: number) => prices.find((p) => p.scenario === s && p.year === y);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <span className="text-[13px] font-semibold">
                        {ruleset.label} v{ruleset.version}
                    </span>
                    {ruleset.label === "DEV" && <span className="text-[11px] font-semibold text-[#9a5b00]">Development only, can never ship to a client</span>}
                </CardHeader>
                <CardBody className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Value label="Label" value={ruleset.label} />
                    <Value label="Threshold A" hint="Below A is Low" value={`${ruleset.thresholds.a_pct}%`} />
                    <Value label="Threshold B" hint="Above B is High" value={`${ruleset.thresholds.b_pct}%`} />
                    <Value label="USD to INR" hint="Used to convert NGFS prices" value={String(ruleset.usd_inr_rate)} />
                    {ruleset.notes && <Value label="Notes" value={ruleset.notes} className="sm:col-span-2 lg:col-span-4" />}
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <span className="text-[13px] font-semibold">Carbon prices per tCO₂e</span>
                    <span className="text-[12px]">
                        <SourceLink href="https://www.ngfs.net/ngfs-scenarios-portal/">NGFS Scenarios Portal</SourceLink>
                    </span>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Scenario</TableHead>
                                {years.map((y) => (
                                    <TableHead key={y} className="text-right">
                                        {y}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {SCENARIOS.map((s) => (
                                <TableRow key={s}>
                                    <TableCell>
                                        <p className="font-medium">{SCENARIO_LABEL[s]}</p>
                                        <p className="text-[11px] text-on-surface-variant">{prices.find((p) => p.scenario === s)?.ngfs_family}</p>
                                    </TableCell>
                                    {years.map((y) => {
                                        const p = price(s, y);
                                        const inr = p ? (p.currency === "USD" ? p.price * ruleset.usd_inr_rate : p.price) : null;
                                        return (
                                            <TableCell key={y} className="text-right">
                                                <span className="tabular-nums">{p ? `${p.currency === "USD" ? "$" : "₹"}${p.price}` : "—"}</span>
                                                {inr !== null && <span className="block text-[11px] tabular-nums text-on-surface-variant">{formatInr(inr)}</span>}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <p className="border-t border-outline-variant px-card-padding py-2.5 text-[11px] text-on-surface-variant">
                    {prices[0]?.ngfs_phase}. The NGFS Phase VI set will replace these as a new version.
                </p>
            </Card>

            <Card>
                <CardHeader>
                    <span className="text-[13px] font-semibold">Hazard mapping</span>
                    <span className="text-[11px] text-on-surface-variant">Codes as returned by the ThinkHazard API</span>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Code</TableHead>
                                <TableHead>Hazard</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Counts in climate rating</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ruleset.hazard_mapping.map((m) => (
                                <TableRow key={m.code} className={cn(!m.counts_in_rating && "text-on-surface-variant")}>
                                    <TableCell className="font-mono text-[12px]">{m.code}</TableCell>
                                    <TableCell>{m.name}</TableCell>
                                    <TableCell>{RISK_TYPE_LABEL[m.risk_type]}</TableCell>
                                    <TableCell>{m.counts_in_rating ? "Yes" : "No, shown for information"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <p className="border-t border-outline-variant px-card-padding py-2.5 text-[11px] text-on-surface-variant">
                    The spec lists urban flood as PF and cyclone as TC; the live API returns UF and CY, so those are used here.
                </p>
            </Card>
        </div>
    );
}

function Value({ label, value, hint, className }: { label: string; value: string; hint?: string; className?: string }) {
    return (
        <div className={cn("flex flex-col gap-1", className)}>
            <span className="text-[12px] font-semibold text-on-surface-variant">{label}</span>
            <span className="text-body-md">{value}</span>
            {hint && <span className="text-[11px] text-on-surface-variant">{hint}</span>}
        </div>
    );
}
