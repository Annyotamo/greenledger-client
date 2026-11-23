"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { ElectricityActivitySummary } from "@/components/activity/ElectricityActivitySummary";
import { ElectricityActivityTable } from "@/components/activity/ElectricityActivityTable";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";
import { Authorize } from "@/components/rbac/Authorize";
import { useElectricityActivities } from "@/lib/activity/hooks";

function ElectricityActivitiesContent() {
    const [status, setStatus] = useState("");
    const [accountingMethod, setAccountingMethod] = useState("");
    const [electricityActivityType, setElectricityActivityType] = useState("");
    const [dataQualityTier, setDataQualityTier] = useState("");
    const [sourceType, setSourceType] = useState("");
    const [selectedFacility, setSelectedFacility] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const filterParams = useMemo(
        () => ({
            status: status || undefined,
            accounting_method: accountingMethod || undefined,
            electricity_activity_type: electricityActivityType || undefined,
            data_quality_tier: dataQualityTier || undefined,
            source_type: sourceType || undefined,
            facility_id: selectedFacility || undefined,
        }),
        [status, accountingMethod, electricityActivityType, dataQualityTier, sourceType, selectedFacility],
    );

    const { data: activities = [], isPending, isError } = useElectricityActivities(filterParams);

    const facilityOptions = useMemo(
        () => Array.from(new Set(activities.map((activity) => activity.facilityId))).sort(),
        [activities],
    );

    function handleRefresh() {
        setStatus("");
        setAccountingMethod("");
        setElectricityActivityType("");
        setDataQualityTier("");
        setSourceType("");
        setSelectedFacility("");
    }

    const filteredActivities = activities;

    return (
        <div className="space-y-8 animate-fade-up">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Electricity Activity Log</h2>
                    <p className="mt-1 text-body-md text-on-surface-variant">
                        Review, filter and manage purchased electricity activity emissions.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" size="md" onClick={() => setShowFilters((s) => !s)}>
                        <MaterialIcon name="filter_list" size="sm" />
                        Filter
                    </Button>

                    <Authorize
                        feature="scope_2"
                        level="write"
                        disabledTooltip="Requires Write permission on Scope 2 to add electricity entries">
                        <Link href="/activities/electricity/create">
                            <button className="bg-primary text-on-primary px-6 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity rounded shadow-sm">
                                <MaterialIcon name="add" size="sm" />
                                <span className="font-label-md text-label-md uppercase">New Electricity Activity</span>
                            </button>
                        </Link>
                    </Authorize>
                </div>
            </div>

            {/* Filter Drawer */}
            {showFilters ? (
                <div className="grid grid-cols-1 gap-3 rounded-lg border border-outline-variant bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-6">
                    <select
                        aria-label="Filter by facility"
                        className="rounded-md border border-outline-variant bg-transparent px-3 py-2 text-sm text-on-surface"
                        value={selectedFacility}
                        onChange={(e) => setSelectedFacility(e.target.value)}>
                        <option value="">All facilities</option>
                        {facilityOptions.map((facilityId) => (
                            <option key={facilityId} value={facilityId}>
                                {facilityId}
                            </option>
                        ))}
                    </select>

                    <select
                        aria-label="Filter by status"
                        className="rounded-md border border-outline-variant bg-transparent px-3 py-2 text-sm text-on-surface"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}>
                        <option value="">All statuses</option>
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <select
                        aria-label="Filter by accounting method"
                        className="rounded-md border border-outline-variant bg-transparent px-3 py-2 text-sm text-on-surface"
                        value={accountingMethod}
                        onChange={(e) => setAccountingMethod(e.target.value)}>
                        <option value="">All accounting methods</option>
                        <option value="location_based">Location Based</option>
                        <option value="market_based">Market Based</option>
                    </select>

                    <select
                        aria-label="Filter by electricity activity type"
                        className="rounded-md border border-outline-variant bg-transparent px-3 py-2 text-sm text-on-surface"
                        value={electricityActivityType}
                        onChange={(e) => setElectricityActivityType(e.target.value)}>
                        <option value="">All activity types</option>
                        <option value="grid">Grid</option>
                        <option value="renewable">Renewable</option>
                    </select>

                    <select
                        aria-label="Filter by data quality tier"
                        className="rounded-md border border-outline-variant bg-transparent px-3 py-2 text-sm text-on-surface"
                        value={dataQualityTier}
                        onChange={(e) => setDataQualityTier(e.target.value)}>
                        <option value="">All quality tiers</option>
                        <option value="measured">Measured</option>
                        <option value="estimated">Estimated</option>
                    </select>

                    <div className="flex items-center justify-end gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            type="button"
                            onClick={handleRefresh}
                            className="border-none bg-transparent">
                            <MaterialIcon name="refresh" size="lg" />
                        </Button>
                    </div>
                </div>
            ) : null}

            <ElectricityActivitySummary activities={filteredActivities} />

            <ElectricityActivityTable
                activities={filteredActivities}
                isLoading={isPending}
                isError={isError}
                status={status}
                electricityActivityType={electricityActivityType}
                dataQualityTier={dataQualityTier}
                sourceType={sourceType}
                selectedFacility={selectedFacility}
                onStatusChange={setStatus}
                onElectricityActivityTypeChange={setElectricityActivityType}
                onDataQualityTierChange={setDataQualityTier}
                onSourceTypeChange={setSourceType}
                onFacilityChange={setSelectedFacility}
                facilityOptions={facilityOptions}
            />
        </div>
    );
}

export default function ElectricityActivitiesPage() {
    return (
        <ProtectedRoute feature="scope_2" requiredLevel="read" featureTitle="Scope 2: Purchased Electricity">
            <ElectricityActivitiesContent />
        </ProtectedRoute>
    );
}
