"use client";

import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { FacilitySummary } from "@/components/facility/FacilitySummary";
import { FacilityPortfolioTable } from "@/components/facility/FacilityPortfolioTable";
import { useFacilities } from "@/lib/facility/hooks";

export default function FacilitiesPage() {
    const { data: facilities = [], isPending, isError } = useFacilities();

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                        Facilities Management
                    </h2>
                    <p className="mt-1 text-body-md text-on-surface-variant">
                        Detailed inventory of global operational centers and energy profiles.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border border-outline-variant px-4 py-2 flex items-center gap-2 hover:bg-surface-container-low transition-colors rounded">
                        <MaterialIcon name="filter_list" size="sm" />
                        <span className="font-label-md text-label-md uppercase">Filter</span>
                    </button>
                    <Link href="/facilities/create">
                        <button className="bg-primary text-on-primary px-6 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity rounded shadow-sm">
                            <MaterialIcon name="add" size="sm" />
                            <span className="font-label-md text-label-md uppercase">New Facility</span>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Row - Full Width */}
            <FacilitySummary facilities={facilities} />

            {/* Portfolio Table - Full Width */}
            <FacilityPortfolioTable facilities={facilities} isLoading={isPending} isError={isError} />

            {/* Bottom Section - Two Columns */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
                {/* Global Distribution Map - Left */}
                <div className="bg-white border border-outline-variant rounded-lg p-card-padding">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-headline-sm font-semibold text-primary">Global Distribution</h4>
                        <span className="font-label-md text-label-md text-on-surface-variant">
                            LAT/LONG MAPPING ACTIVE
                        </span>
                    </div>
                    <div className="relative h-64 w-full bg-surface-container rounded border border-outline-variant overflow-hidden group">
                        <Image
                            fill
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIiuQ2G9NYM-PLwUIloHoIZ7zapAwsq9d1BXEQOTBTdhxzFHugci5t-ihN-hMB-AyxCxYnCCZGSBiJrM0dwh9HxcKZkPTzd3s99RW-mQGUy0EYzFeemQ1wJzkF9D4qYqjeHHwKDrYyA_ZGLQgTfxRoA7FL0rIo2T9tIxu228pl-BqPaFeybMSr11KUSbA13aZiehIEFkNQ3RYeQSDjqUgfM5DPcG49jZEBtwTVA97y2KNChg_qg8bDJdXKzqm75Lm0SZ9D2eAr6Fw"
                            alt="World map with facility locations"
                            className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                            unoptimized
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                        <div className="absolute top-4 right-4 flex flex-col gap-2 rounded bg-white/90 p-2 shadow-sm border border-outline-variant backdrop-blur-sm">
                            <button className="p-1.5 rounded hover:bg-surface-container-high text-primary transition-colors">
                                <MaterialIcon name="add" size="sm" />
                            </button>
                            <button className="p-1.5 rounded hover:bg-surface-container-high text-primary transition-colors">
                                <MaterialIcon name="remove" size="sm" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Audit Readiness Card - Right */}
                <div className="bg-primary text-on-primary rounded-lg p-card-padding flex flex-col">
                    <h4 className="font-headline-sm text-headline-sm text-white">Audit Readiness</h4>
                    <p className="mt-3 text-body-md text-white/80 leading-relaxed">
                        Your facility portfolio currently has 87% data completeness for FY2024. Resolve flags in EU
                        Logistics Hub to achieve &quot;Audit-Ready&quot; status.
                    </p>
                    <div className="mt-6 space-y-4">
                        <div>
                            <div className="mb-1.5 flex items-center justify-between text-[11px] uppercase tracking-[0.05em] text-white/70 font-label-md">
                                <span>Completeness</span>
                                <span>87%</span>
                            </div>
                            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                                <div className="bg-secondary-fixed h-full rounded-full" style={{ width: "87%" }} />
                            </div>
                        </div>
                    </div>
                    <button className="w-full bg-white text-primary py-3 rounded font-label-md text-label-md hover:bg-primary-fixed transition-colors mt-6">
                        RUN RECONCILIATION
                    </button>
                </div>
            </div>
        </div>
    );
}
