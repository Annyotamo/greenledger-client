"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";

export function Scope3Header() {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-on-surface-variant font-sans text-xs mb-1">
                    <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
                        <MaterialIcon name="home" size="xs" className="!text-[14px]" />
                        <span>Home</span>
                    </Link>
                    <span>/</span>
                    <span className="text-primary font-semibold">Scope 3 Value Chain</span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight font-display">
                        Scope 3 Value Chain Accounting
                    </h1>
                    <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 font-sans text-[11px] font-semibold text-emerald-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            SEBI BRSR & GHG Protocol
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-surface-container-high border border-outline-variant/60 px-2.5 py-0.5 font-sans text-[11px] font-semibold text-on-surface-variant">
                            FY 2025-26 Active
                        </span>
                    </div>
                </div>
                <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                    Full lifecycle greenhouse gas accounting across upstream supply chain and downstream value chain activities.
                </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Button variant="secondary" size="md" className="gap-2 shadow-2xs">
                    <MaterialIcon name="file_download" size="sm" />
                    <span>Export Scope 3 Pack</span>
                </Button>
                <Link href="/activities">
                    <Button variant="primary" size="md" className="gap-2 shadow-sm">
                        <MaterialIcon name="post_add" size="sm" />
                        <span>Log Value Chain Activity</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
