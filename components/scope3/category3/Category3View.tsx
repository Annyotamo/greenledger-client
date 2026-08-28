"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Scope3Navbar } from "@/components/scope3/Scope3Navbar";
import { Category3FuelSummary } from "./Category3FuelSummary";
import { Category3ElecSummary } from "./Category3ElecSummary";
import { Category3FuelTable } from "./Category3FuelTable";
import { Category3ElecTable } from "./Category3ElecTable";
import { Category3FuelFormModal } from "./Category3FuelFormModal";
import { Category3ElecFormModal } from "./Category3ElecFormModal";
import { Category3DetailModal } from "./Category3DetailModal";
import { Category3RejectModal } from "./Category3RejectModal";
import {
    useAmendElectricityTdActivity,
    useAmendWttFuelActivity,
    useCreateElectricityTdActivity,
    useCreateWttFuelActivity,
    useDeleteElectricityTdActivity,
    useDeleteWttFuelActivity,
    useElectricityTdActivities,
    useRejectElectricityTdActivity,
    useRejectWttFuelActivity,
    useSubmitElectricityTdActivity,
    useSubmitWttFuelActivity,
    useUpdateElectricityTdActivity,
    useUpdateWttFuelActivity,
    useVerifyElectricityTdActivity,
    useVerifyWttFuelActivity,
    useWttFuelActivities,
} from "@/lib/scope3/category3/hooks";
import {
    AmendElectricityTdPayload,
    AmendWttFuelPayload,
    Category3FilterParams,
    CreateElectricityTdPayload,
    CreateWttFuelPayload,
    ElectricityTdActivityEntry,
    WttFuelActivityEntry,
} from "@/lib/scope3/category3/types";
import { useFacilities } from "@/lib/facility/hooks";
import { useReportingPeriods } from "@/lib/reportingPeriods/hooks";
import { AiAssistantFAB } from "@/components/dashboard/AiAssistantFAB";

export function Category3View() {
    // Differentiated Sub-Tab State
    const [subTab, setSubTab] = useState<"fuel" | "electricity">("fuel");

    // Filter State
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [facilityFilter, setFacilityFilter] = useState<string>("");
    const [periodIdFilter, setPeriodIdFilter] = useState<string>("");

    const filterParams: Category3FilterParams = useMemo(
        () => ({
            status: statusFilter || undefined,
            facility_id: facilityFilter || undefined,
            reporting_period_id: periodIdFilter || undefined,
        }),
        [statusFilter, facilityFilter, periodIdFilter],
    );

    // Queries
    const fuelQuery = useWttFuelActivities(filterParams);
    const elecQuery = useElectricityTdActivities(filterParams);
    const facilitiesQuery = useFacilities();
    const reportingPeriodsQuery = useReportingPeriods();

    // Mutations - WTT Fuel
    const createFuelMutation = useCreateWttFuelActivity();
    const updateFuelMutation = useUpdateWttFuelActivity();
    const deleteFuelMutation = useDeleteWttFuelActivity();
    const submitFuelMutation = useSubmitWttFuelActivity();
    const verifyFuelMutation = useVerifyWttFuelActivity();
    const rejectFuelMutation = useRejectWttFuelActivity();
    const amendFuelMutation = useAmendWttFuelActivity();

    // Mutations - Electricity T&D
    const createElecMutation = useCreateElectricityTdActivity();
    const updateElecMutation = useUpdateElectricityTdActivity();
    const deleteElecMutation = useDeleteElectricityTdActivity();
    const submitElecMutation = useSubmitElectricityTdActivity();
    const verifyElecMutation = useVerifyElectricityTdActivity();
    const rejectElecMutation = useRejectElectricityTdActivity();
    const amendElecMutation = useAmendElectricityTdActivity();

    // Modals - Fuel
    const [isFuelFormOpen, setIsFuelFormOpen] = useState(false);
    const [fuelFormMode, setFuelFormMode] = useState<"create" | "edit" | "amend">("create");
    const [selectedFuelEntry, setSelectedFuelEntry] = useState<WttFuelActivityEntry | null>(null);

    // Modals - Electricity
    const [isElecFormOpen, setIsElecFormOpen] = useState(false);
    const [elecFormMode, setElecFormMode] = useState<"create" | "edit" | "amend">("create");
    const [selectedElecEntry, setSelectedElecEntry] = useState<ElectricityTdActivityEntry | null>(null);

    // Detail & Reject Modals
    const [detailType, setDetailType] = useState<"fuel" | "electricity">("fuel");
    const [detailFuelEntry, setDetailFuelEntry] = useState<WttFuelActivityEntry | null>(null);
    const [detailElecEntry, setDetailElecEntry] = useState<ElectricityTdActivityEntry | null>(null);

    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [rejectType, setRejectType] = useState<"fuel" | "electricity">("fuel");
    const [rejectFuelTarget, setRejectFuelTarget] = useState<WttFuelActivityEntry | null>(null);
    const [rejectElecTarget, setRejectElecTarget] = useState<ElectricityTdActivityEntry | null>(null);

    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    function showNotify(type: "success" | "error", message: string) {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    }

    // Handlers - Fuel
    function handleOpenFuelCreate() {
        setSelectedFuelEntry(null);
        setFuelFormMode("create");
        setIsFuelFormOpen(true);
    }

    function handleOpenFuelEdit(entry: WttFuelActivityEntry) {
        setSelectedFuelEntry(entry);
        setFuelFormMode("edit");
        setIsFuelFormOpen(true);
    }

    function handleOpenFuelAmend(entry: WttFuelActivityEntry) {
        setSelectedFuelEntry(entry);
        setFuelFormMode("amend");
        setIsFuelFormOpen(true);
    }

    function handleOpenFuelDetail(entry: WttFuelActivityEntry) {
        setDetailType("fuel");
        setDetailFuelEntry(entry);
    }

    function handleOpenFuelReject(entry: WttFuelActivityEntry) {
        setRejectType("fuel");
        setRejectFuelTarget(entry);
        setIsRejectOpen(true);
    }

    async function handleFuelFormSubmit(payload: CreateWttFuelPayload | AmendWttFuelPayload) {
        try {
            if (fuelFormMode === "create") {
                await createFuelMutation.mutateAsync(payload as CreateWttFuelPayload);
                showNotify("success", "WTT Fuel activity logged successfully.");
            } else if (fuelFormMode === "edit" && selectedFuelEntry) {
                await updateFuelMutation.mutateAsync({
                    activityId: selectedFuelEntry.id,
                    payload: payload as CreateWttFuelPayload,
                });
                showNotify("success", "WTT Fuel activity updated successfully.");
            } else if (fuelFormMode === "amend" && selectedFuelEntry) {
                await amendFuelMutation.mutateAsync({
                    activityId: selectedFuelEntry.id,
                    payload: payload as AmendWttFuelPayload,
                });
                showNotify("success", "Verified WTT Fuel entry amended successfully.");
            }
            setIsFuelFormOpen(false);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Operation failed.";
            showNotify("error", msg);
        }
    }

    // Handlers - Electricity T&D
    function handleOpenElecCreate() {
        setSelectedElecEntry(null);
        setElecFormMode("create");
        setIsElecFormOpen(true);
    }

    function handleOpenElecEdit(entry: ElectricityTdActivityEntry) {
        setSelectedElecEntry(entry);
        setElecFormMode("edit");
        setIsElecFormOpen(true);
    }

    function handleOpenElecAmend(entry: ElectricityTdActivityEntry) {
        setSelectedElecEntry(entry);
        setElecFormMode("amend");
        setIsElecFormOpen(true);
    }

    function handleOpenElecDetail(entry: ElectricityTdActivityEntry) {
        setDetailType("electricity");
        setDetailElecEntry(entry);
    }

    function handleOpenElecReject(entry: ElectricityTdActivityEntry) {
        setRejectType("electricity");
        setRejectElecTarget(entry);
        setIsRejectOpen(true);
    }

    async function handleElecFormSubmit(payload: CreateElectricityTdPayload | AmendElectricityTdPayload) {
        try {
            if (elecFormMode === "create") {
                await createElecMutation.mutateAsync(payload as CreateElectricityTdPayload);
                showNotify("success", "Electricity T&D loss activity logged successfully.");
            } else if (elecFormMode === "edit" && selectedElecEntry) {
                await updateElecMutation.mutateAsync({
                    activityId: selectedElecEntry.id,
                    payload: payload as CreateElectricityTdPayload,
                });
                showNotify("success", "Electricity T&D loss activity updated successfully.");
            } else if (elecFormMode === "amend" && selectedElecEntry) {
                await amendElecMutation.mutateAsync({
                    activityId: selectedElecEntry.id,
                    payload: payload as AmendElectricityTdPayload,
                });
                showNotify("success", "Verified T&D Loss entry amended successfully.");
            }
            setIsElecFormOpen(false);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Operation failed.";
            showNotify("error", msg);
        }
    }

    async function handleConfirmReject(reason: string) {
        try {
            if (rejectType === "fuel" && rejectFuelTarget) {
                await rejectFuelMutation.mutateAsync({ activityId: rejectFuelTarget.id, reason });
                showNotify("success", "WTT Fuel activity rejected.");
            } else if (rejectType === "electricity" && rejectElecTarget) {
                await rejectElecMutation.mutateAsync({ activityId: rejectElecTarget.id, reason });
                showNotify("success", "Electricity T&D activity rejected.");
            }
            setIsRejectOpen(false);
            setRejectFuelTarget(null);
            setRejectElecTarget(null);
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
                        <span className="text-secondary font-bold">Cat 3: Fuel & Energy Activities</span>
                    </div>
                    <h1 className="text-headline-md font-bold text-primary tracking-tight">
                        Fuel & Energy-Related Activities (WTT & Grid T&D Losses)
                    </h1>
                    <p className="font-mono text-xs text-on-surface-variant max-w-3xl">
                        Quantify upstream Scope 3 Category 3 emissions from Well-To-Tank (WTT) fuel extraction & refining and electricity Transmission & Distribution (T&D) grid losses.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={() => {
                            fuelQuery.refetch();
                            elecQuery.refetch();
                        }}
                        className="gap-1.5 font-mono text-xs">
                        <MaterialIcon name="refresh" size="sm" />
                        <span>Refresh</span>
                    </Button>

                    {subTab === "fuel" ? (
                        <Button variant="primary" size="md" onClick={handleOpenFuelCreate} className="gap-1.5 font-mono text-xs">
                            <MaterialIcon name="add" size="sm" />
                            <span>Log WTT Fuel Activity</span>
                        </Button>
                    ) : (
                        <Button variant="primary" size="md" onClick={handleOpenElecCreate} className="gap-1.5 font-mono text-xs">
                            <MaterialIcon name="add" size="sm" />
                            <span>Log T&D Losses Activity</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Differentiated Sub-Tab Switcher Pill Bar */}
            <div className="flex items-center gap-2 border-b border-outline-variant/40 pb-2">
                <button
                    type="button"
                    onClick={() => setSubTab("fuel")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                        subTab === "fuel"
                            ? "bg-secondary text-on-secondary shadow-md"
                            : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                    }`}>
                    <MaterialIcon name="local_gas_station" size="sm" />
                    <span>Upstream WTT Fuels</span>
                    <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                        {(fuelQuery.data ?? []).length}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setSubTab("electricity")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                        subTab === "electricity"
                            ? "bg-secondary text-on-secondary shadow-md"
                            : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                    }`}>
                    <MaterialIcon name="bolt" size="sm" />
                    <span>Electricity Grid T&D Losses</span>
                    <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                        {(elecQuery.data ?? []).length}
                    </span>
                </button>
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

            {/* Render Differentiated Sub-Tab Section */}
            {subTab === "fuel" ? (
                <>
                    <Category3FuelSummary entries={fuelQuery.data ?? []} />

                    <Category3FuelTable
                        entries={fuelQuery.data ?? []}
                        isLoading={fuelQuery.isLoading}
                        onViewDetail={handleOpenFuelDetail}
                        onEdit={handleOpenFuelEdit}
                        onAmend={handleOpenFuelAmend}
                        onSubmitEntry={async (id) => {
                            try {
                                await submitFuelMutation.mutateAsync(id);
                                showNotify("success", "WTT Fuel entry submitted for approval.");
                            } catch (err: unknown) {
                                const msg = err instanceof Error ? err.message : "Submit failed.";
                                showNotify("error", msg);
                            }
                        }}
                        onVerifyEntry={async (id) => {
                            try {
                                await verifyFuelMutation.mutateAsync(id);
                                showNotify("success", "WTT Fuel entry verified.");
                            } catch (err: unknown) {
                                const msg = err instanceof Error ? err.message : "Verify failed.";
                                showNotify("error", msg);
                            }
                        }}
                        onRejectEntry={handleOpenFuelReject}
                        onDeleteEntry={async (id) => {
                            if (!confirm("Are you sure you want to delete this WTT Fuel activity?")) return;
                            try {
                                await deleteFuelMutation.mutateAsync(id);
                                showNotify("success", "WTT Fuel activity deleted.");
                            } catch (err: unknown) {
                                const msg = err instanceof Error ? err.message : "Delete failed.";
                                showNotify("error", msg);
                            }
                        }}
                    />
                </>
            ) : (
                <>
                    <Category3ElecSummary entries={elecQuery.data ?? []} />

                    <Category3ElecTable
                        entries={elecQuery.data ?? []}
                        isLoading={elecQuery.isLoading}
                        onViewDetail={handleOpenElecDetail}
                        onEdit={handleOpenElecEdit}
                        onAmend={handleOpenElecAmend}
                        onSubmitEntry={async (id) => {
                            try {
                                await submitElecMutation.mutateAsync(id);
                                showNotify("success", "Electricity T&D entry submitted for approval.");
                            } catch (err: unknown) {
                                const msg = err instanceof Error ? err.message : "Submit failed.";
                                showNotify("error", msg);
                            }
                        }}
                        onVerifyEntry={async (id) => {
                            try {
                                await verifyElecMutation.mutateAsync(id);
                                showNotify("success", "Electricity T&D entry verified.");
                            } catch (err: unknown) {
                                const msg = err instanceof Error ? err.message : "Verify failed.";
                                showNotify("error", msg);
                            }
                        }}
                        onRejectEntry={handleOpenElecReject}
                        onDeleteEntry={async (id) => {
                            if (!confirm("Are you sure you want to delete this T&D loss activity?")) return;
                            try {
                                await deleteElecMutation.mutateAsync(id);
                                showNotify("success", "T&D loss activity deleted.");
                            } catch (err: unknown) {
                                const msg = err instanceof Error ? err.message : "Delete failed.";
                                showNotify("error", msg);
                            }
                        }}
                    />
                </>
            )}

            {/* Modals */}
            <Category3FuelFormModal
                key={`fuel-${selectedFuelEntry?.id ?? "new"}-${fuelFormMode}-${isFuelFormOpen}`}
                isOpen={isFuelFormOpen}
                mode={fuelFormMode}
                initialEntry={selectedFuelEntry}
                onClose={() => setIsFuelFormOpen(false)}
                onSubmit={handleFuelFormSubmit}
                isSubmitting={
                    createFuelMutation.isPending ||
                    updateFuelMutation.isPending ||
                    amendFuelMutation.isPending
                }
            />

            <Category3ElecFormModal
                key={`elec-${selectedElecEntry?.id ?? "new"}-${elecFormMode}-${isElecFormOpen}`}
                isOpen={isElecFormOpen}
                mode={elecFormMode}
                initialEntry={selectedElecEntry}
                onClose={() => setIsElecFormOpen(false)}
                onSubmit={handleElecFormSubmit}
                isSubmitting={
                    createElecMutation.isPending ||
                    updateElecMutation.isPending ||
                    amendElecMutation.isPending
                }
            />

            <Category3DetailModal
                type={detailType}
                fuelEntry={detailFuelEntry}
                elecEntry={detailElecEntry}
                onClose={() => {
                    setDetailFuelEntry(null);
                    setDetailElecEntry(null);
                }}
            />

            <Category3RejectModal
                isOpen={isRejectOpen}
                title={rejectType === "fuel" ? "Reject WTT Fuel Activity" : "Reject Electricity T&D Activity"}
                onClose={() => {
                    setIsRejectOpen(false);
                    setRejectFuelTarget(null);
                    setRejectElecTarget(null);
                }}
                onConfirm={handleConfirmReject}
                isSubmitting={rejectFuelMutation.isPending || rejectElecMutation.isPending}
            />

            <AiAssistantFAB />
        </div>
    );
}
