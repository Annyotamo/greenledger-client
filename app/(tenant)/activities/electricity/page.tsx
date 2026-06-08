"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { ElectricityActivitySummary } from "@/components/activity/ElectricityActivitySummary";
import { ElectricityActivityTable } from "@/components/activity/ElectricityActivityTable";
import { useElectricityActivities } from "@/lib/activity/hooks";

export default function ElectricityActivitiesPage() {
    const [status, setStatus] = useState("");
    const [electricityActivityType, setElectricityActivityType] = useState("");
    const [dataQualityTier, setDataQualityTier] = useState("");
    const [sourceType, setSourceType] = useState("");
    const [selectedFacility, setSelectedFacility] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const filterParams = useMemo(
        () => ({
            status: status || undefined,
            electricity_activity_type: electricityActivityType || undefined,
            data_quality_tier: dataQualityTier || undefined,
            source_type: sourceType || undefined,
            facility_id: selectedFacility || undefined,
        }),
        [status, electricityActivityType, dataQualityTier, sourceType, selectedFacility],
    );

    const { data: activities = [], isPending, isError } = useElectricityActivities(filterParams);

    const facilityOptions = useMemo(
        () => Array.from(new Set(activities.map((activity) => activity.facilityId))).sort(),
        [activities],
    );

    function handleRefresh() {
        setStatus("");
        setElectricityActivityType("");
        setDataQualityTier("");
        setSourceType("");
        setSelectedFacility("");
    }

    const filteredActivities = activities;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                        Electricity Activity Log
                    </h2>
                    <p className="mt-1 text-body-md text-on-surface-variant">
                        Review, filter and manage electricity activity emissions across your operational sites.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" size="md" onClick={() => setShowFilters((s) => !s)}>
                        <MaterialIcon name="filter_list" size="sm" />
                        Filter
                    </Button>
                    <Link href="/activities/electricity/create">
                        <button className="bg-primary text-on-primary px-6 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity rounded shadow-sm">
                            <MaterialIcon name="add" size="sm" />
                            <span className="font-label-md text-label-md uppercase">New Activity</span>
                        </button>
                    </Link>
                </div>
            </div>

            {showFilters ? (
                <div className="w-full grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
                    <select
                        className="h-10 w-full rounded-md border border-outline-variant bg-surface px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        aria-label="Status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}>
                        <option value="">All statuses</option>
                        <option value="draft">Draft</option>
                        <option value="submitted">Submitted</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <select
                        className="h-10 w-full rounded-md border border-outline-variant bg-surface px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        aria-label="Activity Type"
                        value={electricityActivityType}
                        onChange={(e) => setElectricityActivityType(e.target.value)}>
                        <option value="">All activity types</option>
                        <option value="grid_import">Grid Import</option>
                        <option value="renewable_import">Renewable Import</option>
                        <option value="self_generated">Self Generated</option>
                        <option value="grid_export">Grid Export</option>
                    </select>
                    <select
                        className="h-10 w-full rounded-md border border-outline-variant bg-surface px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        aria-label="Source Type"
                        value={sourceType}
                        onChange={(e) => setSourceType(e.target.value)}>
                        <option value="">All source types</option>
                        <option value="national_grid">National Grid</option>
                        <option value="solar_pv">Solar PV</option>
                        <option value="wind">Wind</option>
                        <option value="hydro">Hydro</option>
                        <option value="diesel_generator">Diesel Generator</option>
                        <option value="gas_generator">Gas Generator</option>
                        <option value="coal_generator">Coal Generator</option>
                        <option value="other_generator">Other Generator</option>
                        <option value="other_renewable">Other Renewable</option>
                    </select>
                    <select
                        className="h-10 w-full rounded-md border border-outline-variant bg-surface px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        aria-label="Data Quality"
                        value={dataQualityTier}
                        onChange={(e) => setDataQualityTier(e.target.value)}>
                        <option value="">All quality tiers</option>
                        <option value="measured">Measured</option>
                        <option value="calculated">Calculated</option>
                        <option value="estimated">Estimated</option>
                    </select>
                    <select
                        className="h-10 w-full rounded-md border border-outline-variant bg-surface px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        aria-label="Facility"
                        value={selectedFacility}
                        onChange={(e) => setSelectedFacility(e.target.value)}>
                        <option value="">All facilities</option>
                        {facilityOptions.map((f) => (
                            <option key={f} value={f}>
                                {f}
                            </option>
                        ))}
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
