"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Scope3Navbar } from "@/components/scope3/Scope3Navbar";
import { Category15Summary } from "./Category15Summary";
import { Category15Table } from "./Category15Table";
import { Category15FormModal } from "./Category15FormModal";
import { Category15DetailModal } from "./Category15DetailModal";
import { Category15RejectModal } from "./Category15RejectModal";
import {
    useAmendCategory15InvestmentEntry,
    useCategory15InvestmentEntries,
    useCreateCategory15InvestmentEntry,
    useDeleteCategory15InvestmentEntry,
    useRejectCategory15InvestmentEntry,
    useSubmitCategory15InvestmentEntry,
    useUpdateCategory15InvestmentEntry,
    useVerifyCategory15InvestmentEntry,
} from "@/lib/scope3/category15/hooks";
import {
    AmendCategory15InvestmentPayload,
    AssetClassEnum,
    Category15FilterParams,
    Category15InvestmentEntry,
    CreateCategory15InvestmentPayload,
} from "@/lib/scope3/category15/types";
import { useFacilities } from "@/lib/facility/hooks";
import { useReportingPeriods } from "@/lib/reportingPeriods/hooks";
import { AiAssistantFAB } from "@/components/dashboard/AiAssistantFAB";

export function Category15View() {
    // Filter State
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [facilityFilter, setFacilityFilter] = useState<string>("");
    const [assetClassFilter, setAssetClassFilter] = useState<string>("");
    const [periodIdFilter, setPeriodIdFilter] = useState<string>("");
    const [searchFilter, setSearchFilter] = useState<string>("");

    const filterParams: Category15FilterParams = useMemo(
        () => ({
            status: statusFilter || undefined,
            facility_id: facilityFilter || undefined,
            asset_class: assetClassFilter ? (assetClassFilter as AssetClassEnum) : undefined,
            reporting_period_id: periodIdFilter || undefined,
            search: searchFilter || undefined,
        }),
        [statusFilter, facilityFilter, assetClassFilter, periodIdFilter, searchFilter],
    );

    // Queries
    const investmentsQuery = useCategory15InvestmentEntries(filterParams);
    const facilitiesQuery = useFacilities();
    const reportingPeriodsQuery = useReportingPeriods();

    // Mutations
    const createMutation = useCreateCategory15InvestmentEntry();
    const updateMutation = useUpdateCategory15InvestmentEntry();
    const deleteMutation = useDeleteCategory15InvestmentEntry();
    const submitMutation = useSubmitCategory15InvestmentEntry();
    const verifyMutation = useVerifyCategory15InvestmentEntry();
    const rejectMutation = useRejectCategory15InvestmentEntry();
    const amendMutation = useAmendCategory15InvestmentEntry();

    // Modal State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit" | "amend">("create");
    const [selectedEntry, setSelectedEntry] = useState<Category15InvestmentEntry | null>(null);

    const [detailEntry, setDetailEntry] = useState<Category15InvestmentEntry | null>(null);
    const [rejectTarget, setRejectTarget] = useState<Category15InvestmentEntry | null>(null);
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

    function handleOpenEdit(entry: Category15InvestmentEntry) {
        setSelectedEntry(entry);
        setFormMode("edit");
        setIsFormOpen(true);
    }

    function handleOpenAmend(entry: Category15InvestmentEntry) {
        setSelectedEntry(entry);
        setFormMode("amend");
        setIsFormOpen(true);
    }

    function handleOpenDetail(entry: Category15InvestmentEntry) {
        setDetailEntry(entry);
    }

    function handleOpenReject(entry: Category15InvestmentEntry) {
        setRejectTarget(entry);
        setIsRejectOpen(true);
    }

    async function handleFormSubmit(payload: CreateCategory15InvestmentPayload | AmendCategory15InvestmentPayload) {
        try {
            if (formMode === "create") {
                await createMutation.mutateAsync(payload as CreateCategory15InvestmentPayload);
                showNotify("success", "Category 15 investment entry created successfully.");
            } else if (formMode === "edit" && selectedEntry) {
                await updateMutation.mutateAsync({
                    activityId: selectedEntry.id,
                    payload: payload as CreateCategory15InvestmentPayload,
                });
                showNotify("success", "Category 15 investment entry updated successfully.");
            } else if (formMode === "amend" && selectedEntry) {
                await amendMutation.mutateAsync({
                    activityId: selectedEntry.id,
                    payload: payload as AmendCategory15InvestmentPayload,
                });
                showNotify("success", "Verified Category 15 investment record amended successfully.");
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
            showNotify("success", "Category 15 investment record rejected.");
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
                        <span className="text-secondary font-bold">Cat 15: Investments (Financed Emissions)</span>
                    </div>
                    <h1 className="text-headline-md font-bold text-primary tracking-tight">
                        Investments & Financed Emissions (Category 15)
                    </h1>
                    <p className="font-mono text-xs text-on-surface-variant max-w-3xl">
                        Quantify Scope 3 Category 15 financed emissions across 7 PCAF asset classes (listed shares, business loans, project finance, property loans, mortgages, vehicle loans, and sovereign debt).
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={() => investmentsQuery.refetch()}
                        className="gap-1.5 font-mono text-xs">
                        <MaterialIcon name="refresh" size="sm" />
                        <span>Refresh</span>
                    </Button>

                    <Button variant="primary" size="md" onClick={handleOpenCreate} className="gap-1.5 font-mono text-xs">
                        <MaterialIcon name="add" size="sm" />
                        <span>Log Investment Activity</span>
                    </Button>
                </div>
            </div>

            {/* Filter Control Toolbar */}
            <Card className="p-4 border-outline-variant/60">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 font-mono text-xs">
                    <div>
                        <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Search Financed Asset</label>
                        <input
                            type="text"
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            placeholder="Search asset title..."
                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">PCAF Asset Class</label>
                        <select
                            value={assetClassFilter}
                            onChange={(e) => setAssetClassFilter(e.target.value)}
                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="">All PCAF Classes</option>
                            <option value="listed_shares_or_corporate_bonds">#1 Listed shares or corporate bonds</option>
                            <option value="business_loan_or_unlisted_equity">#2 Business loan or unlisted equity</option>
                            <option value="project_finance">#3 Project finance</option>
                            <option value="commercial_property_loan">#4 Commercial property loan</option>
                            <option value="home_loan_mortgage">#5 Home loan / mortgage</option>
                            <option value="motor_vehicle_loan">#6 Motor vehicle loan</option>
                            <option value="sovereign_debt">#9 Sovereign debt</option>
                        </select>
                    </div>

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
                        <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Facility / Portfolio</label>
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
            <Category15Summary entries={investmentsQuery.data ?? []} />

            {/* High-density Data Table */}
            <Category15Table
                entries={investmentsQuery.data ?? []}
                isLoading={investmentsQuery.isLoading}
                onViewDetail={handleOpenDetail}
                onEdit={handleOpenEdit}
                onAmend={handleOpenAmend}
                onSubmitEntry={async (id) => {
                    try {
                        await submitMutation.mutateAsync(id);
                        showNotify("success", "Category 15 investment entry submitted for review.");
                    } catch (err: unknown) {
                        const msg = err instanceof Error ? err.message : "Submit failed.";
                        showNotify("error", msg);
                    }
                }}
                onVerifyEntry={async (id) => {
                    try {
                        await verifyMutation.mutateAsync(id);
                        showNotify("success", "Category 15 investment entry verified.");
                    } catch (err: unknown) {
                        const msg = err instanceof Error ? err.message : "Verify failed.";
                        showNotify("error", msg);
                    }
                }}
                onRejectEntry={handleOpenReject}
                onDeleteEntry={async (id) => {
                    if (!confirm("Are you sure you want to delete this investment record?")) return;
                    try {
                        await deleteMutation.mutateAsync(id);
                        showNotify("success", "Category 15 investment entry deleted.");
                    } catch (err: unknown) {
                        const msg = err instanceof Error ? err.message : "Delete failed.";
                        showNotify("error", msg);
                    }
                }}
            />

            {/* Form Modal */}
            <Category15FormModal
                key={`cat15-${selectedEntry?.id ?? "new"}-${formMode}-${isFormOpen}`}
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
            <Category15DetailModal entry={detailEntry} onClose={() => setDetailEntry(null)} />

            {/* Reject Modal */}
            <Category15RejectModal
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
