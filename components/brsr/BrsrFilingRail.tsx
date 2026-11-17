"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { cn } from "@/lib/utils/cn";

export type BrsrSectionKey =
    | "overview"
    // Section A
    | "section-a-entity"
    | "section-a-employees"
    | "section-a-csr"
    // Section B
    | "section-b-policy"
    | "section-b-governance"
    // Section C - Env (Principle 6)
    | "env-energy"
    | "env-water"
    | "env-air"
    | "env-ghg"
    | "env-waste"
    | "env-ecology"
    // Section C - SG (Principles 1-5, 7-9)
    | "sg-p1"
    | "sg-p2"
    | "sg-p3"
    | "sg-p4"
    | "sg-p5"
    | "sg-p7"
    | "sg-p8"
    | "sg-p9"
    // Review & Export
    | "review-export";

interface RailCategory {
    id: string;
    label: string;
    icon: string;
    badge?: string;
    subItems: {
        key: BrsrSectionKey;
        label: string;
        icon: string;
        tag?: string;
        isCompleted?: boolean;
    }[];
}

interface BrsrFilingRailProps {
    activeSection: BrsrSectionKey;
    onSelectSection: (key: BrsrSectionKey) => void;
    completedMap?: Partial<Record<BrsrSectionKey, boolean>>;
}

export function BrsrFilingRail({
    activeSection,
    onSelectSection,
    completedMap = {},
}: BrsrFilingRailProps) {
    const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({
        // keep open by default
    });

    const toggleCategory = (catId: string) => {
        setCollapsedCategories((prev) => ({
            ...prev,
            [catId]: !prev[catId],
        }));
    };

    const categories: RailCategory[] = [
        {
            id: "section-a",
            label: "Section A: General Disclosures",
            icon: "apartment",
            badge: "pp. 1–14",
            subItems: [
                {
                    key: "section-a-entity",
                    label: "Entity Details & Operations",
                    icon: "business",
                    tag: "Mandatory",
                    isCompleted: completedMap["section-a-entity"],
                },
                {
                    key: "section-a-employees",
                    label: "Employees, Workers & Diversity",
                    icon: "groups",
                    tag: "Gender Ratios",
                    isCompleted: completedMap["section-a-employees"],
                },
                {
                    key: "section-a-csr",
                    label: "CSR & Stakeholder Grievances",
                    icon: "volunteer_activism",
                    tag: "Complaints",
                    isCompleted: completedMap["section-a-csr"],
                },
            ],
        },
        {
            id: "section-b",
            label: "Section B: Management & Process",
            icon: "rule",
            badge: "pp. 15–18",
            subItems: [
                {
                    key: "section-b-policy",
                    label: "NGRBC Principles 1–9 Policy Matrix",
                    icon: "table_chart",
                    tag: "P1 to P9",
                    isCompleted: completedMap["section-b-policy"],
                },
                {
                    key: "section-b-governance",
                    label: "Governance, Oversight & Review",
                    icon: "account_balance",
                    tag: "Leadership",
                    isCompleted: completedMap["section-b-governance"],
                },
            ],
        },
        {
            id: "section-c-env",
            label: "Section C: Environmental (Principle 6)",
            icon: "eco",
            badge: "pp. 19–30",
            subItems: [
                {
                    key: "env-energy",
                    label: "Energy Consumption & Intensity",
                    icon: "bolt",
                    tag: "Essential 1 & 2",
                    isCompleted: completedMap["env-energy"],
                },
                {
                    key: "env-water",
                    label: "Water Disclosures & ZLD",
                    icon: "water_drop",
                    tag: "Essential 3, 4, 5",
                    isCompleted: completedMap["env-water"],
                },
                {
                    key: "env-air",
                    label: "Air Stack Emissions",
                    icon: "air",
                    tag: "Essential 6",
                    isCompleted: completedMap["env-air"],
                },
                {
                    key: "env-ghg",
                    label: "GHG Scope 1 & 2 Disclosures",
                    icon: "cloud_sync",
                    tag: "Essential 7 & 8",
                    isCompleted: completedMap["env-ghg"],
                },
                {
                    key: "env-waste",
                    label: "Waste Management & Recovery",
                    icon: "recycling",
                    tag: "Essential 9 & 10",
                    isCompleted: completedMap["env-waste"],
                },
                {
                    key: "env-ecology",
                    label: "Sensitive Ecology & EIA Projects",
                    icon: "forest",
                    tag: "Essential 11-13",
                    isCompleted: completedMap["env-ecology"],
                },
            ],
        },
        {
            id: "section-c-sg",
            label: "Section C: Social & Governance",
            icon: "balance",
            badge: "pp. 31–41",
            subItems: [
                {
                    key: "sg-p1",
                    label: "P1: Ethics, Bribery & Fines",
                    icon: "gavel",
                    tag: "Integrity",
                    isCompleted: completedMap["sg-p1"],
                },
                {
                    key: "sg-p2",
                    label: "P2: Sustainable Products & LCA",
                    icon: "precision_manufacturing",
                    tag: "EPR & LCA",
                    isCompleted: completedMap["sg-p2"],
                },
                {
                    key: "sg-p3",
                    label: "P3: Employee Well-being & Safety",
                    icon: "health_and_safety",
                    tag: "LTIFR",
                    isCompleted: completedMap["sg-p3"],
                },
                {
                    key: "sg-p4",
                    label: "P4: Stakeholder Engagement",
                    icon: "record_voice_over",
                    tag: "Consultation",
                    isCompleted: completedMap["sg-p4"],
                },
                {
                    key: "sg-p5",
                    label: "P5: Human Rights",
                    icon: "diversity_3",
                    tag: "Non-discrim.",
                    isCompleted: completedMap["sg-p5"],
                },
                {
                    key: "sg-p7",
                    label: "P7: Public Policy & Advocacy",
                    icon: "campaign",
                    tag: "Advocacy",
                    isCompleted: completedMap["sg-p7"],
                },
                {
                    key: "sg-p8",
                    label: "P8: Inclusive Growth & Social Impact",
                    icon: "handshake",
                    tag: "MSME & Local",
                    isCompleted: completedMap["sg-p8"],
                },
                {
                    key: "sg-p9",
                    label: "P9: Consumer Value & Privacy",
                    icon: "security",
                    tag: "Cybersecurity",
                    isCompleted: completedMap["sg-p9"],
                },
            ],
        },
    ];

    return (
        <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-3">
            {/* Top Primary Filing Overview Button */}
            <button
                type="button"
                onClick={() => onSelectSection("overview")}
                className={cn(
                    "flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all cursor-pointer shadow-2xs",
                    activeSection === "overview"
                        ? "border-primary bg-primary text-white ring-2 ring-primary/20 shadow-xs"
                        : "border-outline-variant bg-white text-on-surface hover:bg-surface-container-low hover:border-primary/40",
                )}>
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                            activeSection === "overview"
                                ? "bg-white/20 text-white"
                                : "bg-primary/10 text-primary",
                        )}>
                        <MaterialIcon name="dashboard" size="sm" />
                    </div>
                    <div>
                        <p className={cn("text-xs font-bold font-sans", activeSection === "overview" ? "text-white" : "text-primary")}>
                            Filing Overview / Dashboard
                        </p>
                        <p
                            className={cn(
                                "text-[11px]",
                                activeSection === "overview" ? "text-white/80" : "text-on-surface-variant",
                            )}>
                            Statutory readiness &amp; summary
                        </p>
                    </div>
                </div>
                <MaterialIcon
                    name="chevron_right"
                    size="sm"
                    className={activeSection === "overview" ? "text-white" : "text-on-surface-variant"}
                />
            </button>

            {/* Statutory Sections List */}
            <div className="space-y-3 rounded-xl border border-outline-variant bg-white p-2.5 shadow-2xs">
                <div className="px-2 pt-1 pb-1">
                    <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                        Statutory Filing Rail
                    </p>
                </div>

                <div className="space-y-2">
                    {categories.map((cat) => {
                        const isCollapsed = collapsedCategories[cat.id];
                        const hasActiveChild = cat.subItems.some((s) => s.key === activeSection);

                        return (
                            <div key={cat.id} className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => toggleCategory(cat.id)}
                                    className={cn(
                                        "flex w-full items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer",
                                        hasActiveChild
                                            ? "bg-secondary-container/40 text-primary font-semibold"
                                            : "hover:bg-surface-container-low text-on-surface",
                                    )}>
                                    <div className="flex items-center gap-2 min-w-0">
                                        <MaterialIcon
                                            name={cat.icon}
                                            size="xs"
                                            className={hasActiveChild ? "text-primary" : "text-on-surface-variant"}
                                        />
                                        <span className="truncate font-sans text-xs font-semibold">
                                            {cat.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {cat.badge && (
                                            <span className="font-mono text-[9px] font-medium text-on-surface-variant/70 bg-surface-container px-1.5 py-0.5 rounded">
                                                {cat.badge}
                                            </span>
                                        )}
                                        <MaterialIcon
                                            name={isCollapsed ? "keyboard_arrow_right" : "keyboard_arrow_down"}
                                            size="xs"
                                            className="text-on-surface-variant/70 text-[16px]"
                                        />
                                    </div>
                                </button>

                                {!isCollapsed && (
                                    <div className="space-y-0.5 p-1.5 border-t border-outline-variant/40 bg-surface-container-lowest">
                                        {cat.subItems.map((item) => {
                                            const isActive = activeSection === item.key;
                                            return (
                                                <button
                                                    key={item.key}
                                                    type="button"
                                                    onClick={() => onSelectSection(item.key)}
                                                    className={cn(
                                                        "group flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left transition-all cursor-pointer text-[11.5px]",
                                                        isActive
                                                            ? "bg-primary text-white font-semibold shadow-2xs"
                                                            : "text-on-surface hover:bg-surface-container-low hover:text-primary",
                                                    )}>
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <MaterialIcon
                                                            name={item.icon}
                                                            size="xs"
                                                            className={cn(
                                                                "text-[14px] shrink-0",
                                                                isActive
                                                                    ? "text-white"
                                                                    : "text-on-surface-variant group-hover:text-primary",
                                                            )}
                                                        />
                                                        <span className="truncate">{item.label}</span>
                                                    </div>

                                                    <div className="flex items-center gap-1 shrink-0 ml-1">
                                                        {item.isCompleted ? (
                                                            <MaterialIcon
                                                                name="check_circle"
                                                                size="xs"
                                                                className={cn("text-[13px]", isActive ? "text-white" : "text-emerald-600")}
                                                            />
                                                        ) : item.tag ? (
                                                            <span
                                                                className={cn(
                                                                    "font-mono text-[9px] px-1 rounded",
                                                                    isActive
                                                                        ? "bg-white/20 text-white"
                                                                        : "bg-surface-container text-on-surface-variant",
                                                                )}>
                                                                {item.tag}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Review & Export Master PDF Button */}
            <button
                type="button"
                onClick={() => onSelectSection("review-export")}
                className={cn(
                    "flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all cursor-pointer shadow-2xs",
                    activeSection === "review-export"
                        ? "border-emerald-600 bg-emerald-700 text-white ring-2 ring-emerald-500/20 shadow-xs"
                        : "border-outline-variant bg-white text-on-surface hover:bg-surface-container-low hover:border-emerald-600/40",
                )}>
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                            activeSection === "review-export"
                                ? "bg-white/20 text-white"
                                : "bg-emerald-50 text-emerald-700",
                        )}>
                        <MaterialIcon name="picture_as_pdf" size="sm" />
                    </div>
                    <div>
                        <p
                            className={cn(
                                "text-xs font-bold font-sans",
                                activeSection === "review-export" ? "text-white" : "text-emerald-900",
                            )}>
                            Review &amp; Master PDF Export
                        </p>
                        <p
                            className={cn(
                                "text-[11px]",
                                activeSection === "review-export" ? "text-white/80" : "text-on-surface-variant",
                            )}>
                            41-page packet &amp; live preview
                        </p>
                    </div>
                </div>
                <MaterialIcon
                    name="chevron_right"
                    size="sm"
                    className={activeSection === "review-export" ? "text-white" : "text-on-surface-variant"}
                />
            </button>
        </aside>
    );
}

