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
                </div>
                <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                    Full lifecycle greenhouse gas accounting across upstream supply chain and downstream value chain activities.
                </p>
            </div>

        </div>
    );
}
