"use client";

import { useState } from "react";
import { Scope3Navbar } from "./Scope3Navbar";
import { Scope3Header } from "./Scope3Header";
import { Scope3TopHeroBanner } from "./Scope3TopHeroBanner";
import { Scope3KpiCardsGrid } from "./Scope3KpiCardsGrid";
import { Scope3CategoryDistributionSection } from "./Scope3CategoryDistributionSection";
import { Scope3MonthlyTrendChart } from "./Scope3MonthlyTrendChart";
import { Scope3TrackedCategoriesTable } from "./Scope3TrackedCategoriesTable";
import { Scope3HotspotsAndActivities } from "./Scope3HotspotsAndActivities";
import { Scope3GovernanceBanner } from "./Scope3GovernanceBanner";
import { AiAssistantFAB } from "@/components/dashboard/AiAssistantFAB";
import type { Scope3ViewMode } from "@/lib/scope3/data";

export function Scope3DashboardView() {
    const [viewMode, setViewMode] = useState<Scope3ViewMode>("operational");

    return (
        <div className="relative mx-auto max-w-[1400px] space-y-6 pb-12">
            {/* Sticky Scope 3 Top Navbar with View Switcher & Category Mega Menus */}
            <Scope3Navbar currentViewMode={viewMode} onViewModeChange={(mode) => setViewMode(mode)} />

            {/* Scope 3 Main Header & Actions */}
            <Scope3Header />

            {/* Top Borderless Seamless Hero Banner (Total Scope 3 Footprint & Supply Chain Intensity) */}
            <Scope3TopHeroBanner />

            {/* 4 Scope 3 Key Metric KPI Cards */}
            <Scope3KpiCardsGrid />

            {/* Section 2: Visual Distribution (Donut / Stacked Bar) & Multi-Month Trend Chart */}
            <div className="grid grid-cols-12 gap-6 items-stretch">
                <div className="col-span-12 lg:col-span-5">
                    <Scope3CategoryDistributionSection />
                </div>
                <div className="col-span-12 lg:col-span-7">
                    <Scope3MonthlyTrendChart />
                </div>
            </div>

            {/* Section 3: Tracked Value Chain Categories Contribution Table & Ledger Actions */}
            <Scope3TrackedCategoriesTable />

            {/* Section 4: Value Chain Hotspots Table & Live Recent Activities Feed */}
            <Scope3HotspotsAndActivities />

            {/* Section 5: Protocol Compliance & Data Assurance Tier Banner */}
            <Scope3GovernanceBanner />

            {/* Floating AI Sustainability Copilot */}
            <AiAssistantFAB />
        </div>
    );
}
