"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Scope3Navbar } from "@/components/scope3/Scope3Navbar";
import { Category2Summary } from "./Category2Summary";
import { Category2Table } from "./Category2Table";
import { Category2FormModal } from "./Category2FormModal";
import { Category2DetailModal } from "./Category2DetailModal";
import { Category2RejectModal } from "./Category2RejectModal";
import {
    useCategory2SpendEntries,
    useCreateCategory2Spend,
    useUpdateCategory2Spend,
    useDeleteCategory2Spend,
    useSubmitCategory2Spend,
    useVerifyCategory2Spend,
    useRejectCategory2Spend,
    useAmendCategory2Spend,
} from "@/lib/scope3/category2/hooks";
import {
    AmendCategory2SpendPayload,
    Category2FilterParams,
    Category2SpendEntry,
    CreateCategory2SpendPayload,
} from "@/lib/scope3/category2/types";
import { useFacilities } from "@/lib/facility/hooks";
import { useReportingPeriods } from "@/lib/reportingPeriods/hooks";
import { AiAssistantFAB } from "@/components/dashboard/AiAssistantFAB";
import { uploadPendingScope3Document, PendingDocumentAttachment } from "@/lib/scope3/documents";

/**
 * Extracts a user-friendly message from backend API errors.
 * Maps known Scope 3 error codes to actionable UI copy.
 */
function resolveApiErrorMessage(err: unknown, fallback: string): string {
    if (isAxiosError(err)) {
        const errorBody = err.response?.data?.error;
        const errorCode: string | undefined =
            errorBody?.error_code ?? err.response?.data?.error_code;

        switch (errorCode) {
            case "ACTIVITY_DATE_OUTSIDE_PERIOD":
                return "The spend date falls outside the selected reporting period window. Please choose a date within the period.";
            case "REPORTING_PERIOD_LOCKED":
                return "This reporting period is locked and cannot accept new or modified entries.";
            case "REPORTING_PERIOD_ARCHIVED":
                return "This reporting period is archived and cannot accept entries.";
            case "ACTIVITY_AMENDMENT_SOURCE_NOT_APPROVED":
                return "Only verified or approved activities can be amended.";
            case "SCOPE3_ACTIVITY_IMMUTABLE":
                return "This activity is verified and cannot be edited directly. Use the Amend function instead.";
            default:
                break;
        }

        // Fall back to the backend message string if present
        const backendMsg: string | undefined =
            errorBody?.message ?? err.response?.data?.message;
        if (backendMsg) return backendMsg;
    }

    return err instanceof Error ? err.message : fallback;
}

export function Category2View() {
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [yearFilter, setYearFilter] = useState<string>("");
    const [facilityFilter, setFacilityFilter] = useState<string>("");
    const [periodIdFilter, setPeriodIdFilter] = useState<string>("");

    const filterParams: Category2FilterParams = useMemo(
        () => ({
            status: statusFilter || undefined,
            spend_year: yearFilter ? Number(yearFilter) : undefined,
            facility_id: facilityFilter || undefined,
            reporting_period_id: periodIdFilter || undefined,
        }),
        [statusFilter, yearFilter, facilityFilter, periodIdFilter],
    );

    const { data: entries = [], isLoading, refetch } = useCategory2SpendEntries(filterParams);
    const facilitiesQuery = useFacilities();
    const reportingPeriodsQuery = useReportingPeriods();

    const createMutation = useCreateCategory2Spend();
    const updateMutation = useUpdateCategory2Spend();
    const deleteMutation = useDeleteCategory2Spend();
    const submitMutation = useSubmitCategory2Spend();
    const verifyMutation = useVerifyCategory2Spend();
    const rejectMutation = useRejectCategory2Spend();
    const amendMutation = useAmendCategory2Spend();

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit" | "amend">("create");
    const [selectedEntry, setSelectedEntry] = useState<Category2SpendEntry | null>(null);

    const [detailEntry, setDetailEntry] = useState<Category2SpendEntry | null>(null);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectEntry, setRejectEntry] = useState<Category2SpendEntry | null>(null);

    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    function showNotify(type: "success" | "error", message: string) {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    }

    function handleOpenCreate() {
        setSelectedEntry(null);
        setFormMode("create");
        setIsFormModalOpen(true);
    }

    function handleOpenEdit(entry: Category2SpendEntry) {
        setSelectedEntry(entry);
        setFormMode("edit");
        setIsFormModalOpen(true);
    }

    function handleOpenAmend(entry: Category2SpendEntry) {
        setSelectedEntry(entry);
        setFormMode("amend");
        setIsFormModalOpen(true);
    }

    function handleOpenDetail(entry: Category2SpendEntry) {
        setDetailEntry(entry);
    }

    function handleOpenReject(entry: Category2SpendEntry) {
        setRejectEntry(entry);
        setIsRejectModalOpen(true);
    }

    async function handleFormSubmit(
        payload: CreateCategory2SpendPayload | AmendCategory2SpendPayload,
        pendingDocument?: PendingDocumentAttachment | null,
    ) {
        try {
            let savedEntry: Category2SpendEntry | null = null;
            if (formMode === "create") {
                savedEntry = await createMutation.mutateAsync(payload as CreateCategory2SpendPayload);
                showNotify("success", "Category 2 capital spend entry created successfully.");
            } else if (formMode === "edit" && selectedEntry) {
                savedEntry = await updateMutation.mutateAsync({
                    activityId: selectedEntry.id,
                    payload: payload as CreateCategory2SpendPayload,
                });
                showNotify("success", "Category 2 capital spend entry updated successfully.");
            } else if (formMode === "amend" && selectedEntry) {
                savedEntry = await amendMutation.mutateAsync({
                    activityId: selectedEntry.id,
                    payload: payload as AmendCategory2SpendPayload,
                });
                showNotify("success", "Verified capital goods entry amended successfully.");
            }

            // Upload attached document if provided
            if (pendingDocument?.file && savedEntry?.id) {
                try {
                    await uploadPendingScope3Document("category_2", savedEntry.id, pendingDocument);
                    showNotify("success", "Capital activity and supporting document saved successfully.");
                } catch (docErr) {
                    console.error("Document upload error:", docErr);
                    showNotify("error", "Activity created, but document upload failed. You can re-upload in Evidence & Documents.");
                }
            }

            setIsFormModalOpen(false);
        } catch (err: unknown) {
            showNotify("error", resolveApiErrorMessage(err, "Operation failed."));
        }
    }

    async function handleSubmitEntry(id: string) {
        try {
            await submitMutation.mutateAsync(id);
            showNotify("success", "Capital goods entry submitted for reviewer approval.");
        } catch (err: unknown) {
            showNotify("error", resolveApiErrorMessage(err, "Failed to submit entry."));
        }
    }

    async function handleVerifyEntry(id: string) {
        try {
            await verifyMutation.mutateAsync(id);
            showNotify("success", "Capital goods entry verified and locked.");
        } catch (err: unknown) {
            showNotify("error", resolveApiErrorMessage(err, "Failed to verify entry."));
        }
    }

    async function handleConfirmReject(reason: string) {
        if (!rejectEntry) return;
        try {
            await rejectMutation.mutateAsync({ activityId: rejectEntry.id, reason });
            showNotify("success", "Capital goods entry rejected.");
            setIsRejectModalOpen(false);
            setRejectEntry(null);
        } catch (err: unknown) {
            showNotify("error", resolveApiErrorMessage(err, "Failed to reject entry."));
        }
    }

    async function handleDeleteEntry(id: string) {
        if (!confirm("Are you sure you want to delete this capital spend record?")) return;
        try {
            await deleteMutation.mutateAsync(id);
            showNotify("success", "Capital spend entry deleted.");
        } catch (err: unknown) {
            showNotify("error", resolveApiErrorMessage(err, "Failed to delete entry."));
        }
    }

    return (
        <div className="relative mx-auto max-w-[1400px] space-y-6 pb-12">
            <Scope3Navbar />

            {notification && (
                <div
                    className={`flex items-center justify-between rounded-xl px-4 py-3 font-sans text-sm font-medium shadow-md border ${
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

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant/40 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 font-sans text-xs text-on-surface-variant font-medium">
                        <Link href="/scope-3" className="hover:text-primary transition-colors">
                            Scope 3 Value Chain
                        </Link>
                        <span>/</span>
                        <span className="text-secondary font-semibold">Cat 2: Capital Goods</span>
                    </div>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-primary">
                        Capital Goods (Spend-Based)
                    </h1>
                    <p className="font-sans text-sm text-on-surface-variant max-w-3xl">
                        Quantify upstream Scope 3 Category 2 emissions from capital expenditures (machinery, equipment, vehicles, buildings) using US EPA USEEIO factors and the EPA 2022 USD/INR conversion baseline.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" size="md" onClick={() => refetch()} className="gap-1.5 font-medium">
                        <MaterialIcon name="refresh" size="sm" />
                        <span>Refresh</span>
                    </Button>
                    <Button variant="primary" size="md" onClick={handleOpenCreate} className="gap-1.5 font-medium">
                        <MaterialIcon name="add" size="sm" />
                        <span>Log Capital Goods Spend</span>
                    </Button>
                </div>
            </div>

            <Card className="p-4 border-outline-variant/60">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 font-sans text-sm">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Status Filter</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-sm font-medium text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="">All Statuses</option>
                            <option value="verified">Verified (Locked)</option>
                            <option value="submitted">Submitted (Pending Review)</option>
                            <option value="draft">Draft</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Spend Year</label>
                        <select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-sm font-medium text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="">All Years</option>
                            <option value="2020">2020</option>
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Facility</label>
                        <select
                            value={facilityFilter}
                            onChange={(e) => setFacilityFilter(e.target.value)}
                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-sm font-medium text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="">All Facilities</option>
                            {(facilitiesQuery.data ?? []).map((fac) => (
                                <option key={fac.id} value={fac.id}>
                                    {fac.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Reporting Period</label>
                        <select
                            value={periodIdFilter}
                            onChange={(e) => setPeriodIdFilter(e.target.value)}
                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-sm font-medium text-primary focus:outline-none focus:ring-1 focus:ring-primary">
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

            <Category2Summary entries={entries} />

            <Category2Table
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

            <Category2FormModal
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

            <Category2DetailModal
                entry={detailEntry}
                onClose={() => setDetailEntry(null)}
            />

            <Category2RejectModal
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
