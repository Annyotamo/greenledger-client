"use client";

import { motion } from "framer-motion";
import { useGhgDashboard } from "@/lib/dashboard/hooks";
import {
    EMISSIONS_TREND,
    FACILITY_ROWS,
    METRIC_CARDS,
    RECENT_ACTIVITIES,
    SCOPE1_FUELS,
    SCOPE2_SEGMENTS,
    SCOPE_COMPARISON,
} from "@/lib/dashboard/data";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card } from "@/components/ui/card";
import { AiAssistantFAB } from "./AiAssistantFAB";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { TenantDashboardBanner } from "./TenantDashboardBanner";
import { EmissionsTrendChart } from "./EmissionsTrendChart";
import { FacilityTable } from "./FacilityTable";
import { MetricCard } from "./MetricCard";
import { RecentActivity } from "./RecentActivity";
import { Scope1Breakdown } from "./Scope1Breakdown";
import { Scope2Donut } from "./Scope2Donut";
import { ScopeComparisonChart } from "./ScopeComparisonChart";

const gridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};

const gridItemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
};

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

    const cards = dashboard?.metricCards && dashboard.metricCards.length > 0 ? dashboard.metricCards : METRIC_CARDS;
    const trendData = dashboard?.emissionsTrend && dashboard.emissionsTrend.length > 0 ? dashboard.emissionsTrend : EMISSIONS_TREND;
    const facilityRows = (dashboard?.facilityRows && dashboard.facilityRows.length > 0 ? dashboard.facilityRows : FACILITY_ROWS).slice(0, 5);
    const recentActivities = (dashboard?.recentActivities && dashboard.recentActivities.length > 0 ? dashboard.recentActivities : RECENT_ACTIVITIES).slice(0, 12);
    const fuels = (dashboard?.fuelBreakdown && dashboard.fuelBreakdown.length > 0 ? dashboard.fuelBreakdown : SCOPE1_FUELS).slice(0, 5);
    const gasSegments = dashboard?.gasBreakdown && dashboard.gasBreakdown.length > 0 ? dashboard.gasBreakdown : SCOPE2_SEGMENTS;
    const comparisonData = dashboard?.monthlyScopeComparison && dashboard.monthlyScopeComparison.length > 0 ? dashboard.monthlyScopeComparison : SCOPE_COMPARISON;

    return (
        <div className="relative mx-auto max-w-[1400px] space-y-6">
            <DashboardHeader />
            <TenantDashboardBanner />

            <motion.div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                variants={gridVariants}
                initial="hidden"
                animate="show">
                {cards.map((card) => (
                    <motion.div key={card.id} variants={gridItemVariants}>
                        <MetricCard data={card} />
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-12 items-stretch gap-6">
                <div className="col-span-12 flex flex-col gap-6 lg:col-span-8">
                    <EmissionsTrendChart data={trendData} />
                    <FacilityTable rows={facilityRows} />
                </div>

                <div className="col-span-12 flex min-h-0 lg:col-span-4">
                    <RecentActivity items={recentActivities} className="w-full" />
                </div>

                <div className="col-span-12 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
                    <Scope1Breakdown fuels={fuels} />
                    <Scope2Donut segments={gasSegments} />
                </div>

                <div className="col-span-12">
                    <ScopeComparisonChart data={comparisonData} />
                </div>
            </div>

            <AiAssistantFAB />
        </div>
    );
}
