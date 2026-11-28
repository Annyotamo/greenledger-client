"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { cn } from "@/lib/utils/cn";
import { saveFacilityLocation, updateAssessmentSetup, updateCompanySasb } from "@/lib/climateRisk/api";
import { MIN_OVERRIDE_REASON } from "@/lib/climateRisk/engine";
import { useRiskAction, useThinkHazardSearch } from "@/lib/climateRisk/hooks";
import { REPORTING_YEARS, SASB_OPTIONS } from "@/lib/climateRisk/constants";
import type { AssessmentDetail, ThinkHazardDivision } from "@/lib/climateRisk/types";
import { CRORE, ErrorNote, formatCrore, formatDateTime, SourceLink } from "./RiskUi";

type Props = { data: AssessmentDetail; canEdit: boolean };

// ThinkHazard keeps pre-2011 / pre-2014 names, so the modern state name will not always match.
const OLD_STATE_NAMES: Record<string, string> = { orissa: "odisha", uttaranchal: "uttarakhand", pondicherry: "puducherry" };
const normState = (s: string) => OLD_STATE_NAMES[s.trim().toLowerCase()] ?? s.trim().toLowerCase();
/** True when both states are known and differ; the server then requires a written reason. */
const stateMismatch = (facilityState: string | null, districtState: string | null | undefined) =>
    Boolean(facilityState && districtState) && normState(facilityState!) !== normState(districtState!);

const selectCls = "h-9 w-full rounded-lg border border-outline-variant bg-white px-3 text-body-md disabled:bg-surface-container-low disabled:text-on-surface-variant";

export function SetupTab({ data, canEdit }: Props) {
    const a = data.assessment;
    const action = useRiskAction();
    const sasbAction = useRiskAction();
    const years = [...new Set(data.carbon_prices.map((p) => p.year))].sort();
    const [year, setYear] = useState(a.reporting_year);
    const yearLocked = Boolean(a.supersedes_id);
    const [revenueCr, setRevenueCr] = useState(a.revenue_inr === null ? "" : String(a.revenue_inr / CRORE));
    const [h, setH] = useState({ short: a.horizon_short, medium: a.horizon_medium, long: a.horizon_long });
    const horizonsValid = h.short < h.medium && h.medium < h.long;
    const revenueValid = revenueCr.trim() === "" || Number(revenueCr) > 0;
    const mapped = data.facilities.filter((f) => f.location.thinkhazard_code !== null).length;

    const save = () => {
        action.mutate(() =>
            updateAssessmentSetup(a.id, {
                reporting_year: year,
                revenue_inr: revenueCr.trim() === "" ? null : Number(revenueCr) * CRORE,
                horizon_short: h.short,
                horizon_medium: h.medium,
                horizon_long: h.long,
            }),
        );
    };

    return (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,360px)_1fr]">
            <Card className="self-start">
                <CardHeader>
                    <span className="text-[13px] font-semibold">Assessment inputs</span>
                </CardHeader>
                <CardBody className="space-y-5">
                    <Field label="Company">
                        <p className="text-body-md">{data.company.name}</p>
                    </Field>
                    <Field
                        label="Reporting year"
                        hint={
                            yearLocked
                                ? "Fixed: a new version keeps the year of the assessment it replaces."
                                : a.transition_run_at
                                  ? "Changing the year re-prices with that year's emissions as a new run; earlier runs stay stored."
                                  : "Scope 1 and 2 are read from the GHG engine for this year."
                        }>
                        <select className={selectCls} value={year} disabled={!canEdit || yearLocked} onChange={(e) => setYear(Number(e.target.value))}>
                            {REPORTING_YEARS.map((y) => (
                                <option key={y} value={y}>
                                    FY {y}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Revenue (₹ crore)" hint={a.revenue_inr === null ? "Missing: transition ratings show “Not rated” until this is entered." : `Saved: ${formatCrore(a.revenue_inr)}`}>
                        <Input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step="any"
                            value={revenueCr}
                            disabled={!canEdit}
                            aria-invalid={!revenueValid}
                            onChange={(e) => setRevenueCr(e.target.value)}
                            placeholder="e.g. 46200"
                        />
                    </Field>
                    <Field label="SASB industry" hint="Decides which climate topics and metrics apply (IFRS S2 para 12).">
                        <select
                            className={selectCls}
                            value={data.company.sasb_industry_code ?? ""}
                            disabled={!canEdit || sasbAction.isPending}
                            onChange={(e) => {
                                // Read the choice now: by the time the save runs, React has reset this controlled select.
                                const code = e.target.value || null;
                                sasbAction.mutate(() => updateCompanySasb(code));
                            }}>
                            <option value="">Not set</option>
                            {SASB_OPTIONS.map((o) => (
                                <option key={o.code} value={o.code}>
                                    {o.name} ({o.code})
                                </option>
                            ))}
                        </select>
                        <ErrorNote error={sasbAction.error} />
                    </Field>
                    <fieldset className="space-y-2">
                        <legend className="text-[12px] font-semibold text-on-surface-variant">Time horizons</legend>
                        <div className="grid grid-cols-3 gap-2">
                            {(["short", "medium", "long"] as const).map((k) => (
                                <label key={k} className="flex flex-col gap-1">
                                    <span className="text-[11px] capitalize text-on-surface-variant">{k} term</span>
                                    <select
                                        className={selectCls}
                                        value={h[k]}
                                        disabled={!canEdit}
                                        onChange={(e) => setH((p) => ({ ...p, [k]: Number(e.target.value) }))}>
                                        {years.map((y) => (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            ))}
                        </div>
                        <p className={cn("text-[11px]", horizonsValid ? "text-on-surface-variant" : "text-error")}>
                            {horizonsValid
                                ? "Carbon costs are priced at these three years. Only years with a carbon price in the ruleset are offered."
                                : "Each horizon must come after the one before it."}
                        </p>
                    </fieldset>
                    {canEdit && (
                        <Button onClick={save} disabled={action.isPending || !horizonsValid || !revenueValid} className="w-full">
                            {action.isPending ? "Saving…" : "Save inputs"}
                        </Button>
                    )}
                    <ErrorNote error={action.error} />
                </CardBody>
            </Card>

            <Card className="self-start">
                <CardHeader>
                    <span className="text-[13px] font-semibold">Facility districts</span>
                    <span className="text-[12px] text-on-surface-variant">
                        {mapped} of {data.facilities.length} matched to ThinkHazard
                    </span>
                </CardHeader>
                <div className="px-card-padding pt-3 text-[12px] text-on-surface-variant">
                    Each facility is matched once to a ThinkHazard district code; the analyst confirms the match. ThinkHazard uses older names
                    (Orissa for Odisha, Bellary for Ballari) and some districts repeat across states, so check the state before confirming.
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Facility</TableHead>
                                <TableHead>Location on file</TableHead>
                                <TableHead>ThinkHazard district</TableHead>
                                <TableHead className="sr-only">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.facilities.map((f) => (
                                <LocationRow key={f.id} facility={f} canEdit={canEdit} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-on-surface-variant">{label}</span>
            {children}
            {hint && <span className="text-[11px] leading-snug text-on-surface-variant">{hint}</span>}
        </div>
    );
}

function LocationRow({ facility: f, canEdit }: { facility: AssessmentDetail["facilities"][number]; canEdit: boolean }) {
    const [open, setOpen] = useState(false);
    const loc = f.location;
    // Frozen reports only carry the reason; drafts can also show older matches saved without one.
    const mismatch = Boolean(loc.thinkhazard_code) && (Boolean(loc.mismatch_reason) || stateMismatch(f.state, loc.state));
    return (
        <>
            <TableRow className={cn(open && "bg-surface-container-low/60", mismatch && !open && "bg-[#fab219]/10")}>
                <TableCell>
                    <p className="font-medium">{f.name}</p>
                    <p className="text-[11px] text-on-surface-variant">{f.facility_code}</p>
                </TableCell>
                <TableCell>{[f.city, f.state].filter(Boolean).join(", ")}</TableCell>
                <TableCell>
                    {loc.thinkhazard_code ? (
                        <div>
                            <p className="flex items-center gap-1">
                                <MaterialIcon name="check_circle" size="sm" className="text-secondary" />
                                {loc.thinkhazard_label}
                                <span className="text-[11px] text-on-surface-variant">#{loc.thinkhazard_code}</span>
                            </p>
                            <p className="text-[11px] text-on-surface-variant">
                                Confirmed by {loc.confirmed_by} · {formatDateTime(loc.confirmed_at)}
                            </p>
                            {mismatch && <MismatchNote facility={f} />}
                        </div>
                    ) : (
                        <span className="flex items-center gap-1 text-on-surface-variant">
                            <MaterialIcon name="location_off" size="sm" />
                            Not matched: will show “Not rated: location unmapped”
                        </span>
                    )}
                </TableCell>
                <TableCell className="text-right">
                    {canEdit && (
                        <Button variant="secondary" size="sm" className="whitespace-nowrap" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
                            {open ? "Close" : loc.thinkhazard_code ? "Change" : "Find district"}
                        </Button>
                    )}
                </TableCell>
            </TableRow>
            {open && (
                <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="bg-surface-container-low/60 pt-0">
                        <DistrictSearch facility={f} onDone={() => setOpen(false)} />
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}

function MismatchNote({ facility: f }: { facility: AssessmentDetail["facilities"][number] }) {
    const loc = f.location;
    return (
        <p className="mt-1 flex items-start gap-1 rounded border border-[#d9970a]/50 bg-[#fab219]/15 px-2 py-1 text-[11px] text-on-surface">
            <MaterialIcon name="warning" size="xs" className="mt-0.5" />
            <span>
                {loc.state ? `District is in ${loc.state}` : "District is outside the facility's state"}
                {f.state ? `, facility is in ${f.state}. ` : ". "}
                {loc.mismatch_reason ? `Reason: “${loc.mismatch_reason}”` : "No reason recorded: change the match, or confirm it again with a reason."}
            </span>
        </p>
    );
}

function DistrictSearch({ facility: f, onDone }: { facility: AssessmentDetail["facilities"][number]; onDone: () => void }) {
    const [draft, setDraft] = useState(f.city);
    const [query, setQuery] = useState(f.city);
    const { data: results = [], isFetching, error: searchError } = useThinkHazardSearch(query);
    const action = useRiskAction();
    // A district in another state is confirmed only with a written reason.
    const [pending, setPending] = useState<ThinkHazardDivision | null>(null);
    const [reason, setReason] = useState("");
    const confirm = (d: ThinkHazardDivision | null, mismatchReason?: string) =>
        action.mutate(() => saveFacilityLocation(f.id, d, mismatchReason), { onSuccess: onDone });

    return (
        <div className="space-y-3 rounded-lg border border-outline-variant bg-surface-container-lowest p-3">
            <form
                className="flex gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    setQuery(draft);
                }}>
                <label className="sr-only" htmlFor={`q-${f.id}`}>
                    Search ThinkHazard districts
                </label>
                <Input id={`q-${f.id}`} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="District name" className="max-w-xs" />
                <Button type="submit" variant="secondary" size="sm">
                    <MaterialIcon name="search" size="sm" />
                    Search
                </Button>
            </form>
            <p className="text-[11px] text-on-surface-variant">
                District search by <SourceLink href="https://thinkhazard.org">ThinkHazard! (GFDRR)</SourceLink>
            </p>
            {isFetching && <p className="text-[12px] text-on-surface-variant">Searching…</p>}
            <ErrorNote error={searchError} />
            {!isFetching && !searchError && query.trim().length >= 2 && results.length === 0 && (
                <p className="text-[12px] text-on-surface-variant">
                    No ThinkHazard district matches “{query}”. Search by district, not town (e.g. “Paschim Bardhaman” for Jamuria), or try an older name.
                </p>
            )}
            <ul className="divide-y divide-outline-variant/50">
                {results.map((d) => {
                    const mismatch = stateMismatch(f.state, d.admin1);
                    const asking = pending?.code === d.code;
                    return (
                        <li key={d.code} className={cn("space-y-2 py-2", mismatch && "rounded bg-[#fab219]/10 px-2")}>
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-[13px]">
                                        {[d.admin0, d.admin1, d.admin2].filter(Boolean).join(" › ")}{" "}
                                        <span className="text-[11px] text-on-surface-variant">#{d.code}</span>
                                    </p>
                                    <p className={cn("text-[11px]", mismatch ? "font-semibold text-[#9a5b00]" : f.state ? "text-secondary" : "text-on-surface-variant")}>
                                        {mismatch
                                            ? `Different state from the facility (${f.state}): needs a reason`
                                            : f.state
                                              ? "State matches the facility"
                                              : "No state on file to check against"}
                                    </p>
                                </div>
                                {!asking && (
                                    <Button
                                        size="sm"
                                        variant={mismatch ? "secondary" : "primary"}
                                        onClick={() => (mismatch ? (setPending(d), setReason("")) : confirm(d))}
                                        disabled={action.isPending}>
                                        {mismatch ? "Confirm anyway…" : "Confirm"}
                                    </Button>
                                )}
                            </div>
                            {asking && (
                                <form
                                    className="space-y-2"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        confirm(d, reason.trim());
                                    }}>
                                    <label className="block space-y-1">
                                        <span className="text-[12px] font-semibold text-on-surface-variant">
                                            Why is this facility in {d.admin2}, {d.admin1}? (at least {MIN_OVERRIDE_REASON} characters)
                                        </span>
                                        <textarea
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            rows={2}
                                            required
                                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-sm"
                                            placeholder="e.g. Facility record lists the head office state; the plant is in this district"
                                        />
                                    </label>
                                    <div className="flex gap-2">
                                        <Button type="submit" size="sm" disabled={action.isPending || reason.trim().length < MIN_OVERRIDE_REASON}>
                                            Confirm with reason
                                        </Button>
                                        <Button type="button" size="sm" variant="ghost" onClick={() => setPending(null)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </li>
                    );
                })}
            </ul>
            {f.location.thinkhazard_code && (
                <Button variant="ghost" size="sm" onClick={() => confirm(null)} disabled={action.isPending}>
                    Clear match (no ThinkHazard district)
                </Button>
            )}
            <ErrorNote error={action.error} />
        </div>
    );
}
