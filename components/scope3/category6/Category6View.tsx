"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Scope3Navbar } from "@/components/scope3/Scope3Navbar";
import { Category6Summary } from "./Category6Summary";
import { Category6Table } from "./Category6Table";
import { Category6FormModal } from "./Category6FormModal";
import { Category6DetailModal } from "./Category6DetailModal";
import { Category6RejectModal } from "./Category6RejectModal";
import {
    useAmendTravelActivity,
    useCreateTravelActivity,
    useDeleteTravelActivity,
    useRejectTravelActivity,
    useSubmitTravelActivity,
    useTravelActivities,
    useTravelSummary,
    useUpdateTravelActivity,
    useVerifyTravelActivity,
} from "@/lib/scope3/travel/hooks";
import {
    AmendTravelActivityPayload,
    CreateTravelActivityPayload,
    TravelActivityEntry,
    TravelFilterParams,
} from "@/lib/scope3/travel/types";
import { useFacilities } from "@/lib/facility/hooks";
import { useReportingPeriods } from "@/lib/reportingPeriods/hooks";
import { AiAssistantFAB } from "@/components/dashboard/AiAssistantFAB";

export function Category6View() {
    // Filter State
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [facilityFilter, setFacilityFilter] = useState<string>("");
    const [periodIdFilter, setPeriodIdFilter] = useState<string>("");

    const filterParams: TravelFilterParams = useMemo(
        () => ({
            category: "BUSINESS_TRAVEL",
            status: statusFilter || undefined,
            facility_id: facilityFilter || undefined,
            reporting_period_id: periodIdFilter || undefined,
        }),
        [statusFilter, facilityFilter, periodIdFilter],
    );

    // Queries
    const travelQuery = useTravelActivities("BUSINESS_TRAVEL", filterParams);
    const summaryQuery = useTravelSummary("BUSINESS_TRAVEL", periodIdFilter || undefined);
    const facilitiesQuery = useFacilities();
    const reportingPeriodsQuery = useReportingPeriods();

    // Mutations
    const createMutation = useCreateTravelActivity();
    const updateMutation = useUpdateTravelActivity();
    const deleteMutation = useDeleteTravelActivity("BUSINESS_TRAVEL");
    const submitMutation = useSubmitTravelActivity("BUSINESS_TRAVEL");
    const verifyMutation = useVerifyTravelActivity("BUSINESS_TRAVEL");
    const rejectMutation = useRejectTravelActivity("BUSINESS_TRAVEL");
    const amendMutation = useAmendTravelActivity();

    // Modal State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit" | "amend">("create");
    const [selectedEntry, setSelectedEntry] = useState<TravelActivityEntry | null>(null);

    const [detailEntry, setDetailEntry] = useState<TravelActivityEntry | null>(null);
    const [rejectTarget, setRejectTarget] = useState<TravelActivityEntry | null>(null);
    const [isRejectOpen, setIsRejectOpen] = useState(false);

    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    function showNotify(type: "success" | "error", message: string) {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    }

    function handleOpenCreate() {
        setSelectedEntry(null);
        setFormMode("create");
        setIsFormOpen(true);
    }

    function handleOpenEdit(entry: TravelActivityEntry) {
        setSelectedEntry(entry);
        setFormMode("edit");
        setIsFormOpen(true);
    }

    function handleOpenAmend(entry: TravelActivityEntry) {
        setSelectedEntry(entry);
        setFormMode("amend");
        setIsFormOpen(true);
    }

    function handleOpenDetail(entry: TravelActivityEntry) {
        setDetailEntry(entry);
    }

    function handleOpenReject(entry: TravelActivityEntry) {
        setRejectTarget(entry);
        setIsRejectOpen(true);
    }

    async function handleFormSubmit(payload: CreateTravelActivityPayload | AmendTravelActivityPayload) {
        try {
            if (formMode === "create") {
                await createMutation.mutateAsync(payload as CreateTravelActivityPayload);
                showNotify("success", "Business travel journey logged successfully.");
            } else if (formMode === "edit" && selectedEntry) {
                await updateMutation.mutateAsync({
                    activityId: selectedEntry.id,
                    payload: payload as CreateTravelActivityPayload,
                });
                showNotify("success", "Business travel journey updated successfully.");
            } else if (formMode === "amend" && selectedEntry) {
                await amendMutation.mutateAsync({
                    activityId: selectedEntry.id,
                    payload: payload as AmendTravelActivityPayload,
                });
                showNotify("success", "Verified Business Travel journey amended successfully.");
            }
            setIsFormOpen(false);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Operation failed.";
            showNotify("error", msg);
        }
    }

    async function handleConfirmReject(reason: string) {
        if (!rejectTarget) return;
        try {
            await rejectMutation.mutateAsync({ activityId: rejectTarget.id, reason });
            showNotify("success", "Business travel journey rejected.");
            setIsRejectOpen(false);
            setRejectTarget(null);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Rejection failed.";
            showNotify("error", msg);
        }
    }

    return (
        <div className="relative mx-auto max-w-[1400px] space-y-6 pb-12">
            <Scope3Navbar />

            {notification && (
                <div
                    className={`flex items-center justify-between rounded-xl px-4 py-3 font-mono text-xs shadow-md border ${
                        notification.type === "success"
                            ? "bg-secondary-container/90 text-on-secondary-container border-secondary/30"
                            : "bg-error-container/90 text-on-error-container border-error/30"
                    }`}>
                    <div className="flex items-center gap-2">
                        <MaterialIcon name={notification.type === "success" ? "check_circle" : "error"} size="sm" />
                        <span>{notification.message}</span>
                    </div>
                    <button type="button" onClick={() => setNotification(null)}>
                        <MaterialIcon name="close" size="xs" />
                    </button>
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant/40 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono text-xs text-on-surface-variant">
                        <Link href="/scope-3" className="hover:text-primary transition-colors">
                            Scope 3 Value Chain
                        </Link>
                        <span>/</span>
                        <span className="text-secondary font-bold">Cat 6: Business Travel</span>
                    </div>
                    <h1 className="text-headline-md font-bold text-primary tracking-tight">
                        Business Travel (Category 6)
                    </h1>
                    <p className="font-mono text-xs text-on-surface-variant max-w-3xl">
                        Quantify Scope 3 Category 6 emissions from employee business travel across multi-modal journeys (flights, taxis, rental cars, rail, and passenger ferries) using DEFRA factor models.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={() => {
                            travelQuery.refetch();
                            summaryQuery.refetch();
                        }}
                        className="gap-1.5 font-mono text-xs">
                        <MaterialIcon name="refresh" size="sm" />
                        <span>Refresh</span>
                    </Button>

                    <Button variant="primary" size="md" onClick={handleOpenCreate} className="gap-1.5 font-mono text-xs">
                        <MaterialIcon name="flight_takeoff" size="sm" />
                        <span>Log Business Travel Journey</span>
                    </Button>
                </div>
            </div>

            {/* Filter Control Toolbar */}
            <Card className="p-4 border-outline-variant/60">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 font-mono text-xs">
                    <div>
                        <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Status Filter</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="">All Statuses</option>
                            <option value="verified">Verified (Locked)</option>
                            <option value="submitted">Submitted (Pending Review)</option>
                            <option value="draft">Draft</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Facility / Corporate Site</label>
                        <select
                            value={facilityFilter}
                            onChange={(e) => setFacilityFilter(e.target.value)}
                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="">All Facilities</option>
                            {(facilitiesQuery.data ?? []).map((fac) => (
                                <option key={fac.id} value={fac.id}>
                                    {fac.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Reporting Period</label>
                        <select
                            value={periodIdFilter}
                            onChange={(e) => setPeriodIdFilter(e.target.value)}
                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="">All Reporting Periods</option>
                            {(reportingPeriodsQuery.data ?? []).map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} ({p.reportingYear})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            {/* Summary KPI Cards */}
            <Category6Summary entries={travelQuery.data ?? []} summary={summaryQuery.data} />

            {/* High-density Data Table */}
            <Category6Table
                entries={travelQuery.data ?? []}
                isLoading={travelQuery.isLoading}
                onViewDetail={handleOpenDetail}
                onEdit={handleOpenEdit}
                onAmend={handleOpenAmend}
                onSubmitEntry={async (id) => {
                    try {
                        await submitMutation.mutateAsync(id);
                        showNotify("success", "Business travel journey submitted for review.");
                    } catch (err: unknown) {
                        const msg = err instanceof Error ? err.message : "Submit failed.";
                        showNotify("error", msg);
                    }
                }}
                onVerifyEntry={async (id) => {
                    try {
                        await verifyMutation.mutateAsync(id);
                        showNotify("success", "Business travel journey verified.");
                    } catch (err: unknown) {
                        const msg = err instanceof Error ? err.message : "Verify failed.";
                        showNotify("error", msg);
                    }
                }}
                onRejectEntry={handleOpenReject}
                onDeleteEntry={async (id) => {
                    if (!confirm("Are you sure you want to delete this business travel record?")) return;
                    try {
                        await deleteMutation.mutateAsync(id);
                        showNotify("success", "Business travel journey deleted.");
                    } catch (err: unknown) {
                        const msg = err instanceof Error ? err.message : "Delete failed.";
                        showNotify("error", msg);
                    }
                }}
            />

            {/* Form Modal */}
            <Category6FormModal
                key={`cat6-${selectedEntry?.id ?? "new"}-${formMode}-${isFormOpen}`}
                isOpen={isFormOpen}
                mode={formMode}
                initialEntry={selectedEntry}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                isSubmitting={
                    createMutation.isPending ||
                    updateMutation.isPending ||
                    amendMutation.isPending
                }
            />

            {/* Detail Modal */}
            <Category6DetailModal entry={detailEntry} onClose={() => setDetailEntry(null)} />

            {/* Reject Modal */}
            <Category6RejectModal
                isOpen={isRejectOpen}
                onClose={() => {
                    setIsRejectOpen(false);
                    setRejectTarget(null);
                }}
                onConfirm={handleConfirmReject}
                isSubmitting={rejectMutation.isPending}
            />

            <AiAssistantFAB />
        </div>
    );
}
