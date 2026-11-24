// components/lwg/LwgDepartmentsTable.tsx
"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { useDeleteLwgDepartment, useLwgDepartments } from "@/lib/lwg/hooks";
import {
    LWG_DEPARTMENT_STAGE_LABELS,
    type LwgDepartment,
    type LwgDepartmentStage,
} from "@/lib/lwg/types";
import { cn } from "@/lib/utils/cn";
import { LwgDepartmentModal } from "./LwgDepartmentModal";

export function LwgDepartmentsTable() {
    const [filterActiveOnly, setFilterActiveOnly] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<LwgDepartment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const { data: departments = [], isLoading, isError, error } = useLwgDepartments(false);
    const deleteMutation = useDeleteLwgDepartment();

    const filteredDepartments = filterActiveOnly
        ? departments.filter((d) => d.isActive)
        : departments;

    const handleOpenAdd = () => {
        setSelectedDepartment(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (dept: LwgDepartment) => {
        setSelectedDepartment(dept);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await deleteMutation.mutateAsync(id);
            setConfirmDeleteId(null);
        } catch (err) {
            console.error("Failed to delete department", err);
        } finally {
            setDeletingId(null);
        }
    };

    const getStageBadgeColor = (stage: LwgDepartmentStage) => {
        switch (stage) {
            case "stage_1":
                return "bg-sky-50 text-sky-700 border-sky-200";
            case "stage_2":
                return "bg-indigo-50 text-indigo-700 border-indigo-200";
            case "stage_3":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "common":
            default:
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader bordered tone="strip">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <MaterialIcon name="lan" size="sm" />
                        </div>
                        <div>
                            <h3 className="font-display text-sm font-bold tracking-tight text-primary">
                                Factory Departments & Metering Subunits
                            </h3>
                            <p className="font-sans text-xs text-on-surface-variant">
                                Sub-allocate energy, fuels, and water to physical production lines and effluent operations.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        {/* Active toggle filter */}
                        <div className="flex items-center rounded-lg border border-outline-variant bg-surface p-0.5 text-xs">
                            <button
                                type="button"
                                onClick={() => setFilterActiveOnly(false)}
                                className={cn(
                                    "px-2.5 py-1 rounded-md font-medium transition-colors",
                                    !filterActiveOnly
                                        ? "bg-surface-container-high text-primary shadow-2xs font-semibold"
                                        : "text-on-surface-variant hover:text-primary",
                                )}>
                                All ({departments.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterActiveOnly(true)}
                                className={cn(
                                    "px-2.5 py-1 rounded-md font-medium transition-colors",
                                    filterActiveOnly
                                        ? "bg-surface-container-high text-primary shadow-2xs font-semibold"
                                        : "text-on-surface-variant hover:text-primary",
                                )}>
                                Active ({departments.filter((d) => d.isActive).length})
                            </button>
                        </div>

                        {/* Add Button */}
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleOpenAdd}>
                            <MaterialIcon name="add" size="xs" />
                            <span>Add Department</span>
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardBody className="p-0">
                {/* Error Banner */}
                {isError && (
                    <div className="m-4 flex items-start gap-2 rounded-xl border border-error/30 bg-error/5 p-3 text-xs text-error">
                        <MaterialIcon name="error" size="xs" className="mt-0.5 shrink-0" />
                        <span>Failed to load departments: {error?.message}</span>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-outline-variant/60 bg-surface-container-low text-on-surface-variant font-semibold">
                                <th className="py-3 px-4">Department Name</th>
                                <th className="py-3 px-4">Stage Allocation</th>
                                <th className="py-3 px-4">Description / Scope</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/40">
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, idx) => (
                                    <tr key={idx} className="animate-pulse">
                                        <td className="py-4 px-4">
                                            <div className="h-4 w-32 rounded bg-surface-container-high" />
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="h-4 w-28 rounded bg-surface-container-high" />
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="h-4 w-44 rounded bg-surface-container-high" />
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="h-4 w-14 rounded bg-surface-container-high" />
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="h-4 w-12 rounded bg-surface-container-high ml-auto" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredDepartments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <MaterialIcon
                                                name="meeting_room"
                                                size="lg"
                                                className="text-on-surface-variant/40"
                                            />
                                            <p className="font-semibold text-primary">No departments found</p>
                                            <p className="text-xs text-on-surface-variant max-w-sm">
                                                {filterActiveOnly
                                                    ? "There are no active departments matching the filter."
                                                    : "Default factory departments will be auto-seeded or you can manually create your tannery subunits now."}
                                            </p>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={handleOpenAdd}
                                                className="mt-2">
                                                <MaterialIcon name="add" size="xs" />
                                                Create First Department
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredDepartments.map((dept) => (
                                    <tr
                                        key={dept.id}
                                        className="hover:bg-surface-container-lowest/60 transition-colors">
                                        <td className="py-3.5 px-4 font-semibold text-primary">
                                            {dept.name}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span
                                                className={cn(
                                                    "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium border",
                                                    getStageBadgeColor(dept.stage),
                                                )}>
                                                {LWG_DEPARTMENT_STAGE_LABELS[dept.stage] || dept.stage}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-on-surface-variant max-w-xs truncate">
                                            {dept.description || "—"}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <Badge
                                                variant={dept.isActive ? "positive" : "neutral"}
                                                size="sm">
                                                {dept.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            {confirmDeleteId === dept.id ? (
                                                <div className="flex items-center justify-end gap-1.5 animate-fade-in">
                                                    <span className="text-[11px] text-error font-medium">Delete?</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(dept.id)}
                                                        disabled={deletingId === dept.id}
                                                        className="rounded px-2 py-1 text-[11px] font-bold bg-error text-white hover:bg-error/90 transition-colors">
                                                        {deletingId === dept.id ? "..." : "Yes"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmDeleteId(null)}
                                                        className="rounded px-2 py-1 text-[11px] font-medium bg-surface-container-high text-primary hover:bg-surface-container-highest transition-colors">
                                                        No
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEdit(dept)}
                                                        className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors"
                                                        title="Edit department">
                                                        <MaterialIcon name="edit" size="xs" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmDeleteId(dept.id)}
                                                        className="rounded-lg p-1.5 text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors"
                                                        title="Delete department">
                                                        <MaterialIcon name="delete" size="xs" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardBody>

            {/* Department Modal */}
            <LwgDepartmentModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedDepartment(null);
                }}
                department={selectedDepartment}
            />
        </Card>
    );
}
