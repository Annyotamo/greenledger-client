// components/lwg/evidence/LwgEvidenceSectionSidebar.tsx
"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { LWG_ALL_SECTIONS, type LwgEvidence } from "@/lib/lwg/types";
import { getExpiryStatus } from "@/lib/lwg/utils";
import { cn } from "@/lib/utils/cn";

interface LwgEvidenceSectionSidebarProps {
    selectedSection: number | null;
    onSelectSection: (sectionNumber: number | null) => void;
    evidenceList: LwgEvidence[];
}

export function LwgEvidenceSectionSidebar({
    selectedSection,
    onSelectSection,
    evidenceList,
}: LwgEvidenceSectionSidebarProps) {
    // Compute file counts and warning statuses per section
    const sectionCounts = new Map<number, number>();
    const sectionAlerts = new Map<number, "red" | "amber">();

    evidenceList.forEach((ev) => {
        const count = sectionCounts.get(ev.lwgSection) || 0;
        sectionCounts.set(ev.lwgSection, count + 1);

        if (ev.expiryDate) {
            const exp = getExpiryStatus(ev.expiryDate);
            if (exp.status === "expired") {
                sectionAlerts.set(ev.lwgSection, "red");
            } else if (exp.status === "warning" && sectionAlerts.get(ev.lwgSection) !== "red") {
                sectionAlerts.set(ev.lwgSection, "amber");
            }
        }
    });

    return (
        <div className="space-y-1.5">
            {/* Header: All Sections Button */}
            <button
                type="button"
                onClick={() => onSelectSection(null)}
                className={cn(
                    "w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all select-none text-left",
                    selectedSection === null
                        ? "bg-primary text-white shadow-xs"
                        : "bg-surface hover:bg-surface-container-high text-primary border border-outline-variant/60",
                )}>
                <div className="flex items-center gap-2">
                    <MaterialIcon name="folder_shared" size="xs" />
                    <span>All Evidence Documents</span>
                </div>
                <span
                    className={cn(
                        "rounded-full px-2 py-0.5 font-mono text-[10px] font-bold",
                        selectedSection === null
                            ? "bg-white/20 text-white"
                            : "bg-surface-container-high text-on-surface-variant",
                    )}>
                    {evidenceList.length}
                </span>
            </button>

            {/* List of 17 Sections */}
            <div className="space-y-1 max-h-[640px] overflow-y-auto pr-1">
                {LWG_ALL_SECTIONS.map((sec) => {
                    const isSelected = selectedSection === sec.sectionNumber;
                    const count = sectionCounts.get(sec.sectionNumber) || 0;
                    const alert = sectionAlerts.get(sec.sectionNumber);

                    return (
                        <button
                            key={sec.sectionNumber}
                            type="button"
                            onClick={() => onSelectSection(sec.sectionNumber)}
                            className={cn(
                                "group w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-all select-none text-left border",
                                isSelected
                                    ? "bg-emerald-50 text-emerald-900 border-emerald-500 font-bold shadow-2xs"
                                    : "bg-surface hover:bg-surface-container-low text-primary border-outline-variant/40 font-medium",
                            )}>
                            <div className="flex items-center gap-2 min-w-0 pr-2">
                                <span className="font-mono text-[11px] font-bold text-on-surface-variant shrink-0">
                                    #{sec.sectionNumber}
                                </span>
                                <span className="truncate text-xs">{sec.title}</span>
                                {sec.isCritical && (
                                    <span title="Critical Section for Medal">
                                        <MaterialIcon
                                            name="shield"
                                            size="xs"
                                            className="text-amber-600 shrink-0"
                                        />
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                                {alert && (
                                    <span
                                        title={alert === "red" ? "Expired Document" : "Expiring Soon (<60d)"}
                                        className={cn(
                                            "h-2 w-2 rounded-full",
                                            alert === "red" ? "bg-rose-500 animate-pulse" : "bg-amber-500",
                                        )}
                                    />
                                )}
                                <span
                                    className={cn(
                                        "rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold",
                                        isSelected
                                            ? "bg-emerald-200/60 text-emerald-900"
                                            : count > 0
                                            ? "bg-surface-container-high text-primary"
                                            : "text-on-surface-variant/40",
                                    )}>
                                    {count}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
