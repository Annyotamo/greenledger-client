"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Scope3Navbar } from "@/components/scope3/Scope3Navbar";
import { Category1Summary } from "./Category1Summary";
import { Category1Table } from "./Category1Table";
import { Category1FormModal } from "./Category1FormModal";
import { Category1DetailModal } from "./Category1DetailModal";
import { Category1RejectModal } from "./Category1RejectModal";
import {
    useCategory1SpendEntries,
    useCreateCategory1Spend,
    useUpdateCategory1Spend,
    useDeleteCategory1Spend,
    useSubmitCategory1Spend,
    useVerifyCategory1Spend,
    useRejectCategory1Spend,
    useAmendCategory1Spend,
} from "@/lib/scope3/category1/hooks";
import {
    AmendCategory1SpendPayload,
    Category1FilterParams,
    Category1SpendEntry,
    CreateCategory1SpendPayload,
} from "@/lib/scope3/category1/types";
import { useFacilities } from "@/lib/facility/hooks";
import { useReportingPeriods } from "@/lib/reportingPeriods/hooks";
import { AiAssistantFAB } from "@/components/dashboard/AiAssistantFAB";

export function Category1View() {
    // Filter State
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [yearFilter, setYearFilter] = useState<string>("");
    const [facilityFilter, setFacilityFilter] = useState<string>("");
    const [periodIdFilter, setPeriodIdFilter] = useState<string>("");

    const filterParams: Category1FilterParams = useMemo(
        () => ({
            status: statusFilter || undefined,
            spend_year: yearFilter ? Number(yearFilter) : undefined,
            facility_id: facilityFilter || undefined,
            reporting_period_id: periodIdFilter || undefined,
        }),
        [statusFilter, yearFilter, facilityFilter, periodIdFilter],
    );

    // Queries & Mutations
    const { data: entries = [], isLoading, refetch } = useCategory1SpendEntries(filterParams);
    const facilitiesQuery = useFacilities();
    const reportingPeriodsQuery = useReportingPeriods();

    const createMutation = useCreateCategory1Spend();
    const updateMutation = useUpdateCategory1Spend();
    const deleteMutation = useDeleteCategory1Spend();
    const submitMutation = useSubmitCategory1Spend();
    const verifyMutation = useVerifyCategory1Spend();
    const rejectMutation = useRejectCategory1Spend();
    const amendMutation = useAmendCategory1Spend();

    // Modal State
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit" | "amend">("create");
    const [selectedEntry, setSelectedEntry] = useState<Category1SpendEntry | null>(null);

    const [detailEntry, setDetailEntry] = useState<Category1SpendEntry | null>(null);

    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectEntry, setRejectEntry] = useState<Category1SpendEntry | null>(null);

    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    function showNotify(type: "success" | "error", message: string) {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    }

    // Form Handlers
    function handleOpenCreate() {
        setSelectedEntry(null);
        setFormMode("create");
        setIsFormModalOpen(true);
    }

    function handleOpenEdit(entry: Category1SpendEntry) {
        setSelectedEntry(entry);
        setFormMode("edit");
        setIsFormModalOpen(true);
    }

    function handleOpenAmend(entry: Category1SpendEntry) {
        setSelectedEntry(entry);
        setFormMode("amend");
        setIsFormModalOpen(true);
    }

    function handleOpenDetail(entry: Category1SpendEntry) {
        setDetailEntry(entry);
    }

    function handleOpenReject(entry: Category1SpendEntry) {
        setRejectEntry(entry);
        setIsRejectModalOpen(true);
    }

    async function handleFormSubmit(payload: CreateCategory1SpendPayload | AmendCategory1SpendPayload) {
        try {
            if (formMode === "create") {
                await createMutation.mutateAsync(payload as CreateCategory1SpendPayload);
                showNotify("success", "Category 1 spend entry created successfully.");
            } else if (formMode === "edit" && selectedEntry) {
                await updateMutation.mutateAsync({
                    activityId: selectedEntry.id,
                    payload: payload as CreateCategory1SpendPayload,
                });
                showNotify("success", "Category 1 spend entry updated successfully.");
            } else if (formMode === "amend" && selectedEntry) {
                await amendMutation.mutateAsync({
                    activityId: selectedEntry.id,
                    payload: payload as AmendCategory1SpendPayload,
                });
                showNotify("success", "Verified entry amended successfully.");
            }
            setIsFormModalOpen(false);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Operation failed.";
            showNotify("error", msg);
        }
    }

    async function handleSubmitEntry(id: string) {
        try {
            await submitMutation.mutateAsync(id);
            showNotify("success", "Entry submitted for reviewer approval.");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to submit entry.";
            showNotify("error", msg);
        }
    }

    async function handleVerifyEntry(id: string) {
        try {
            await verifyMutation.mutateAsync(id);
            showNotify("success", "Entry verified and locked.");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to verify entry.";
            showNotify("error", msg);
        }
    }

    async function handleConfirmReject(reason: string) {
        if (!rejectEntry) return;
        try {
            await rejectMutation.mutateAsync({ activityId: rejectEntry.id, reason });
            showNotify("success", "Entry rejected.");
            setIsRejectModalOpen(false);
            setRejectEntry(null);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to reject entry.";
            showNotify("error", msg);
        }
    }

    async function handleDeleteEntry(id: string) {
        if (!confirm("Are you sure you want to delete this spend record?")) return;
        try {
            await deleteMutation.mutateAsync(id);
            showNotify("success", "Spend entry deleted.");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to delete entry.";
            showNotify("error", msg);
        }
    }

    return (
        <div className="relative mx-auto max-w-[1400px] space-y-6 pb-12">
            {/* Sticky Scope 3 Top Navbar */}
            <Scope3Navbar />

            {/* Notification Alert Toast */}
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

            {/* Breadcrumb Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant/40 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono text-xs text-on-surface-variant">
                        <Link href="/scope-3" className="hover:text-primary transition-colors">
                            Scope 3 Value Chain
                        </Link>
                        <span>/</span>
                        <span className="text-secondary font-bold">Cat 1: Purchased Goods & Services</span>
                    </div>
                    <h1 className="text-headline-md font-bold text-primary tracking-tight">
                        Purchased Goods & Services (Spend-Based)
                    </h1>
                    <p className="font-mono text-xs text-on-surface-variant max-w-3xl">
                        Quantify upstream Scope 3 Category 1 emissions by mapping purchase spend (INR to USD) against US EPA USEEIO spend factors (kg CO₂e/USD) with producer price and trade margin splits.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" size="md" onClick={() => refetch()} className="gap-1.5 font-mono text-xs">
                        <MaterialIcon name="refresh" size="sm" />
                        <span>Refresh</span>
                    </Button>
                    <Button variant="primary" size="md" onClick={handleOpenCreate} className="gap-1.5 font-mono text-xs">
                        <MaterialIcon name="add" size="sm" />
                        <span>Log Category 1 Spend</span>
                    </Button>
                </div>
            </div>

            {/* Filter Control Toolbar */}
            <Card className="p-4 border-outline-variant/60">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
                    {/* Status Filter */}
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

                    {/* Spend Year Filter */}
                    <div>
                        <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Spend Year</label>
                        <select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="">All Years (2020–2025)</option>
                            <option value="2020">2020</option>
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                        </select>
                    </div>

                    {/* Facility Filter */}
                    <div>
                        <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Facility</label>
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

                    {/* Reporting Period Filter */}
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

            {/* Summary Metrics */}
            <Category1Summary entries={entries} />

            {/* High Density Spend Table */}
            <Category1Table
                entries={entries}
                isLoading={isLoading}
                onViewDetail={handleOpenDetail}
                onEdit={handleOpenEdit}
                onAmend={handleOpenAmend}
                onSubmitEntry={handleSubmitEntry}
                onVerifyEntry={handleVerifyEntry}
                onRejectEntry={handleOpenReject}
                onDeleteEntry={handleDeleteEntry}
            />

            {/* Modals */}
            <Category1FormModal
                key={`${selectedEntry?.id ?? "new"}-${formMode}-${isFormModalOpen}`}
                isOpen={isFormModalOpen}
                mode={formMode}
                initialEntry={selectedEntry}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleFormSubmit}
                isSubmitting={
                    createMutation.isPending ||
                    updateMutation.isPending ||
                    amendMutation.isPending
                }
            />

            <Category1DetailModal
                entry={detailEntry}
                onClose={() => setDetailEntry(null)}
            />

            <Category1RejectModal
                isOpen={isRejectModalOpen}
                onClose={() => {
                    setIsRejectModalOpen(false);
                    setRejectEntry(null);
                }}
                onConfirm={handleConfirmReject}
                isSubmitting={rejectMutation.isPending}
            />

            <AiAssistantFAB />
        </div>
    );
}
