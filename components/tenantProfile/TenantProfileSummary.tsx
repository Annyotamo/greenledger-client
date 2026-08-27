"use client";

import { motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { TenantProfile } from "@/lib/tenantProfile/types";

type TenantProfileSummaryProps = {
    profile: TenantProfile;
};

function formatApproach(val: string | null | undefined): string {
    if (!val) return "Operational Control";
    if (val.toLowerCase() === "operational_control") return "Operational Control";
    if (val.toLowerCase() === "financial_control") return "Financial Control";
    if (val.toLowerCase() === "equity_share") return "Equity Share";
    return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function TenantProfileSummary({ profile }: TenantProfileSummaryProps) {
    const approachText = formatApproach(profile.consolidationApproach);

    const stats = [
        {
            label: "Consolidation Approach",
            value: approachText,
            sub: "GHG Protocol Corporate Standard",
            icon: "account_tree",
            color: "text-emerald-700 bg-emerald-50 border-emerald-200/80",
            dot: "bg-emerald-500",
        },
        {
            label: "Organization Size",
            value: `${profile.organizationSize || 0} Members`,
            sub: "Full-time team size",
            icon: "groups",
            color: "text-blue-700 bg-blue-50 border-blue-200/80",
            dot: "bg-blue-500",
        },
        {
            label: "Facility Allocation",
            value: `${profile.maxFacilities || 0} Facilities`,
            sub: "Active operational nodes",
            icon: "domain",
            color: "text-indigo-700 bg-indigo-50 border-indigo-200/80",
            dot: "bg-indigo-500",
        },
        {
            label: "User Seat Limit",
            value: `${profile.maxUsers || 0} Seats`,
            sub: "Workspace collaborative quota",
            icon: "badge",
            color: "text-amber-700 bg-amber-50 border-amber-200/80",
            dot: "bg-amber-500",
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-sans">
            {stats.map((stat, idx) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.08 }}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md">
                    <div className="flex items-start justify-between gap-3">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            {stat.label}
                        </span>
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${stat.color} shadow-2xs`}>
                            <MaterialIcon name={stat.icon} size="sm" />
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="text-lg font-bold tracking-tight text-slate-900 line-clamp-1">
                            {stat.value}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                            <span className={`h-1.5 w-1.5 rounded-full ${stat.dot}`} />
                            <span>{stat.sub}</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
