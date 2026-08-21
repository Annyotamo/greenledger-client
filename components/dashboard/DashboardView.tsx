"use client";

import { useGhgDashboard } from "@/lib/dashboard/hooks";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card } from "@/components/ui/card";
import { AiAssistantFAB } from "./AiAssistantFAB";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { TenantDashboardBanner } from "./TenantDashboardBanner";
import { TopHeroKpiBanner } from "./TopHeroKpiBanner";
import { ScopeKpiCardsGrid } from "./ScopeKpiCardsGrid";
import { ScopeDistributionSection } from "./ScopeDistributionSection";
import { MultiYearEmissionsTrendChart } from "./MultiYearEmissionsTrendChart";
import { DetailedSourceBreakdowns } from "./DetailedSourceBreakdowns";
import { TopEmissionSourcesTable } from "./TopEmissionSourcesTable";
import { RecentActivity } from "./RecentActivity";
import { FacilityTable } from "./FacilityTable";
import {
    FACILITY_ROWS,
    RECENT_ACTIVITIES,
} from "@/lib/dashboard/data";

const DEFAULT_SCOPE_DISTRIBUTION = [
    { scopeName: "Scope 1", tco2e: 2.68, sharePct: 32.4, color: "#f97316" },
    { scopeName: "Scope 2", tco2e: 4.10, sharePct: 49.5, color: "#3b82f6" },
    { scopeName: "Scope 3", tco2e: 1.50, sharePct: 18.1, color: "#10b981" },
];

const DEFAULT_YEARLY_TREND = [
    {
        year: 2025,
        yearLabel: "FY 2024-25",
        totalTco2e: 8.65,
        scope1Tco2e: 2.80,
        scope2Tco2e: 4.25,
        scope3Tco2e: 1.60,
        yoyChangePct: 0,
    },
    {
        year: 2026,
        yearLabel: "FY 2025-26",
        totalTco2e: 8.28,
        scope1Tco2e: 2.68,
        scope2Tco2e: 4.10,
        scope3Tco2e: 1.50,
        yoyChangePct: -4.2,
    },
];

const DEFAULT_DETAILED_BREAKDOWNS = {
    scope1: {
        stationaryCombustion: 2.68,
        mobileCombustion: 0.0,
        processEmissions: 0.0,
        fugitiveEmissions: 0.0,
        total: 2.68,
    },
    scope2: {
        purchasedElectricity: 4.10,
        purchasedSteam: 0.0,
        purchasedHeatCooling: 0.0,
        locationBased: 4.10,
        marketBased: 3.90,
        total: 4.10,
    },
    scope3: {
        categories: [
            { categoryCode: "Cat 1", categoryName: "Purchased Goods and Services", tco2e: 1.50, sharePct: 18.1 },
        ],
        total: 1.50,
    },
};

const DEFAULT_TOP_5_SOURCES = [
    { rank: 1, sourceName: "Purchased Grid Electricity", scopeName: "Scope 2", tco2e: 4.10, sharePct: 49.5 },
    { rank: 2, sourceName: "Scope 1 - Diesel (Stationary)", scopeName: "Scope 1", tco2e: 2.68, sharePct: 32.4 },
    { rank: 3, sourceName: "Cat 1: Purchased Goods and Services", scopeName: "Scope 3", tco2e: 1.50, sharePct: 18.1 },
];

export function DashboardView() {
    const { data: dashboard, isLoading, isError, error, refetch } = useGhgDashboard();

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (isError) {
        return (
            <div className="relative mx-auto max-w-[1400px] space-y-6">
                <DashboardHeader />
                <Card className="border-error/30 bg-error-container/10 p-6 text-center">
                    <MaterialIcon name="error_outline" size="lg" className="mx-auto text-error mb-2" />
                    <h3 className="text-headline-sm font-semibold text-error mb-1">Failed to load GHG Dashboard</h3>
                    <p className="text-body-md text-on-surface-variant mb-4">
                        {error?.message || "An error occurred while fetching emissions data from server."}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-2 rounded-lg bg-primary text-on-primary font-mono text-label-md hover:opacity-90 transition-opacity">
                        Retry Loading
                    </button>
                </Card>
            </div>
        );
    }

    const topKpiCards = dashboard?.topKpiCards && dashboard.topKpiCards.length > 0 ? dashboard.topKpiCards : [];

    const totalCard = topKpiCards.find((c) => c.id === "total_emissions");
    const intensityCard = topKpiCards.find((c) => c.id === "emissions_intensity");
    const scopeCards = topKpiCards.filter((c) => c.id !== "total_emissions" && c.id !== "emissions_intensity");

    const scopeDistribution = dashboard?.scopeDistribution && dashboard.scopeDistribution.length > 0
        ? dashboard.scopeDistribution
        : DEFAULT_SCOPE_DISTRIBUTION;
    const yearlyTrend = dashboard?.yearlyTrend && dashboard.yearlyTrend.length > 0
        ? dashboard.yearlyTrend
        : DEFAULT_YEARLY_TREND;
    const detailedSourceBreakdowns = dashboard?.detailedSourceBreakdowns || DEFAULT_DETAILED_BREAKDOWNS;
    const top5Sources = dashboard?.top5EmissionSources && dashboard.top5EmissionSources.length > 0
        ? dashboard.top5EmissionSources
        : DEFAULT_TOP_5_SOURCES;

    const facilityRows = (dashboard?.facilityRows && dashboard.facilityRows.length > 0 ? dashboard.facilityRows : FACILITY_ROWS).slice(0, 5);
    const recentActivities = (dashboard?.recentActivities && dashboard.recentActivities.length > 0 ? dashboard.recentActivities : RECENT_ACTIVITIES).slice(0, 12);

    return (
        <div className="relative mx-auto max-w-[1400px] space-y-6">
            <DashboardHeader />
            <TenantDashboardBanner />

            {/* Top Borderless Seamless Hero Banner (Total GHG & Emissions Intensity) */}
            <TopHeroKpiBanner totalCard={totalCard} intensityCard={intensityCard} />

            {/* 4 Scope KPI Cards Grid (Scope 1, Scope 2, Scope 3, Biogenic) */}
            <ScopeKpiCardsGrid scopeCards={scopeCards} />

            {/* Section 2 & 3: Scope Distribution (Donut / Stacked Bar) & Multi-Year Emissions Trend Line Chart */}
            <div className="grid grid-cols-12 gap-6 items-stretch">
                <div className="col-span-12 lg:col-span-5">
                    <ScopeDistributionSection data={scopeDistribution} />
                </div>
                <div className="col-span-12 lg:col-span-7">
                    <MultiYearEmissionsTrendChart data={yearlyTrend} />
                </div>
            </div>

            {/* Section 4: Detailed Sub-Source Breakdowns (Scope 1, Scope 2, Scope 3) */}
            <DetailedSourceBreakdowns data={detailedSourceBreakdowns} />

            {/* Section 5: Top 5 Emission Sources Table & Recent Activity Panel */}
            <div className="grid grid-cols-12 gap-6 items-stretch">
                <div className="col-span-12 lg:col-span-7">
                    <TopEmissionSourcesTable sources={top5Sources} />
                </div>
                <div className="col-span-12 lg:col-span-5">
                    <RecentActivity
                        items={recentActivities}
                        maxItems={top5Sources.length > 0 ? top5Sources.length : 5}
                        className="w-full h-full"
                    />
                </div>
            </div>

            {/* Operational Facility Overview Table */}
            {facilityRows && facilityRows.length > 0 && (
                <FacilityTable rows={facilityRows} />
            )}

            <AiAssistantFAB />
        </div>
    );
}
