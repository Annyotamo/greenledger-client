"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
    return (
        <div className="relative mx-auto max-w-[1400px] space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <div className="h-7 w-64 rounded bg-surface-container-high" />
                    <div className="h-4 w-96 rounded bg-surface-container-low" />
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-36 rounded-lg bg-surface-container-high" />
                    <div className="h-10 w-28 rounded-lg bg-surface-container-high" />
                </div>
            </div>

            {/* Banner Skeleton */}
            <div className="h-20 w-full rounded-xl bg-surface-container-low border border-outline-variant/30" />

            {/* 4 KPI Metric Cards Skeleton */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="flex h-32 flex-col justify-between p-card-padding">
                        <div className="flex items-center justify-between">
                            <div className="h-4 w-28 rounded bg-surface-container-high" />
                            <div className="h-5 w-12 rounded-full bg-surface-container-high" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-8 w-36 rounded bg-surface-container-high" />
                            <div className="h-1.5 w-full rounded bg-surface-container-low" />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Section Skeleton */}
            <div className="grid grid-cols-12 items-stretch gap-6">
                <div className="col-span-12 flex flex-col gap-6 lg:col-span-8">
                    {/* Emissions Trend Chart Skeleton */}
                    <Card>
                        <CardBody className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="h-5 w-48 rounded bg-surface-container-high" />
                                <div className="h-4 w-24 rounded bg-surface-container-low" />
                            </div>
                            <div className="h-64 w-full rounded border border-outline-variant/30 bg-surface-container-low" />
                        </CardBody>
                    </Card>

                    {/* Facility Table Skeleton */}
                    <Card>
                        <CardHeader tone="flat">
                            <div className="h-5 w-40 rounded bg-surface-container-high" />
                        </CardHeader>
                        <div className="p-card-padding space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-outline-variant/20">
                                    <div className="h-4 w-24 rounded bg-surface-container-high" />
                                    <div className="h-4 w-40 rounded bg-surface-container-low" />
                                    <div className="h-4 w-16 rounded bg-surface-container-high" />
                                    <div className="h-4 w-20 rounded bg-surface-container-low" />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Recent Activities Skeleton */}
                <div className="col-span-12 flex min-h-0 lg:col-span-4">
                    <Card className="w-full flex flex-col justify-between">
                        <CardHeader tone="flat">
                            <div className="h-5 w-36 rounded bg-surface-container-high" />
                        </CardHeader>
                        <CardBody className="space-y-4 flex-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-surface-container-high shrink-0" />
                                    <div className="space-y-1 flex-1">
                                        <div className="h-4 w-full rounded bg-surface-container-high" />
                                        <div className="h-3 w-2/3 rounded bg-surface-container-low" />
                                    </div>
                                </div>
                            ))}
                        </CardBody>
                    </Card>
                </div>

                {/* Scope Breakdown Skeleton */}
                <div className="col-span-12 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
                    <Card className="h-80">
                        <CardHeader tone="flat">
                            <div className="h-5 w-44 rounded bg-surface-container-high" />
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="h-32 w-full rounded bg-surface-container-low" />
                            <div className="space-y-2">
                                <div className="h-4 w-full rounded bg-surface-container-high" />
                                <div className="h-4 w-3/4 rounded bg-surface-container-low" />
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="h-80">
                        <CardHeader tone="flat">
                            <div className="h-5 w-44 rounded bg-surface-container-high" />
                        </CardHeader>
                        <CardBody className="flex items-center justify-center h-56">
                            <div className="h-36 w-36 rounded-full border-8 border-surface-container-high border-t-secondary animate-spin" />
                        </CardBody>
                    </Card>
                </div>

                {/* Scope Comparison Chart Skeleton */}
                <div className="col-span-12">
                    <Card className="h-72">
                        <CardHeader tone="flat">
                            <div className="h-5 w-56 rounded bg-surface-container-high" />
                        </CardHeader>
                        <CardBody>
                            <div className="h-48 w-full rounded bg-surface-container-low" />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
