"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Scope3Navbar } from "@/components/scope3/Scope3Navbar";
import { Category5Summary } from "./Category5Summary";
import { Category5Table } from "./Category5Table";
import { Category5FormModal } from "./Category5FormModal";
import { Category5DetailModal } from "./Category5DetailModal";
import { Category5RejectModal } from "./Category5RejectModal";
import {
    useAmendCategory5WasteEntry,
    useCategory5WasteEntries,
    useCreateCategory5WasteEntry,
    useDeleteCategory5WasteEntry,
    useRejectCategory5WasteEntry,
    useSubmitCategory5WasteEntry,
    useUpdateCategory5WasteEntry,
    useVerifyCategory5WasteEntry,
} from "@/lib/scope3/category5/hooks";
import {
    AmendCategory5WastePayload,
    Category5FilterParams,
    Category5WasteActivityEntry,
    CreateCategory5WastePayload,
} from "@/lib/scope3/category5/types";
import { useFacilities } from "@/lib/facility/hooks";
import { AiAssistantFAB } from "@/components/dashboard/AiAssistantFAB";

export function Category5View() {
    // Filter State
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [facilityFilter, setFacilityFilter] = useState<string>("");
    const [periodFilter, setPeriodFilter] = useState<string>("");

    const filterParams: Category5FilterParams = useMemo(
        () => ({
            status: statusFilter || undefined,
            facility_id: facilityFilter || undefined,
            reporting_period: periodFilter || undefined,
        }),
        [statusFilter, facilityFilter, periodFilter],
    );

    // Queries
    const wasteQuery = useCategory5WasteEntries(filterParams);
    const facilitiesQuery = useFacilities();

    // Mutations
    const createMutation = useCreateCategory5WasteEntry();
    const updateMutation = useUpdateCategory5WasteEntry();
    const deleteMutation = useDeleteCategory5WasteEntry();
    const submitMutation = useSubmitCategory5WasteEntry();
    const verifyMutation = useVerifyCategory5WasteEntry();
    const rejectMutation = useRejectCategory5WasteEntry();
    const amendMutation = useAmendCategory5WasteEntry();

    // Modal State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit" | "amend">("create");
    const [selectedEntry, setSelectedEntry] = useState<Category5WasteActivityEntry | null>(null);

    const [detailEntry, setDetailEntry] = useState<Category5WasteActivityEntry | null>(null);
    const [rejectTarget, setRejectTarget] = useState<Category5WasteActivityEntry | null>(null);
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

    function handleOpenEdit(entry: Category5WasteActivityEntry) {
        setSelectedEntry(entry);
        setFormMode("edit");
        setIsFormOpen(true);
    }

    function handleOpenAmend(entry: Category5WasteActivityEntry) {
        setSelectedEntry(entry);
        setFormMode("amend");
        setIsFormOpen(true);
    }

    function handleOpenDetail(entry: Category5WasteActivityEntry) {
        setDetailEntry(entry);
    }

    function handleOpenReject(entry: Category5WasteActivityEntry) {
        setRejectTarget(entry);
        setIsRejectOpen(true);
    }

    async function handleFormSubmit(payload: CreateCategory5WastePayload | AmendCategory5WastePayload) {
        try {
            if (formMode === "create") {
                await createMutation.mutateAsync(payload as CreateCategory5WastePayload);
                showNotify("success", "Category 5 waste activity logged successfully.");
            } else if (formMode === "edit" && selectedEntry) {
                await updateMutation.mutateAsync({
                    activityId: selectedEntry.id,
                    payload: payload as CreateCategory5WastePayload,
                });
                showNotify("success", "Category 5 waste activity updated successfully.");
            } else if (formMode === "amend" && selectedEntry) {
                await amendMutation.mutateAsync({
                    activityId: selectedEntry.id,
                    payload: payload as AmendCategory5WastePayload,
                });
                showNotify("success", "Verified Category 5 waste entry amended successfully.");
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
            showNotify("success", "Category 5 waste entry rejected.");
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
                        <span className="text-secondary font-bold">Cat 5: Waste Generated in Operations</span>
                    </div>
                    <h1 className="text-headline-md font-bold text-primary tracking-tight">
                        Waste Generated in Operations (Category 5)
                    </h1>
                    <p className="font-mono text-xs text-on-surface-variant max-w-3xl">
                        Quantify Scope 3 Category 5 emissions from the disposal and treatment of waste generated in tenant operations across landfill, recycling, composting, incineration, and digestion routes.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={() => wasteQuery.refetch()}
                        className="gap-1.5 font-mono text-xs">
                        <MaterialIcon name="refresh" size="sm" />
                        <span>Refresh</span>
                    </Button>

                    <Button variant="primary" size="md" onClick={handleOpenCreate} className="gap-1.5 font-mono text-xs">
                        <MaterialIcon name="add" size="sm" />
                        <span>Log Operational Waste Entry</span>
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

                    <div>
                        <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Reporting Period</label>
                        <input
                            type="text"
                            value={periodFilter}
                            onChange={(e) => setPeriodFilter(e.target.value)}
                            placeholder="Search period (e.g. FY 2021-22)"
                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>
            </Card>

            {/* Summary KPI Cards */}
            <Category5Summary entries={wasteQuery.data ?? []} />

            {/* High-density Data Table */}
            <Category5Table
                entries={wasteQuery.data ?? []}
                isLoading={wasteQuery.isLoading}
                onViewDetail={handleOpenDetail}
                onEdit={handleOpenEdit}
                onAmend={handleOpenAmend}
                onSubmitEntry={async (id) => {
                    try {
                        await submitMutation.mutateAsync(id);
                        showNotify("success", "Category 5 waste entry submitted for review.");
                    } catch (err: unknown) {
                        const msg = err instanceof Error ? err.message : "Submit failed.";
                        showNotify("error", msg);
                    }
                }}
                onVerifyEntry={async (id) => {
                    try {
                        await verifyMutation.mutateAsync(id);
                        showNotify("success", "Category 5 waste entry verified.");
                    } catch (err: unknown) {
                        const msg = err instanceof Error ? err.message : "Verify failed.";
                        showNotify("error", msg);
                    }
                }}
                onRejectEntry={handleOpenReject}
                onDeleteEntry={async (id) => {
                    if (!confirm("Are you sure you want to delete this operational waste entry?")) return;
                    try {
                        await deleteMutation.mutateAsync(id);
                        showNotify("success", "Category 5 waste entry deleted.");
                    } catch (err: unknown) {
                        const msg = err instanceof Error ? err.message : "Delete failed.";
                        showNotify("error", msg);
                    }
                }}
            />

            {/* Form Modal */}
            <Category5FormModal
                key={`cat5-${selectedEntry?.id ?? "new"}-${formMode}-${isFormOpen}`}
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
            <Category5DetailModal entry={detailEntry} onClose={() => setDetailEntry(null)} />

            {/* Reject Modal */}
            <Category5RejectModal
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
