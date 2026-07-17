"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { FuelActivitySummary } from "@/components/activity/FuelActivitySummary";
import { FuelActivityTable } from "@/components/activity/FuelActivityTable";
import { useFuelActivities } from "@/lib/activity/hooks";
import { useFacilities } from "@/lib/facility/hooks";

export default function FuelActivitiesPage() {
    const [status, setStatus] = useState("");
    const [emissionType, setEmissionType] = useState("");
    const [selectedFacility, setSelectedFacility] = useState("");
    const [selectedFuel, setSelectedFuel] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const filterParams = useMemo(
        () => ({
            status: status || undefined,
            emission_type: emissionType || undefined,
            facility_id: selectedFacility || undefined,
        }),
        [status, emissionType, selectedFacility],
    );

    const { data: activities = [], isPending, isError } = useFuelActivities(filterParams);

    const { data: facilities = [] } = useFacilities();

    const facilityOptions = useMemo(() => facilities.map((f) => ({ id: f.id, name: f.name })), [facilities]);

    const fuelOptions = useMemo(
        () => Array.from(new Set(activities.map((activity) => activity.fuelName))).sort(),
        [activities],
    );

    function handleRefresh() {
        setStatus("");
        setEmissionType("");
        setSelectedFacility("");
        setSelectedFuel("");
    }

    const filteredActivities = useMemo(() => {
        return activities.filter((activity) => {
            const matchesFuel = !selectedFuel || activity.fuelName === selectedFuel;
            return matchesFuel;
        });
    }, [activities, selectedFuel]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Fuel Activity Log</h2>
                    <p className="mt-1 text-body-md text-on-surface-variant">
                        Review, filter and manage fuel activity emissions with quick access to new entries.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" size="md" onClick={() => setShowFilters((s) => !s)}>
                        <MaterialIcon name="filter_list" size="sm" />
                        Filter
                    </Button>
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            className="bg-primary text-on-primary px-6 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity rounded shadow-sm"
                        >
                            <span className="font-label-md text-label-md uppercase">New Fuel Activity</span>
                            <MaterialIcon name="arrow_drop_down" size="sm" className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setDropdownOpen(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-56 rounded-lg border border-outline-variant bg-white p-1.5 shadow-lg z-20"
                                    >
                                        <Link href="/activities/fuel/create">
                                            <button
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                                            >
                                                <MaterialIcon name="description" size="sm" className="text-primary" />
                                                <span className="font-medium">Individual Entry</span>
                                            </button>
                                        </Link>
                                        <Link href="/activities/fuel/bulk">
                                            <button
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                                            >
                                                <MaterialIcon name="upload_file" size="sm" className="text-primary" />
                                                <span className="font-medium">Bulk Upload (Excel)</span>
                                            </button>
                                        </Link>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
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
                        aria-label="Facility"
                        value={selectedFacility}
                        onChange={(e) => setSelectedFacility(e.target.value)}>
                        <option value="">All facilities</option>
                        {facilityOptions.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="h-10 w-full rounded-md border border-outline-variant bg-surface px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        aria-label="Emission type"
                        value={emissionType}
                        onChange={(e) => setEmissionType(e.target.value)}>
                        <option value="">All emission types</option>
                        <option value="stationary">Stationary</option>
                        <option value="mobile">Mobile</option>
                        <option value="process">Process</option>
                        <option value="fugitive">Fugitive</option>
                    </select>
                    <select
                        className="h-10 w-full rounded-md border border-outline-variant bg-surface px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        aria-label="Fuel"
                        value={selectedFuel}
                        onChange={(e) => setSelectedFuel(e.target.value)}>
                        <option value="">All fuels</option>
                        {fuelOptions.map((f) => (
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

            <FuelActivitySummary activities={filteredActivities} />

            <FuelActivityTable
                activities={filteredActivities}
                isLoading={isPending}
                isError={isError}
                selectedFacility={selectedFacility}
                selectedFuel={selectedFuel}
                status={status}
                emissionType={emissionType}
                showFilters={showFilters}
                onToggleFilters={setShowFilters}
                onFacilityChange={setSelectedFacility}
                onFuelChange={setSelectedFuel}
                onStatusChange={setStatus}
                onEmissionTypeChange={setEmissionType}
                facilityOptions={facilityOptions}
                fuelOptions={fuelOptions}
            />
        </div>
    );
}
