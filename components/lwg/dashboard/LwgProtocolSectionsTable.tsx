// components/lwg/dashboard/LwgProtocolSectionsTable.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { LWG_ALL_SECTIONS, type LwgSectionStatus, type LwgSectionStatusItem } from "@/lib/lwg/types";
import { cn } from "@/lib/utils/cn";

interface LwgProtocolSectionsTableProps {
    sectionStatuses: LwgSectionStatusItem[];
}

export function LwgProtocolSectionsTable({
    sectionStatuses,
}: LwgProtocolSectionsTableProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [filter, setFilter] = useState<"all" | "critical" | "mvp">("all");

    // Map sectionStatuses by sectionNumber for fast lookup
    const statusMap = new Map<number, LwgSectionStatusItem>();
    sectionStatuses.forEach((s) => statusMap.set(s.sectionNumber, s));

    // Combine static LWG_ALL_SECTIONS with dynamic status from backend
    const combinedSections = LWG_ALL_SECTIONS.map((sec) => {
        const dynamicStatus = statusMap.get(sec.sectionNumber);
        return {
            sectionNumber: sec.sectionNumber,
            title: sec.title,
            description: sec.description,
            isCritical: sec.isCritical,
            isInMvp: sec.isInMvp,
            status: (dynamicStatus?.status ?? (sec.isInMvp ? "not_started" : "not_in_mvp")) as LwgSectionStatus,
        };
    });

    const filteredSections = combinedSections.filter((s) => {
        if (filter === "critical") return s.isCritical;
        if (filter === "mvp") return s.isInMvp;
        return true;
    });

    const getStatusBadge = (status: LwgSectionStatus) => {
        switch (status) {
            case "ready":
                return (
                    <Badge variant="positive" size="sm" className="gap-1">
                        <MaterialIcon name="check_circle" size="xs" />
                        <span>Ready</span>
                    </Badge>
                );
            case "gaps":
                return (
                    <Badge variant="negative" size="sm" className="gap-1">
                        <MaterialIcon name="warning" size="xs" />
                        <span>Action Required</span>
                    </Badge>
                );
            case "not_started":
                return (
                    <Badge variant="active" size="sm" className="gap-1">
                        <MaterialIcon name="pending" size="xs" />
                        <span>Not Started</span>
                    </Badge>
                );
            case "not_in_mvp":
            default:
                return (
                    <span className="inline-flex items-center rounded-md bg-surface-container-high px-2 py-0.5 text-[10px] font-mono font-medium text-on-surface-variant">
                        Protocol Issue 7
                    </span>
                );
        }
    };

    const getSectionActionUrl = (secNum: number) => {
        switch (secNum) {
            case 4:
                return "/lwg/evidence?section=4";
            case 5:
                return "/lwg/production";
            case 10:
                return "/lwg/energy";
            case 11:
                return "/lwg/water";
            default:
                return `/lwg/evidence?section=${secNum}`;
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader bordered tone="strip">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <MaterialIcon name="rule" size="xs" />
                        </div>
                        <div>
                            <h3 className="font-display text-sm font-bold tracking-tight text-primary">
                                All 17 LWG Protocol Sections Status
                            </h3>
                            <p className="font-sans text-[11px] text-on-surface-variant">
                                Compliance coverage per LWG Environmental Audit Protocol Issue 7.x
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        {/* Filter Tabs */}
                        <div className="flex items-center rounded-lg border border-outline-variant bg-surface p-0.5 text-xs">
                            <button
                                type="button"
                                onClick={() => setFilter("all")}
                                className={cn(
                                    "px-2.5 py-1 rounded-md font-medium transition-colors",
                                    filter === "all"
                                        ? "bg-surface-container-high text-primary shadow-2xs font-semibold"
                                        : "text-on-surface-variant hover:text-primary",
                                )}>
                                All (17)
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilter("critical")}
                                className={cn(
                                    "px-2.5 py-1 rounded-md font-medium transition-colors",
                                    filter === "critical"
                                        ? "bg-surface-container-high text-primary shadow-2xs font-semibold"
                                        : "text-on-surface-variant hover:text-primary",
                                )}>
                                Critical (13)
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilter("mvp")}
                                className={cn(
                                    "px-2.5 py-1 rounded-md font-medium transition-colors",
                                    filter === "mvp"
                                        ? "bg-surface-container-high text-primary shadow-2xs font-semibold"
                                        : "text-on-surface-variant hover:text-primary",
                                )}>
                                MVP Active (4)
                            </button>
                        </div>

                        {/* Collapse toggle */}
                        <button
                            type="button"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-high transition-colors"
                            aria-label={isCollapsed ? "Expand section" : "Collapse section"}>
                            <MaterialIcon
                                name={isCollapsed ? "expand_more" : "expand_less"}
                                size="sm"
                            />
                        </button>
                    </div>
                </div>
            </CardHeader>

            {!isCollapsed && (
                <CardBody className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-outline-variant/60 bg-surface-container-low text-on-surface-variant font-semibold">
                                    <th className="py-2.5 px-4 w-16">Sec #</th>
                                    <th className="py-2.5 px-4">Protocol Section Title & Scope</th>
                                    <th className="py-2.5 px-4">Classification</th>
                                    <th className="py-2.5 px-4">MVP Scope</th>
                                    <th className="py-2.5 px-4">Audit Status</th>
                                    <th className="py-2.5 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/40">
                                {filteredSections.map((sec) => (
                                    <tr
                                        key={sec.sectionNumber}
                                        className="hover:bg-surface-container-lowest/70 transition-colors">
                                        <td className="py-3 px-4 font-mono font-bold text-primary">
                                            #{sec.sectionNumber}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-semibold text-primary">{sec.title}</p>
                                                <p className="font-sans text-[11px] text-on-surface-variant max-w-lg mt-0.5">
                                                    {sec.description}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            {sec.isCritical ? (
                                                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                                    <MaterialIcon name="shield" size="xs" className="text-amber-600" />
                                                    Critical
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-md bg-surface-container-high px-2 py-0.5 text-[10px] font-mono text-on-surface-variant">
                                                    Non-Critical
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            {sec.isInMvp ? (
                                                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 text-xs">
                                                    <MaterialIcon name="check" size="xs" />
                                                    Active MVP
                                                </span>
                                            ) : (
                                                <span className="text-on-surface-variant/70 text-[11px]">
                                                    Full Audit
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">{getStatusBadge(sec.status)}</td>
                                        <td className="py-3 px-4 text-right">
                                            <Link
                                                href={getSectionActionUrl(sec.sectionNumber)}
                                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline">
                                                <span>View</span>
                                                <MaterialIcon name="arrow_forward" size="xs" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            )}
        </Card>
    );
}
