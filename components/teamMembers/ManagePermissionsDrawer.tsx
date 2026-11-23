"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { ALL_FEATURES, FEATURE_CATEGORIES, ROLE_DEFAULT_PERMISSIONS } from "@/lib/rbac/constants";
import type { AccessLevel, FeatureKey, UserRole } from "@/lib/rbac/types";
import { useUpdateUserPermissions, useUserPermissions } from "@/lib/teamMembers/hooks";
import type { TeamMember } from "@/lib/teamMembers/types";

interface ManagePermissionsDrawerProps {
    member: TeamMember | null;
    isOpen: boolean;
    onClose: () => void;
}

const ACCESS_LEVELS: AccessLevel[] = ["none", "read", "write", "admin"];

const CATEGORY_CONFIG: Record<string, { icon: string; iconColor: string; iconBg: string }> = {
    ghg_protocol: {
        icon: "energy_savings_leaf",
        iconColor: "text-emerald-700",
        iconBg: "bg-emerald-50 border-emerald-200/60",
    },
    disclosures: {
        icon: "verified",
        iconColor: "text-blue-700",
        iconBg: "bg-blue-50 border-blue-200/60",
    },
    infrastructure: {
        icon: "domain",
        iconColor: "text-amber-700",
        iconBg: "bg-amber-50 border-amber-200/60",
    },
    analytics: {
        icon: "analytics",
        iconColor: "text-indigo-700",
        iconBg: "bg-indigo-50 border-indigo-200/60",
    },
    governance: {
        icon: "admin_panel_settings",
        iconColor: "text-purple-700",
        iconBg: "bg-purple-50 border-purple-200/60",
    },
};

const LEVEL_STYLES: Record<AccessLevel, { active: string; label: string }> = {
    none: { active: "bg-slate-700 text-white shadow-xs", label: "None" },
    read: { active: "bg-blue-600 text-white shadow-xs", label: "Read" },
    write: { active: "bg-emerald-600 text-white shadow-xs", label: "Write" },
    admin: { active: "bg-purple-700 text-white shadow-xs", label: "Admin" },
};

function emptySubscribe() {
    return () => {};
}

export function ManagePermissionsDrawer({
    member,
    isOpen,
    onClose,
}: ManagePermissionsDrawerProps) {
    const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

    // Prevent background scrolling while open
    useEffect(() => {
        if (!isOpen) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    // Keyboard ESC listener
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !member || !isMounted) return null;

    return createPortal(
        <ManagePermissionsDrawerContent
            key={member.id}
            member={member}
            onClose={onClose}
        />,
        document.body,
    );
}

function ManagePermissionsDrawerContent({
    member,
    onClose,
}: {
    member: TeamMember;
    onClose: () => void;
}) {
    const { data: permissionsData, isLoading: isLoadingPermissions } = useUserPermissions(member.id);
    const updateMutation = useUpdateUserPermissions();

    const [userModifiedOverrides, setUserModifiedOverrides] = useState<Record<string, AccessLevel> | null>(null);
    const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
    const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

    const userRole: UserRole = member.role || "CUSTOM";
    const defaultRoleMatrix = ROLE_DEFAULT_PERMISSIONS[userRole] || ROLE_DEFAULT_PERMISSIONS.CUSTOM;

    const overrides = userModifiedOverrides ?? permissionsData?.custom_permissions ?? member.customPermissions ?? {};
    const isSuperuser = userRole === "TENANT_OWNER" || userRole === "TENANT_ADMIN";

    const handleSelectLevel = (featureKey: FeatureKey, level: AccessLevel) => {
        if (isSuperuser) return;
        const defaultLevel = defaultRoleMatrix[featureKey] || "none";

        const next = { ...overrides };
        if (level === defaultLevel) {
            delete next[featureKey];
        } else {
            next[featureKey] = level;
        }
        setUserModifiedOverrides(next);
    };

    const handleResetAllToDefaults = () => {
        if (isSuperuser) return;
        setUserModifiedOverrides({});
    };

    const handleSave = async () => {
        setSaveSuccessMsg(null);
        setSaveErrorMsg(null);
        try {
            await updateMutation.mutateAsync({
                userId: member.id,
                customPermissions: overrides,
            });
            setSaveSuccessMsg("Permissions successfully updated.");
            setTimeout(() => {
                setSaveSuccessMsg(null);
                onClose();
            }, 1000);
        } catch (err: unknown) {
            setSaveErrorMsg(err instanceof Error ? err.message : "Failed to update permissions.");
        }
    };

    const overrideCount = Object.keys(overrides).length;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
            {/* Click backdrop to dismiss */}
            <div className="flex-1 cursor-pointer" onClick={onClose} aria-hidden="true" />

            {/* Slide-over panel */}
            <div
                className="relative flex h-screen w-full max-w-2xl flex-col bg-white shadow-2xl border-l border-slate-200 font-sans animate-in slide-in-from-right duration-250 ease-out z-[101]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="drawer-title">
                {/* 1. Header */}
                <div className="shrink-0 border-b border-slate-200 bg-white">
                    <div className="flex items-start justify-between p-6 pb-4">
                        <div className="flex items-center gap-3.5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-2xs">
                                <MaterialIcon name="admin_panel_settings" size="sm" />
                            </div>
                            <div>
                                <h2 id="drawer-title" className="font-display text-lg font-bold text-slate-900 tracking-tight">
                                    Manage Permissions
                                </h2>
                                <p className="font-sans text-xs text-slate-500 mt-0.5">
                                    <span className="font-semibold text-slate-700">{member.fullName}</span>
                                    <span className="mx-1.5 text-slate-300">•</span>
                                    <span className="font-mono text-slate-500">{member.email}</span>
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            aria-label="Close dialog">
                            <MaterialIcon name="close" size="sm" />
                        </button>
                    </div>

                    {/* Role & Override Status Pills */}
                    <div className="flex flex-wrap items-center justify-between gap-3 px-6 pb-4 pt-1 border-t border-slate-100">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-800">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                                {userRole}
                            </span>

                            {isSuperuser ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-purple-200/80 bg-purple-50 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-purple-700">
                                    Full Superuser
                                </span>
                            ) : overrideCount > 0 ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-amber-800">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                    {overrideCount} Custom Override{overrideCount > 1 ? "s" : ""}
                                </span>
                            ) : (
                                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-slate-600">
                                    Default Role Matrix
                                </span>
                            )}
                        </div>

                        {!isSuperuser && (
                            <button
                                type="button"
                                onClick={handleResetAllToDefaults}
                                disabled={overrideCount === 0 || updateMutation.isPending}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                                <MaterialIcon name="restart_alt" size="xs" />
                                Reset to Defaults
                            </button>
                        )}
                    </div>

                    {/* Policy Banner */}
                    <div className="flex items-center gap-2 bg-slate-50 px-6 py-2 border-t border-slate-200/70 text-[11px] text-slate-500 font-sans">
                        <MaterialIcon name="info" size="xs" className="text-slate-400 shrink-0" />
                        <span>
                            {isSuperuser
                                ? "Tenant Owners and Admins have unrestricted administrative access across all system features."
                                : "Custom overrides take precedence over the role baseline. Setting a level back to the role default clears the override."}
                        </span>
                    </div>
                </div>

                {/* 2. Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-7 bg-slate-50/50 gl-dashboard-scroll">
                    {isLoadingPermissions ? (
                        <div className="flex h-56 flex-col items-center justify-center gap-3">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                            <p className="font-mono text-xs uppercase tracking-wider text-slate-500">
                                Loading permissions matrix...
                            </p>
                        </div>
                    ) : (
                        FEATURE_CATEGORIES.map((category) => {
                            const features = ALL_FEATURES.filter((f) => f.category === category.id);
                            if (features.length === 0) return null;
                            const config = CATEGORY_CONFIG[category.id] || {
                                icon: "category",
                                iconColor: "text-slate-700",
                                iconBg: "bg-slate-100 border-slate-200",
                            };

                            return (
                                <section key={category.id} className="space-y-3">
                                    {/* Category Header */}
                                    <div className="flex items-center justify-between pb-1">
                                        <div className="flex items-center gap-2">
                                            <div className={`flex h-6 w-6 items-center justify-center rounded-md border ${config.iconBg} ${config.iconColor}`}>
                                                <MaterialIcon name={config.icon} size="xs" />
                                            </div>
                                            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-800">
                                                {category.title}
                                            </h3>
                                        </div>
                                        <span className="rounded-full bg-slate-200/70 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-600">
                                            {features.length} features
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 pl-8 -mt-2">
                                        {category.description}
                                    </p>

                                    {/* Features Card List */}
                                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs divide-y divide-slate-100">
                                        {features.map((feature) => {
                                            const roleDefault = defaultRoleMatrix[feature.key] || "none";
                                            const currentEffective = isSuperuser
                                                ? "admin"
                                                : overrides[feature.key] || roleDefault;
                                            const isOverride = !isSuperuser && overrides[feature.key] !== undefined && overrides[feature.key] !== roleDefault;

                                            return (
                                                <div
                                                    key={feature.key}
                                                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-slate-50/60">
                                                    {/* Feature Details */}
                                                    <div className="space-y-0.5 pr-2">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-sans text-xs font-semibold text-slate-900">
                                                                {feature.label}
                                                            </span>
                                                            {isOverride ? (
                                                                <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-amber-800 border border-amber-500/30 font-mono">
                                                                    Custom
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] text-slate-400 font-mono">
                                                                    (Default: {roleDefault})
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] text-slate-500 line-clamp-1">
                                                            {feature.description}
                                                        </p>
                                                    </div>

                                                    {/* Segmented Level Selector */}
                                                    <div className="inline-flex shrink-0 items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 shadow-2xs self-start sm:self-center">
                                                        {ACCESS_LEVELS.map((lvl) => {
                                                            const isSelected = currentEffective === lvl;
                                                            const style = LEVEL_STYLES[lvl];
                                                            return (
                                                                <button
                                                                    key={lvl}
                                                                    type="button"
                                                                    disabled={isSuperuser || updateMutation.isPending}
                                                                    onClick={() => handleSelectLevel(feature.key, lvl)}
                                                                    className={`rounded-md px-2.5 py-1 font-sans text-[11px] font-semibold transition-all cursor-pointer ${
                                                                        isSelected
                                                                            ? style.active
                                                                            : "text-slate-500 hover:text-slate-900 hover:bg-white/60"
                                                                    } ${isSuperuser ? "cursor-not-allowed opacity-90" : ""}`}>
                                                                    {style.label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            );
                        })
                    )}
                </div>

                {/* 3. Sticky Footer */}
                <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-4 shadow-lg">
                    {saveSuccessMsg && (
                        <div className="mb-3 flex items-center justify-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-2 text-xs font-semibold text-emerald-800 animate-in fade-in duration-150">
                            <MaterialIcon name="check_circle" size="xs" className="text-emerald-600" />
                            <span>{saveSuccessMsg}</span>
                        </div>
                    )}
                    {saveErrorMsg && (
                        <div className="mb-3 flex items-center justify-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-2 text-xs font-semibold text-rose-800 animate-in fade-in duration-150">
                            <MaterialIcon name="error" size="xs" className="text-rose-600" />
                            <span>{saveErrorMsg}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-sans">
                            {isSuperuser
                                ? "Permissions locked for Superusers"
                                : `${overrideCount} custom override${overrideCount === 1 ? "" : "s"} configured`}
                        </span>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={updateMutation.isPending}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSuperuser || updateMutation.isPending}
                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white px-5 py-2 text-xs font-semibold shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer">
                                {updateMutation.isPending ? (
                                    <>
                                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        <span>Saving Changes...</span>
                                    </>
                                ) : (
                                    <>
                                        <MaterialIcon name="check" size="xs" />
                                        <span>Save Permissions</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
