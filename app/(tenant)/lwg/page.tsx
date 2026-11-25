// app/(tenant)/lwg/page.tsx
"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { LwgActionableGapsCard } from "@/components/lwg/dashboard/LwgActionableGapsCard";
import {
    LwgEnergyIntensityCard,
    LwgEnvironmentalSharesCard,
    LwgWaterIntensityCard,
} from "@/components/lwg/dashboard/LwgIntensityKpiCards";
import { LwgMedalStandingCard } from "@/components/lwg/dashboard/LwgMedalStandingCard";
import { LwgMonthMatrixGrid } from "@/components/lwg/dashboard/LwgMonthMatrixGrid";
import { LwgProtocolSectionsTable } from "@/components/lwg/dashboard/LwgProtocolSectionsTable";
import { LwgReadinessGaugeCard } from "@/components/lwg/dashboard/LwgReadinessGaugeCard";
import { LwgMasterHeader } from "@/components/lwg/LwgMasterHeader";
import { LwgProfileGuard } from "@/components/lwg/LwgProfileGuard";
import { useLwgDashboard } from "@/lib/lwg/hooks";

export default function LwgDashboardPage() {
    return (
        <LwgProfileGuard mode="operational">
            <div className="space-y-6 animate-fade-up pb-8">
                <LwgMasterHeader activeTab="dashboard" />
                <LwgDashboardContent />
            </div>
        </LwgProfileGuard>
    );
}

function LwgDashboardContent() {
    const { data: dashboard, isLoading, isError, error, refetch } = useLwgDashboard();

    if (isLoading) {
        return <LwgDashboardSkeleton />;
    }

    if (isError || !dashboard) {
        return (
            <Card className="border-error/30 bg-error/5">
                <CardBody className="flex flex-col items-center justify-center gap-3 p-10 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-error/10 text-error">
                        <MaterialIcon name="error" size="md" />
                    </div>
                    <div>
                        <h3 className="font-display text-base font-bold text-primary">
                            Failed to Load Compliance Dashboard
                        </h3>
                        <p className="font-sans text-xs text-on-surface-variant max-w-md mt-1">
                            {error?.message || "An unexpected error occurred while calculating LWG readiness metrics."}
                        </p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => refetch()} className="mt-2">
                        <MaterialIcon name="refresh" size="xs" />
                        <span>Retry Calculations</span>
                    </Button>
                </CardBody>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Panel 1: Top Metrics (Unified Balanced 4-Column Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                <LwgReadinessGaugeCard readiness={dashboard.readiness} />
                <LwgEnergyIntensityCard energyIntensity={dashboard.energyIntensity} />
                <LwgWaterIntensityCard waterIntensity={dashboard.waterIntensity} />
                <LwgEnvironmentalSharesCard
                    renewableShare={dashboard.renewableShare}
                    onsiteRenewableShare={dashboard.onsiteRenewableShare}
                    recycledWaterShare={dashboard.recycledWaterShare}
                />
            </div>

            {/* Panel 2: 24-Month Audit Data Matrix Grid */}
            <LwgMonthMatrixGrid monthGrid={dashboard.monthGrid} />

            {/* Panel 3: Actionable Audit Gaps Scanner & Medal Standing */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-stretch">
                <div className="lg:col-span-7 flex flex-col">
                    <LwgActionableGapsCard gapList={dashboard.gapList} />
                </div>
                <div className="lg:col-span-5 flex flex-col">
                    <LwgMedalStandingCard medalStatus={dashboard.medalStatus} />
                </div>
            </div>

            {/* Panel 4: All 17 LWG Protocol Sections */}
            <LwgProtocolSectionsTable sectionStatuses={dashboard.sectionStatuses} />
        </div>
    );
}

function LwgDashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Top Row 4-Card Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                <div className="h-64 rounded-lg border border-outline-variant/60 bg-surface-container-high" />
                <div className="h-64 rounded-lg border border-outline-variant/60 bg-surface-container-high" />
                <div className="h-64 rounded-lg border border-outline-variant/60 bg-surface-container-high" />
                <div className="h-64 rounded-lg border border-outline-variant/60 bg-surface-container-high" />
            </div>

            {/* 24-Month Matrix Skeleton */}
            <div className="h-72 rounded-lg border border-outline-variant/60 bg-surface-container-high" />

            {/* Gaps and Medal Skeleton */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                <div className="lg:col-span-7 h-80 rounded-lg border border-outline-variant/60 bg-surface-container-high" />
                <div className="lg:col-span-5 h-80 rounded-lg border border-outline-variant/60 bg-surface-container-high" />
            </div>

            {/* Sections Skeleton */}
            <div className="h-96 rounded-lg border border-outline-variant/60 bg-surface-container-high" />
        </div>
    );
}
