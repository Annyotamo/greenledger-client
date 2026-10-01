"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CustomSelect } from "@/components/ui/select";
import {
    useCreateSubUnit,
    useDeleteSubUnit,
    useSubUnits,
    useUpdateSubUnit,
} from "@/lib/facility/hooks";
import {
    formatSubUnitTypeLabel,
    SUB_UNIT_TYPE_LABELS,
    type Facility,
    type FacilitySubUnit,
    type SubUnitStatus,
    type SubUnitType,
} from "@/lib/facility/types";
import { getErrorMessage } from "@/lib/utils/error";

const subUnitTypeOptions: { label: string; value: SubUnitType; icon: string; description: string }[] = [
    { label: "Raw Material Handling", value: "raw_material_handling", icon: "inventory_2", description: "Raw material storage, conveyers, handling & yard" },
    { label: "Coke Oven", value: "coke_oven", icon: "local_fire_department", description: "Coal carbonization & coke battery production" },
    { label: "Sinter Plant", value: "sinter_plant", icon: "grain", description: "Iron ore sintering and agglomeration" },
    { label: "Pellet Plant", value: "pellet_plant", icon: "scatter_plot", description: "Iron ore beneficiation and pelletizing plant" },
    { label: "Lime & Dolo Plant", value: "lime_dolo_plant", icon: "foundation", description: "Lime and calcined dolomite kiln processing" },
    { label: "Blast Furnace", value: "blast_furnace", icon: "heat_pump", description: "Primary ironmaking blast furnace stack" },
    { label: "DRI Plant", value: "dri_plant", icon: "precision_manufacturing", description: "Direct reduced iron (sponge iron) reduction plant" },
    { label: "Ferro Alloy Plant", value: "ferro_alloy_plant", icon: "shield", description: "Submerged arc electric furnace for ferroalloys" },
    { label: "Steel Melt Shop", value: "steel_melt_shop", icon: "whatshot", description: "Basic oxygen furnace (BOF) / Electric arc furnace (EAF)" },
    { label: "Rolling Mill", value: "rolling_mill", icon: "view_week", description: "Hot / cold rolling, bar, rebar, wire & strip mills" },
    { label: "Power Plant", value: "power_plant", icon: "bolt", description: "Captive thermal, gas turbine, or steam generator plant" },
    { label: "Utilities", value: "utilities", icon: "water_drop", description: "Water treatment, compressed air, nitrogen & oxygen plants" },
    { label: "Auxiliary", value: "auxiliary", icon: "build", description: "Maintenance workshops, laboratories, and support services" },
    { label: "Other (Custom Input)", value: "other", icon: "category", description: "Custom specialized industrial division" },
];

const statusStyles: Record<string, { bg: string; label: string }> = {
    active: { bg: "bg-emerald-500/10 text-emerald-800 border-emerald-500/20", label: "Active" },
    inactive: { bg: "bg-slate-100 text-slate-700 border-slate-200", label: "Inactive" },
    decommissioned: { bg: "bg-rose-500/10 text-rose-800 border-rose-500/20", label: "Decommissioned" },
};

type FacilitySubUnitsModalProps = {
    facility: Facility;
    onClose: () => void;
};

export function FacilitySubUnitsModal({ facility, onClose }: FacilitySubUnitsModalProps) {
    const [mounted, setMounted] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSubUnit, setEditingSubUnit] = useState<FacilitySubUnit | null>(null);

    const [subUnitForm, setSubUnitForm] = useState<{
        name: string;
        subUnitCode: string;
        subUnitType: SubUnitType;
        customSubUnitType: string;
        status: SubUnitStatus;
        floorArea: string;
        floorAreaUnit: string;
        description: string;
    }>({
        name: "",
        subUnitCode: "",
        subUnitType: "raw_material_handling",
        customSubUnitType: "",
        status: "active",
        floorArea: "",
        floorAreaUnit: "sqm",
        description: "",
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    // React Query
    const subUnitsQuery = useSubUnits(facility.id, {
        active_only: statusFilter === "active",
        sub_unit_type: typeFilter !== "all" ? typeFilter : undefined,
        status: statusFilter !== "all" && statusFilter !== "active" ? statusFilter : undefined,
    });

    const createMutation = useCreateSubUnit(facility.id);
    const updateMutation = useUpdateSubUnit(facility.id);
    const deleteMutation = useDeleteSubUnit(facility.id);

    if (!mounted) return null;

    const handleOpenCreateForm = () => {
        setEditingSubUnit(null);
        setSubUnitForm({
            name: "",
            subUnitCode: "",
            subUnitType: "raw_material_handling",
            customSubUnitType: "",
            status: "active",
            floorArea: "",
            floorAreaUnit: "sqm",
            description: "",
        });
        setFormErrors({});
        setIsFormOpen(true);
    };

    const handleOpenEditForm = (subUnit: FacilitySubUnit) => {
        setEditingSubUnit(subUnit);
        setSubUnitForm({
            name: subUnit.name,
            subUnitCode: subUnit.subUnitCode || "",
            subUnitType: subUnit.subUnitType || "raw_material_handling",
            customSubUnitType: subUnit.customSubUnitType || "",
            status: subUnit.status || "active",
            floorArea: subUnit.floorArea != null ? String(subUnit.floorArea) : "",
            floorAreaUnit: subUnit.floorAreaUnit || "sqm",
            description: subUnit.description || "",
        });
        setFormErrors({});
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors: Record<string, string> = {};

        if (!subUnitForm.name.trim()) {
            errors.name = "Sub-unit name is required.";
        }

        if (subUnitForm.subUnitType === "other" && !subUnitForm.customSubUnitType.trim()) {
            errors.customSubUnitType = "Custom sub-unit type name is required when 'Other' is selected.";
        }

        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        try {
            if (editingSubUnit) {
                await updateMutation.mutateAsync({
                    subUnitId: editingSubUnit.id,
                    payload: {
                        name: subUnitForm.name.trim(),
                        sub_unit_code: subUnitForm.subUnitCode.trim() || undefined,
                        sub_unit_type: subUnitForm.subUnitType,
                        custom_sub_unit_type:
                            subUnitForm.subUnitType === "other" ? subUnitForm.customSubUnitType.trim() : null,
                        status: subUnitForm.status,
                        description: subUnitForm.description.trim() || null,
                        floor_area: subUnitForm.floorArea ? Number(subUnitForm.floorArea) : null,
                        floor_area_unit: subUnitForm.floorAreaUnit.trim() || null,
                        is_active: subUnitForm.status === "active",
                    },
                });
            } else {
                await createMutation.mutateAsync({
                    name: subUnitForm.name.trim(),
                    sub_unit_code: subUnitForm.subUnitCode.trim() || undefined,
                    sub_unit_type: subUnitForm.subUnitType,
                    custom_sub_unit_type:
                        subUnitForm.subUnitType === "other" ? subUnitForm.customSubUnitType.trim() : undefined,
                    description: subUnitForm.description.trim() || undefined,
                    floor_area: subUnitForm.floorArea ? Number(subUnitForm.floorArea) : undefined,
                    floor_area_unit: subUnitForm.floorAreaUnit.trim() || "sqm",
                });
            }

            setIsFormOpen(false);
            setEditingSubUnit(null);
        } catch (err: unknown) {
            console.error(err);
            const msg = getErrorMessage(err, "Failed to save sub-unit. Please try again.");
            setFormErrors({ submit: msg });
        }
    };

    const handleDeleteConfirm = async (subUnitId: string) => {
        try {
            await deleteMutation.mutateAsync(subUnitId);
            setDeletingId(null);
        } catch (err: unknown) {
            console.error(err);
        }
    };

    const subUnits = subUnitsQuery.data || [];
    const filteredSubUnits = subUnits.filter((su) => {
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return (
            su.name.toLowerCase().includes(q) ||
            su.subUnitCode.toLowerCase().includes(q) ||
            (su.description && su.description.toLowerCase().includes(q))
        );
    });

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const modalContent = (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs overflow-y-auto animate-fade-in">
            <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-outline-variant flex flex-col max-h-[90vh] overflow-hidden">
                {/* Mode 1: Create / Edit Form View */}
                {isFormOpen ? (
                    <>
                        {/* Header for Form View */}
                        <div className="flex items-center justify-between border-b border-outline-variant bg-surface px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary shadow-xs">
                                    <MaterialIcon name={editingSubUnit ? "edit" : "add_circle"} size="sm" />
                                </div>
                                <div>
                                    <h3 className="font-display text-lg font-semibold tracking-tight text-primary">
                                        {editingSubUnit ? "Edit Operational Sub-Unit" : "Create New Operational Sub-Unit"}
                                    </h3>
                                    <p className="text-xs text-on-surface-variant font-sans mt-0.5">
                                        Facility: <span className="font-semibold text-primary">{facility.name}</span> ({facility.facilityCode || "FAC"})
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                        setIsFormOpen(false);
                                        setEditingSubUnit(null);
                                    }}
                                    className="text-xs flex items-center gap-1">
                                    <MaterialIcon name="arrow_back" size="xs" />
                                    <span>Back to List</span>
                                </Button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors">
                                    <MaterialIcon name="close" size="sm" />
                                </button>
                            </div>
                        </div>

                        {/* Form Body */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {formErrors.submit && (
                                <div className="mb-5 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-center gap-2">
                                    <MaterialIcon name="error" size="xs" className="text-rose-600 shrink-0" />
                                    <span>{formErrors.submit}</span>
                                </div>
                            )}

                            <form id="sub-unit-form" onSubmit={handleFormSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Sub-Unit Name <span className="text-error">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={subUnitForm.name}
                                            onChange={(e) => {
                                                setSubUnitForm((cur) => ({ ...cur, name: e.target.value }));
                                                setFormErrors((cur) => ({ ...cur, name: "" }));
                                            }}
                                            placeholder="e.g. Boiler House 1, Assembly Line A"
                                            className={`w-full rounded-lg border ${
                                                formErrors.name ? "border-error" : "border-outline-variant"
                                            } bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs`}
                                        />
                                        {formErrors.name && <p className="mt-1 text-[10px] text-error">{formErrors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Sub-Unit Code <span className="text-[10px] text-slate-400 font-normal">(Auto-generated if empty)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={subUnitForm.subUnitCode}
                                            onChange={(e) =>
                                                setSubUnitForm((cur) => ({ ...cur, subUnitCode: e.target.value.toUpperCase() }))
                                            }
                                            placeholder="e.g. BH-01, AL-01 (AUTO: SU-001)"
                                            className="w-full rounded-lg border border-outline-variant bg-white px-3.5 py-2.5 text-xs font-mono uppercase text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-slate-700">
                                            Sub-Unit Type <span className="text-error">*</span>
                                        </label>
                                        <CustomSelect
                                            options={subUnitTypeOptions.map((opt) => ({
                                                label: opt.label,
                                                value: opt.value,
                                            }))}
                                            value={subUnitForm.subUnitType}
                                            onChange={(val) =>
                                                setSubUnitForm((cur) => ({ ...cur, subUnitType: val as SubUnitType }))
                                            }
                                        />
                                    </div>

                                    {subUnitForm.subUnitType === "other" && (
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-semibold text-slate-700">
                                                Custom Sub-Unit Type <span className="text-error">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                maxLength={255}
                                                value={subUnitForm.customSubUnitType}
                                                onChange={(e) => {
                                                    setSubUnitForm((cur) => ({ ...cur, customSubUnitType: e.target.value }));
                                                    setFormErrors((cur) => ({ ...cur, customSubUnitType: "" }));
                                                }}
                                                placeholder="e.g. Slag Grinding & Processing Area"
                                                className={`w-full rounded-lg border ${
                                                    formErrors.customSubUnitType ? "border-error" : "border-outline-variant"
                                                } bg-white px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs`}
                                            />
                                            {formErrors.customSubUnitType && (
                                                <p className="mt-1 text-[10px] text-error">{formErrors.customSubUnitType}</p>
                                            )}
                                        </div>
                                    )}

                                    {editingSubUnit && (
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-semibold text-slate-700">
                                                Status
                                            </label>
                                            <CustomSelect
                                                options={[
                                                    { label: "Active", value: "active" },
                                                    { label: "Inactive", value: "inactive" },
                                                    { label: "Decommissioned", value: "decommissioned" },
                                                ]}
                                                value={subUnitForm.status}
                                                onChange={(val) =>
                                                    setSubUnitForm((cur) => ({ ...cur, status: val as SubUnitStatus }))
                                                }
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-slate-700">
                                            Floor Area
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                step="any"
                                                min="0"
                                                value={subUnitForm.floorArea}
                                                onChange={(e) =>
                                                    setSubUnitForm((cur) => ({ ...cur, floorArea: e.target.value }))
                                                }
                                                placeholder="450.0"
                                                className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary tabular-nums shadow-2xs"
                                            />
                                            <input
                                                type="text"
                                                value={subUnitForm.floorAreaUnit}
                                                onChange={(e) =>
                                                    setSubUnitForm((cur) => ({ ...cur, floorAreaUnit: e.target.value }))
                                                }
                                                placeholder="sqm"
                                                className="w-20 rounded-lg border border-outline-variant bg-white px-2 py-2 text-xs text-center text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary font-mono shadow-2xs"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Description / Operational Notes
                                    </label>
                                    <textarea
                                        value={subUnitForm.description}
                                        onChange={(e) =>
                                            setSubUnitForm((cur) => ({ ...cur, description: e.target.value }))
                                        }
                                        rows={3}
                                        placeholder="e.g. Primary high pressure steam boiler servicing manufacturing unit 1"
                                        className="w-full rounded-lg border border-outline-variant bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Footer for Form View */}
                        <div className="flex items-center justify-end gap-2.5 border-t border-outline-variant bg-surface px-6 py-3.5">
                            <Button
                                type="button"
                                variant="secondary"
                                size="md"
                                onClick={() => {
                                    setIsFormOpen(false);
                                    setEditingSubUnit(null);
                                }}
                                className="text-xs">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                form="sub-unit-form"
                                variant="primary"
                                size="md"
                                disabled={isSubmitting}
                                className="text-xs font-bold flex items-center gap-1.5 shadow-sm">
                                {isSubmitting ? (
                                    <>
                                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <MaterialIcon name="check" size="xs" />
                                        <span>{editingSubUnit ? "Update Sub-Unit" : "Create Sub-Unit"}</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Mode 2: Sub-Units List View */}
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-outline-variant bg-surface px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary shadow-xs">
                                    <MaterialIcon name="layers" size="sm" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-display text-lg font-semibold tracking-tight text-primary">
                                            {facility.name}
                                        </h3>
                                        <span className="px-2 py-0.5 rounded bg-surface-container-high text-[11px] font-medium text-slate-700 font-mono">
                                            {facility.facilityCode || "FAC"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-on-surface-variant font-sans mt-0.5">
                                        Operational Sub-Units &amp; Emissions Attribution Divisions
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleOpenCreateForm}
                                    className="bg-primary text-on-primary px-3.5 py-1.5 rounded-lg font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-90 shadow-sm transition-opacity">
                                    <MaterialIcon name="add" size="xs" />
                                    <span>Add Sub-Unit</span>
                                </button>
                                <button
                                    onClick={onClose}
                                    className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors">
                                    <MaterialIcon name="close" size="sm" />
                                </button>
                            </div>
                        </div>

                        {/* Search & Filters Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant bg-surface-container-low px-6 py-3">
                            <div className="flex items-center gap-2 flex-1 max-w-sm">
                                <div className="relative w-full">
                                    <MaterialIcon
                                        name="search"
                                        size="xs"
                                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search sub-unit name or code..."
                                        className="w-full rounded-lg border border-outline-variant bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-sans">
                                    <span>Status:</span>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="rounded-md border border-outline-variant bg-white px-2.5 py-1 text-xs text-slate-800 focus:outline-none shadow-2xs">
                                        <option value="all">All</option>
                                        <option value="active">Active Only</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="decommissioned">Decommissioned</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-sans">
                                    <span>Type:</span>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="rounded-md border border-outline-variant bg-white px-2.5 py-1 text-xs text-slate-800 focus:outline-none shadow-2xs">
                                        <option value="all">All Types</option>
                                        {subUnitTypeOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Sub-Units List / Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-3">
                            {subUnitsQuery.isLoading ? (
                                <div className="p-12 text-center text-xs text-on-surface-variant font-sans">
                                    Loading sub-units...
                                </div>
                            ) : subUnitsQuery.isError ? (
                                <div className="p-12 text-center text-xs text-error font-sans">
                                    Failed to load sub-units. Please try again.
                                </div>
                            ) : filteredSubUnits.length === 0 ? (
                                <div className="p-12 text-center rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest flex flex-col items-center">
                                    <MaterialIcon name="layers_clear" size="lg" className="text-slate-400 mb-2" />
                                    <h4 className="font-display text-sm font-semibold text-primary">No Sub-Units Found</h4>
                                    <p className="text-xs text-on-surface-variant font-sans mt-1 max-w-md">
                                        {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                                            ? "No sub-units matched the selected filter criteria."
                                            : "No operational sub-units created under this facility yet. Sub-units allow Scope 1 & Scope 2 activities to be attributed to specific production lines, boiler houses, or warehouse bays."}
                                    </p>
                                    <button
                                        onClick={handleOpenCreateForm}
                                        className="mt-4 bg-primary text-on-primary px-4 py-2 rounded-lg font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-90 shadow-sm transition-opacity">
                                        <MaterialIcon name="add" size="xs" />
                                        <span>Create First Sub-Unit</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    {filteredSubUnits.map((subUnit) => {
                                        const status = statusStyles[subUnit.status] || statusStyles.active;
                                        const typeObj = subUnitTypeOptions.find((t) => t.value === subUnit.subUnitType);

                                        return (
                                            <Card
                                                key={subUnit.id}
                                                className="p-4 bg-white border border-outline-variant rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow">
                                                <div>
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                                <MaterialIcon name={typeObj?.icon || "category"} size="xs" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-sm text-primary leading-tight">
                                                                    {subUnit.name}
                                                                </h4>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className="font-mono text-[10px] text-slate-500 font-semibold">
                                                                        {subUnit.subUnitCode}
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-400">•</span>
                                                                    <span className="text-[10px] text-slate-600 font-medium">
                                                                        {formatSubUnitTypeLabel(subUnit.subUnitType, subUnit.customSubUnitType)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <span
                                                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${status.bg}`}>
                                                            {status.label}
                                                        </span>
                                                    </div>

                                                    {subUnit.description && (
                                                        <p className="text-xs text-slate-600 font-sans line-clamp-2 my-2 bg-surface-container-lowest p-2 rounded-lg">
                                                            {subUnit.description}
                                                        </p>
                                                    )}

                                                    <div className="grid grid-cols-2 gap-2 text-xs font-sans text-slate-600 pt-2 border-t border-outline-variant/40">
                                                        {subUnit.floorArea != null && (
                                                            <div>
                                                                <span className="text-slate-400 block text-[10px]">Floor Area</span>
                                                                <span className="font-semibold text-slate-900 tabular-nums">
                                                                    {subUnit.floorArea.toLocaleString()} {subUnit.floorAreaUnit || "sqm"}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {subUnit.createdAt && (
                                                            <div>
                                                                <span className="text-slate-400 block text-[10px]">Created</span>
                                                                <span className="font-medium text-slate-700 text-[11px]">
                                                                    {format(new Date(subUnit.createdAt), "MMM d, yyyy")}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-outline-variant/40">
                                                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">
                                                        {subUnit.id}
                                                    </span>

                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            onClick={() => handleOpenEditForm(subUnit)}
                                                            className="p-1.5 rounded-lg border border-outline-variant text-slate-700 hover:bg-surface-container-high transition-colors text-xs flex items-center gap-1">
                                                            <MaterialIcon name="edit" size="xs" />
                                                            <span>Edit</span>
                                                        </button>

                                                        {subUnit.isActive && (
                                                            <button
                                                                onClick={() => setDeletingId(subUnit.id)}
                                                                className="p-1.5 rounded-lg border border-outline-variant text-rose-600 hover:bg-rose-50 transition-colors text-xs flex items-center gap-1">
                                                                <MaterialIcon name="power_settings_new" size="xs" />
                                                                <span>Deactivate</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Deactivate confirmation inside card */}
                                                {deletingId === subUnit.id && (
                                                    <div className="mt-3 p-3 bg-rose-50 rounded-lg border border-rose-200 text-xs text-rose-900 space-y-2 animate-fade-in">
                                                        <p className="font-semibold">
                                                            Deactivate sub-unit &quot;{subUnit.name}&quot;?
                                                        </p>
                                                        <p className="text-[11px] text-rose-700">
                                                            This soft-deactivates the sub-unit. Past activity records and historical linkages will remain intact for audit logs.
                                                        </p>
                                                        <div className="flex items-center gap-2 justify-end">
                                                            <button
                                                                onClick={() => setDeletingId(null)}
                                                                className="px-2.5 py-1 rounded bg-white text-slate-700 border border-slate-200 text-xs font-medium">
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteConfirm(subUnit.id)}
                                                                disabled={deleteMutation.isPending}
                                                                className="px-2.5 py-1 rounded bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors">
                                                                {deleteMutation.isPending ? "Deactivating..." : "Confirm Deactivate"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-outline-variant bg-surface px-6 py-3 text-xs text-on-surface-variant">
                            <span className="font-sans">
                                Showing {filteredSubUnits.length} of {subUnits.length} sub-units
                            </span>
                            <Button variant="secondary" size="sm" onClick={onClose}>
                                Close
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
