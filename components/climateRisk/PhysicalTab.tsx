"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { cn } from "@/lib/utils/cn";
import { runPhysical } from "@/lib/climateRisk/api";
import { useRiskAction } from "@/lib/climateRisk/hooks";
import type { AssessmentDetail, HazardLevel, HazardSnapshot } from "@/lib/climateRisk/types";
import { ErrorNote, formatDateTime, HazardChip, levelText, LIMITS, NotRatedNote, RatingBadge, SourceLink, THINKHAZARD_CREDIT } from "./RiskUi";

type Props = { data: AssessmentDetail; canEdit: boolean };

export function PhysicalTab({ data, canEdit }: Props) {
    const a = data.assessment;
    const action = useRiskAction();
    const climate = data.ruleset.hazard_mapping.filter((m) => m.counts_in_rating);
    const info = data.ruleset.hazard_mapping.filter((m) => !m.counts_in_rating);
    const rating = (fid: string) => data.ratings.find((r) => r.scope === "facility" && r.entity_id === fid && r.risk_type === "physical");
    const company = data.ratings.find((r) => r.scope === "company" && r.risk_type === "physical");
    const highCount = data.facilities.filter((f) => rating(f.id)?.final_rating === "high").length;
    const notRatedCount = data.facilities.filter((f) => rating(f.id)?.final_rating === "not_rated").length;
    const level = (fid: string, code: string): HazardLevel | null => data.hazards.find((h) => h.facility_id === fid && h.hazard_code === code)?.level ?? null;

    const run = () => action.mutate(() => runPhysical(a.id));

    return (
        <div className="space-y-6">
            <Card>
                <CardBody className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <p className="text-[13px] font-semibold">Hazard screen by district</p>
                        <p className="text-[12px] text-on-surface-variant">
                            One ThinkHazard call per district, reused for every facility in it. Each raw reply is stored before scoring. A facility takes the
                            level of its worst climate hazard.
                        </p>
                        <p className="text-[12px] text-on-surface-variant">
                            Last run: {formatDateTime(a.physical_run_at)}
                            {a.physical_runs > 1 && ` · run ${a.physical_runs}; earlier runs stay stored below`}
                        </p>
                        <ErrorNote error={action.error} />
                    </div>
                    {canEdit && (
                        <Button onClick={run} disabled={action.isPending} className="self-start md:self-auto">
                            <MaterialIcon name={action.isPending ? "progress_activity" : "play_arrow"} size="sm" className={action.isPending ? "animate-spin" : ""} />
                            {action.isPending ? "Fetching hazards…" : a.physical_run_at ? "Re-run physical screen" : "Run physical screen"}
                        </Button>
                    )}
                </CardBody>
            </Card>

            {!a.physical_run_at ? (
                <p className="rounded-lg border border-dashed border-outline-variant py-12 text-center text-body-sm text-on-surface-variant">
                    No hazard data yet. Confirm facility districts in Setup, then run the physical screen.
                </p>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Stat label="Company physical rating" note="Worst facility rating">
                            {company && <RatingBadge rating={company.final_rating} size="lg" />}
                            <p className="mt-2 text-[12px] text-on-surface-variant">{company?.driver}</p>
                            <NotRatedNote reason={company?.not_rated_reason ?? null} className="mt-2" />
                        </Stat>
                        <Stat label="Facilities rated High" note="Facility count basis, not asset value">
                            <p className="font-display text-headline-lg text-on-surface">
                                {highCount} <span className="text-headline-sm font-normal text-on-surface-variant">of {data.facilities.length}</span>
                            </p>
                            <p className="text-[12px] text-on-surface-variant">{((highCount / data.facilities.length) * 100).toFixed(0)}% of facilities</p>
                        </Stat>
                        <Stat label="Not rated" note="Missing is never treated as Low">
                            <p className="font-display text-headline-lg text-on-surface">{notRatedCount}</p>
                            <p className="text-[12px] text-on-surface-variant">
                                {notRatedCount === 0 ? "Every facility has hazard data" : "See the reason on each row"}
                            </p>
                        </Stat>
                    </div>

                    <Card>
                        <CardHeader>
                            <span className="text-[13px] font-semibold">Facility × hazard</span>
                            <span className="text-[11px] text-on-surface-variant">Today’s hazard · tagged short term</span>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-[13px]">
                                <thead>
                                    <tr className="border-b border-outline-variant bg-surface-container-high/30">
                                        <th className="sticky left-0 z-10 bg-surface-container-lowest px-4 py-2 align-bottom text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Facility
                                        </th>
                                        <th className="px-3 py-2 align-bottom text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Rating</th>
                                        {climate.map((m) => (
                                            <th key={m.code} className="px-1 py-2 text-center align-bottom">
                                                <span className="block text-[11px] font-semibold leading-tight text-on-surface">{m.name}</span>
                                                <span className="block text-[10px] uppercase tracking-wider text-on-surface-variant">{m.risk_type}</span>
                                            </th>
                                        ))}
                                        {info.map((m, i) => (
                                            <th key={m.code} className={cn("px-1 py-2 text-center align-bottom", i === 0 && "border-l border-outline-variant")}>
                                                <span className="block text-[11px] font-medium leading-tight text-on-surface-variant/70">{m.name}</span>
                                                <span className="block text-[10px] uppercase tracking-wider text-on-surface-variant/60">Not climate</span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/40">
                                    {data.facilities.map((f) => {
                                        const r = rating(f.id);
                                        return (
                                            <tr key={f.id} className="hover:bg-surface-container-low/60">
                                                <td className="sticky left-0 z-10 min-w-[180px] bg-surface-container-lowest px-4 py-3">
                                                    <p className="font-medium">{f.name}</p>
                                                    <p className="text-[11px] text-on-surface-variant">{f.location.thinkhazard_label ?? `${f.city}, ${f.state}`}</p>
                                                </td>
                                                {/* Drivers are visible in the grid itself and on the report tab; the title keeps them on hover. */}
                                                <td className="w-[120px] px-3 py-3" title={r?.driver ?? undefined}>
                                                    {r && <RatingBadge rating={r.final_rating} />}
                                                    <NotRatedNote reason={r?.not_rated_reason ?? null} className="mt-1" />
                                                </td>
                                                {climate.map((m) => {
                                                    const l = level(f.id, m.code);
                                                    return (
                                                        <td key={m.code} className="px-1 py-3 text-center">
                                                            <HazardChip level={l} title={l ? `${m.name} (${m.risk_type}): ${levelText(l)}` : undefined} />
                                                        </td>
                                                    );
                                                })}
                                                {info.map((m, i) => {
                                                    const l = level(f.id, m.code);
                                                    return (
                                                        <td key={m.code} className={cn("px-1 py-3 text-center", i === 0 && "border-l border-outline-variant")}>
                                                            <HazardChip level={l} muted title={l ? `${m.name}: ${levelText(l)}. Shown for information, not in the rating.` : undefined} />
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-outline-variant px-card-padding py-3 text-[11px] text-on-surface-variant">
                            <span className="font-semibold uppercase tracking-wider">Scale</span>
                            {(["VLO", "LOW", "MED", "HIG", "no-data"] as HazardLevel[]).map((l) => (
                                <span key={l} className="flex items-center gap-1.5">
                                    <HazardChip level={l} />
                                    <span>{{ VLO: "0 pts", LOW: "1 pt", MED: "2 pts", HIG: "3 pts", "no-data": "not scored" }[l]}</span>
                                </span>
                            ))}
                            <span>· Rating: 3 = High, 2 = Medium, 0–1 = Low</span>
                        </div>
                    </Card>

                    <SnapshotList data={data} />
                </>
            )}

            <LimitsFooter />
        </div>
    );
}

function Stat({ label, note, children }: { label: string; note: string; children: React.ReactNode }) {
    return (
        <Card>
            <CardBody>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">{label}</p>
                <div className="mt-2">{children}</div>
                <p className="mt-2 text-[11px] text-on-surface-variant/80">{note}</p>
            </CardBody>
        </Card>
    );
}

function SnapshotList({ data }: { data: AssessmentDetail }) {
    const [open, setOpen] = useState<string | null>(null);
    const [showEarlier, setShowEarlier] = useState(false);
    const latestRun = data.assessment.physical_runs;
    const latest = data.snapshots.filter((s) => s.run === latestRun);
    const earlier = data.snapshots.filter((s) => s.run !== latestRun);

    const item = (s: HazardSnapshot) => (
        <li key={s.id} className="px-card-padding py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    <MaterialIcon
                        name={s.fetch_status === "ok" ? "cloud_done" : "cloud_off"}
                        size="sm"
                        className={s.fetch_status === "ok" ? "text-secondary" : "text-error"}
                    />
                    <span className="text-[13px] font-medium">{s.division_label}</span>
                    <span className="text-[11px] text-on-surface-variant">
                        Run {s.run} · {s.fetch_status === "ok" ? "Fetched" : `Failed after ${s.attempts} attempts`} · {formatDateTime(s.fetched_at)} ·{" "}
                        {s.facility_ids.length} {s.facility_ids.length === 1 ? "facility" : "facilities"}
                    </span>
                </div>
                <div className="flex items-center gap-3 text-[12px]">
                    <SourceLink href={s.source_url}>Source</SourceLink>
                    {s.raw_json && (
                        <button
                            type="button"
                            className="cursor-pointer text-on-surface-variant underline-offset-2 hover:underline"
                            aria-expanded={open === s.id}
                            onClick={() => setOpen(open === s.id ? null : s.id)}>
                            {open === s.id ? "Hide JSON" : "View JSON"}
                        </button>
                    )}
                </div>
            </div>
            {open === s.id && s.raw_json && (
                <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-surface-container-low p-3 font-mono text-[11px] leading-relaxed text-on-surface-variant">
                    {JSON.stringify(JSON.parse(s.raw_json), null, 2)}
                </pre>
            )}
        </li>
    );

    return (
        <Card>
            <CardHeader>
                <span className="text-[13px] font-semibold">Raw ThinkHazard replies · run {latestRun}</span>
                <span className="text-[11px] text-on-surface-variant">Stored as received, never edited or deleted</span>
            </CardHeader>
            <ul className="divide-y divide-outline-variant/50">{latest.map(item)}</ul>
            {earlier.length > 0 && (
                <div className="border-t border-outline-variant">
                    <button
                        type="button"
                        aria-expanded={showEarlier}
                        onClick={() => setShowEarlier((v) => !v)}
                        className="flex w-full cursor-pointer items-center gap-1.5 px-card-padding py-2.5 text-[12px] font-medium text-on-surface-variant hover:text-on-surface">
                        <MaterialIcon name={showEarlier ? "expand_less" : "expand_more"} size="sm" />
                        Earlier runs: {latestRun - 1} {latestRun - 1 === 1 ? "run" : "runs"}, {earlier.length} stored replies
                    </button>
                    {showEarlier && <ul className="divide-y divide-outline-variant/50 bg-surface-container-low/40">{earlier.map(item)}</ul>}
                </div>
            )}
        </Card>
    );
}

export function LimitsFooter() {
    return (
        <div className="space-y-3 rounded-lg bg-surface-container-low px-card-padding py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Limits</p>
            <ul className="grid gap-3 md:grid-cols-3">
                {LIMITS.map((l) => (
                    <li key={l.title} className="text-[12px] leading-relaxed text-on-surface-variant">
                        <span className="font-semibold text-on-surface">{l.title}.</span> {l.body}
                    </li>
                ))}
            </ul>
            <p className="text-[12px] text-on-surface-variant">
                {THINKHAZARD_CREDIT} <SourceLink href="https://thinkhazard.org/en/about">About ThinkHazard</SourceLink>
            </p>
        </div>
    );
}
