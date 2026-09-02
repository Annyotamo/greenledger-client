"use client";

import { use } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FuelActivityDetailView } from "@/components/activity/FuelActivityDetailView";
import { useFuelActivity } from "@/lib/activity/hooks";

export default function FuelActivityDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const activityId = resolvedParams?.id;

    const { data: activity, isLoading, isError, error } = useFuelActivity(activityId);

    if (isLoading) {
        return (
            <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
                {/* Skeleton Header */}
                <div className="flex items-center justify-between border-b border-outline-variant pb-4">
                    <div className="h-4 w-48 bg-surface-container-high rounded" />
                    <div className="h-8 w-32 bg-surface-container-high rounded" />
                </div>

                {/* Skeleton Hero Card */}
                <div className="rounded-xl border border-outline-variant bg-white p-6 space-y-4">
                    <div className="flex gap-2">
                        <div className="h-6 w-20 bg-surface-container-high rounded" />
                        <div className="h-6 w-24 bg-surface-container-high rounded" />
                    </div>
                    <div className="h-8 w-96 bg-surface-container-high rounded" />
                    <div className="h-4 w-64 bg-surface-container-high rounded" />
                </div>

                {/* Skeleton KPI Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-28 rounded-xl border border-outline-variant bg-white p-4" />
                    ))}
                </div>

                {/* Skeleton Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 h-80 rounded-xl border border-outline-variant bg-white" />
                    <div className="lg:col-span-5 h-80 rounded-xl border border-outline-variant bg-white" />
                </div>
            </div>
        );
    }

    if (isError || !activity) {
        return (
            <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
                <Card className="p-8 bg-white border border-outline-variant rounded-xl shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-rose-50 text-error flex items-center justify-center mx-auto mb-4 border border-rose-200">
                        <MaterialIcon name="error_outline" size="md" />
                    </div>
                    <h2 className="font-headline-sm text-lg font-bold text-primary">
                        Fuel Activity Record Not Found
                    </h2>
                    <p className="text-sm font-mono text-on-surface-variant mt-2 max-w-md mx-auto">
                        {error?.message || "The requested fuel activity could not be found or you do not have permission to view it."}
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                        <Link href="/activities/fuel">
                            <Button variant="primary">
                                <MaterialIcon name="arrow_back" size="xs" />
                                <span>Return to Fuel Activities</span>
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        );
    }

    return <FuelActivityDetailView activity={activity} />;
}
