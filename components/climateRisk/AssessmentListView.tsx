"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { createAssessment, type AssessmentListItem } from "@/lib/climateRisk/api";
import { REPORTING_YEARS as YEARS } from "@/lib/climateRisk/constants";
import { useRiskAccess, useRiskAction, useRiskAssessments } from "@/lib/climateRisk/hooks";
import { CRORE, ErrorNote, formatDate, RatingBadge, StatusBadge } from "./RiskUi";

export function RiskModuleHeader({ title, subtitle, actions }: { title: string; subtitle: string; actions?: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">{title}</h2>
                <p className="mt-1 max-w-2xl text-body-md text-on-surface-variant">{subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">{actions}</div>
        </div>
    );
}

export function AssessmentListView() {
    const router = useRouter();
    const access = useRiskAccess();
    const { data = [], isPending, error } = useRiskAssessments();
    const [creating, setCreating] = useState(false);

    return (
        <div className="space-y-8">
            <RiskModuleHeader
                title="Climate Risk Assessment"
                subtitle="How exposed each facility and the company are to climate hazards and to carbon costs. Every number traces back to its source."
                actions={
                    <>
                        <Link href="/risk-assessment/config">
                            <Button variant="secondary">
                                <MaterialIcon name="tune" size="sm" />
                                Ruleset config
                            </Button>
                        </Link>
                        {access.canWrite && (
                            <Button onClick={() => setCreating((v) => !v)} aria-expanded={creating}>
                                <MaterialIcon name="add" size="sm" />
                                New assessment
                            </Button>
                        )}
                    </>
                }
            />

            {creating && access.canWrite && <NewAssessmentForm onCancel={() => setCreating(false)} existing={data} />}

            <div className="grid gap-4 md:grid-cols-3">
                {[
                    { icon: "flood", title: "Physical risk", body: "Which facilities sit in districts with high flood, cyclone, heat or water-scarcity hazard." },
                    { icon: "payments", title: "Transition risk", body: "What a carbon price would cost under three NGFS scenarios, next to revenue." },
                    { icon: "description", title: "Disclosure support", body: "Numbers the client can reuse in IFRS S2 reporting and in answers to their bank." },
                ].map((q) => (
                    <div key={q.title} className="flex gap-3 rounded-lg bg-surface-container-low px-4 py-3">
                        <MaterialIcon name={q.icon} size="md" className="mt-0.5 text-secondary" />
                        <div>
                            <p className="text-[13px] font-semibold text-on-surface">{q.title}</p>
                            <p className="text-[12px] leading-relaxed text-on-surface-variant">{q.body}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Reporting year</TableHead>
                                <TableHead>Version</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Ruleset</TableHead>
                                <TableHead>Physical</TableHead>
                                <TableHead>Transition</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Approved</TableHead>
                                <TableHead className="sr-only">Open</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isPending && (
                                <TableRow>
                                    <TableCell colSpan={9} className="py-10 text-center text-on-surface-variant">
                                        Loading assessments…
                                    </TableCell>
                                </TableRow>
                            )}
                            {!isPending && data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={9} className="py-10 text-center text-on-surface-variant">
                                        {access.canWrite ? "No assessments yet. Start one with New assessment." : "No approved assessments yet."}
                                    </TableCell>
                                </TableRow>
                            )}
                            {data.map((a) => (
                                <TableRow key={a.id} className="cursor-pointer" onClick={() => router.push(`/risk-assessment/${a.id}`)}>
                                    <TableCell className="font-semibold">
                                        <Link href={`/risk-assessment/${a.id}`} className="hover:underline">
                                            FY {a.reporting_year}
                                        </Link>
                                    </TableCell>
                                    <TableCell>v{a.version}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={a.status} />
                                    </TableCell>
                                    <TableCell>
                                        <span className={a.ruleset_label.startsWith("DEV") ? "text-[12px] font-semibold text-[#9a5b00]" : "text-[12px]"}>
                                            {a.ruleset_label}
                                        </span>
                                    </TableCell>
                                    <TableCell>{a.physical ? <RatingBadge rating={a.physical} /> : <NotRun />}</TableCell>
                                    <TableCell>{a.transition ? <RatingBadge rating={a.transition} /> : <NotRun />}</TableCell>
                                    <TableCell className="text-on-surface-variant">{formatDate(a.created_at)}</TableCell>
                                    <TableCell className="text-on-surface-variant">{formatDate(a.approved_at)}</TableCell>
                                    <TableCell className="text-right">
                                        <MaterialIcon name="chevron_right" size="md" className="text-on-surface-variant" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
            <ErrorNote error={error} />
        </div>
    );
}

const NotRun = () => <span className="text-[12px] text-on-surface-variant/60">Not run</span>;

function NewAssessmentForm({ onCancel, existing }: { onCancel: () => void; existing: AssessmentListItem[] }) {
    const router = useRouter();
    const action = useRiskAction();
    const [year, setYear] = useState(YEARS[0]);
    const [revenueCr, setRevenueCr] = useState("");
    // One assessment per year; a change to it is a new version (server-enforced). The list is newest version first.
    const taken = existing.find((a) => a.reporting_year === year);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const revenue = revenueCr.trim() === "" ? null : Number(revenueCr) * CRORE;
        action.mutate(async () => router.push(`/risk-assessment/${(await createAssessment({ reporting_year: year, revenue_inr: revenue })).id}`));
    };

    return (
        <Card>
            <CardBody>
                <form onSubmit={submit} className="flex flex-col gap-4 md:flex-row md:items-end">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-[12px] font-semibold text-on-surface-variant">Reporting year</span>
                        <select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="h-9 rounded-lg border border-outline-variant bg-white px-3 text-body-md">
                            {YEARS.map((y) => (
                                <option key={y} value={y}>
                                    FY {y}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-1 flex-col gap-1.5 md:max-w-xs">
                        <span className="text-[12px] font-semibold text-on-surface-variant">Revenue (₹ crore)</span>
                        <Input
                            inputMode="decimal"
                            type="number"
                            min={0}
                            step="any"
                            placeholder="Can be added later"
                            value={revenueCr}
                            onChange={(e) => setRevenueCr(e.target.value)}
                        />
                    </label>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={action.isPending || !!taken}>
                            {action.isPending ? "Creating…" : "Create draft"}
                        </Button>
                        <Button type="button" variant="ghost" onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </form>
                {taken && (
                    <p className="mt-3 text-[12px] text-on-surface-variant">
                        FY {year} already has an assessment.{" "}
                        <Link href={`/risk-assessment/${taken.id}`} className="font-semibold text-on-surface underline underline-offset-2">
                            Open v{taken.version}
                        </Link>{" "}
                        {taken.status === "approved" ? "and create a new version from it." : "to continue it."}
                    </p>
                )}
                <ErrorNote error={action.error} />
            </CardBody>
        </Card>
    );
}
