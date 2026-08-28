"use client";

import { useState, useMemo, useRef } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { CustomSelect, CustomSelectOption } from "@/components/ui/select";
import { FormErrorSummary } from "@/components/ui/FormErrorSummary";
import { useFacilities } from "@/lib/facility/hooks";
import { useReportingPeriods } from "@/lib/reportingPeriods/hooks";
import {
    AirCabinClass,
    AirHaulType,
    AmendTravelActivityPayload,
    CreateTravelActivityPayload,
    LandFuelType,
    SeaPassengerType,
    TransportMode,
    TravelActivityEntry,
    TravelTripDto,
} from "@/lib/scope3/travel/types";
import {
    useAirCabinClasses,
    useAirHaulTypes,
    useCarTypes,
    useSeaPassengerTypes,
} from "@/lib/scope3/travel/hooks";

interface Category6FormModalProps {
    isOpen: boolean;
    mode: "create" | "edit" | "amend";
    initialEntry?: TravelActivityEntry | null;
    onClose: () => void;
    onSubmit: (payload: CreateTravelActivityPayload | AmendTravelActivityPayload) => Promise<void>;
    isSubmitting: boolean;
}

export function Category6FormModal({
    isOpen,
    mode,
    initialEntry,
    onClose,
    onSubmit,
    isSubmitting,
}: Category6FormModalProps) {
    const facilitiesQuery = useFacilities();
    const carTypesQuery = useCarTypes();
    const airHaulTypesQuery = useAirHaulTypes();
    const airCabinClassesQuery = useAirCabinClasses();
    const seaPassengerTypesQuery = useSeaPassengerTypes();
    const reportingPeriodsQuery = useReportingPeriods();

    const facilities = useMemo(() => facilitiesQuery.data ?? [], [facilitiesQuery.data]);
    const carTypes = useMemo(() => carTypesQuery.data ?? [], [carTypesQuery.data]);
    const airHaulTypes = useMemo(() => airHaulTypesQuery.data ?? [], [airHaulTypesQuery.data]);
    const airCabinClasses = useMemo(() => airCabinClassesQuery.data ?? [], [airCabinClassesQuery.data]);
    const seaPassengerTypes = useMemo(() => seaPassengerTypesQuery.data ?? [], [seaPassengerTypesQuery.data]);
    const periods = useMemo(() => reportingPeriodsQuery.data ?? [], [reportingPeriodsQuery.data]);

    const isEditOrAmend = (mode === "edit" || mode === "amend") && Boolean(initialEntry);

    const [submitting, setSubmitting] = useState(false);
    const submittingRef = useRef(false);

    const [title, setTitle] = useState(
        () => (isEditOrAmend ? initialEntry?.title || "" : ""),
    );
    const [description, setDescription] = useState(
        () => (isEditOrAmend ? initialEntry?.description || "" : ""),
    );
    const [reportingPeriodId, setReportingPeriodId] = useState(
        () => (isEditOrAmend ? initialEntry?.reportingPeriodId || periods[0]?.id || "" : periods[0]?.id || ""),
    );
    const [facilityId, setFacilityId] = useState(
        () => (isEditOrAmend ? initialEntry?.facilityId || "" : ""),
    );
    const [startDate, setStartDate] = useState(
        () => (isEditOrAmend ? initialEntry?.startDate || "2026-03-10" : "2026-03-10"),
    );
    const [endDate, setEndDate] = useState(
        () => (isEditOrAmend ? initialEntry?.endDate || "2026-03-15" : "2026-03-15"),
    );

    // Initial trips builder state
    const [trips, setTrips] = useState<TravelTripDto[]>(() => {
        if (isEditOrAmend && initialEntry?.trips && initialEntry.trips.length > 0) {
            return initialEntry.trips.map((t, idx) => ({
                trip_order: idx + 1,
                transport_mode: t.transportMode,
                description: t.description,
                distance: t.distance,
                car_type_id: t.carTypeId,
                fuel_type: t.fuelType,
                haul_type: t.haulType,
                cabin_class: t.cabinClass,
                include_rf: t.includeRf,
                passenger_type: t.passengerType,
            }));
        }
        return [
            {
                trip_order: 1,
                transport_mode: "AIR",
                description: "Flight Segment (LHR to JFK)",
                distance: 5550,
                haul_type: "Long-haul",
                cabin_class: "Business class",
                include_rf: true,
            },
        ];
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const carTypeOptions: CustomSelectOption[] = useMemo(
        () =>
            carTypes.map((c) => ({
                value: c.id,
                label: `${c.name} (${c.activity_category})`,
            })),
        [carTypes],
    );

    function handleAddTrip(modeType: TransportMode) {
        setTrips((prev) => [
            ...prev,
            {
                trip_order: prev.length + 1,
                transport_mode: modeType,
                description:
                    modeType === "LAND"
                        ? "Airport Taxi / Ground Shuttle"
                        : modeType === "AIR"
                          ? "Connecting Flight Leg"
                          : "Ferry Crossing",
                distance: modeType === "LAND" ? 35 : modeType === "AIR" ? 1500 : 80,
                car_type_id: carTypes[0]?.id || "8d0bbc29-5c0b-45ea-8f97-24d7e6b90df7",
                fuel_type: "diesel",
                haul_type: "Short-haul",
                cabin_class: "Economy class",
                include_rf: true,
                passenger_type: "Foot passenger",
            },
        ]);
    }

    function handleRemoveTrip(index: number) {
        if (trips.length <= 1) {
            alert("A journey must have at least one trip segment.");
            return;
        }
        setTrips((prev) =>
            prev
                .filter((_, i) => i !== index)
                .map((t, idx) => ({ ...t, trip_order: idx + 1 })),
        );
    }

    function handleTripChange(index: number, fields: Partial<TravelTripDto>) {
        setTrips((prev) =>
            prev.map((t, i) => (i === index ? { ...t, ...fields } : t)),
        );
    }

    function validate() {
        const newErrors: Record<string, string> = {};

        const activePeriodId = reportingPeriodId || periods[0]?.id;
        if (!activePeriodId) {
            newErrors.reportingPeriodId = "Reporting period is required.";
        }
        if (!title.trim()) {
            newErrors.title = "Journey title is required (e.g. Global Sales Summit Q1).";
        }
        if (!startDate) {
            newErrors.startDate = "Start date is required.";
        }
        if (!endDate) {
            newErrors.endDate = "End date is required.";
        }
        if (trips.length === 0) {
            newErrors.trips = "Please add at least one trip segment to this journey.";
        }

        trips.forEach((t, idx) => {
            if (!t.description.trim()) {
                newErrors[`trip_${idx}_desc`] = `Trip #${idx + 1} description is required.`;
            }
            if (!t.distance || t.distance <= 0) {
                newErrors[`trip_${idx}_dist`] = `Trip #${idx + 1} distance in km must be > 0.`;
            }
            if (t.transport_mode === "LAND" && !t.car_type_id) {
                newErrors[`trip_${idx}_car`] = `Trip #${idx + 1} requires a car / vehicle type selection.`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (submittingRef.current || isSubmitting || submitting) return;

        if (!validate()) return;

        submittingRef.current = true;
        setSubmitting(true);

        try {
            const basePayload: CreateTravelActivityPayload = {
                category: "BUSINESS_TRAVEL",
                title: title.trim(),
                description: description.trim() || null,
                facility_id: facilityId || null,
                reporting_period_id: reportingPeriodId || periods[0]?.id || null,
                start_date: startDate,
                end_date: endDate,
                status: "draft",
                trips: trips.map((t, idx) => ({
                    ...t,
                    trip_order: idx + 1,
                })),
            };

            if (mode === "amend" && initialEntry) {
                const amendPayload: AmendTravelActivityPayload = {
                    ...basePayload,
                    amended_from_id: initialEntry.id,
                };
                await onSubmit(amendPayload);
            } else {
                await onSubmit(basePayload);
            }
        } finally {
            submittingRef.current = false;
            setSubmitting(false);
        }
    }

    if (!isOpen) return null;

    const busy = isSubmitting || submitting;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 max-h-[90vh] flex flex-col my-auto">
                <div className="flex items-center justify-between border-b border-outline-variant/60 px-6 py-4 bg-surface-container-low/80">
                    <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-on-secondary font-mono text-xs font-bold">
                            6
                        </span>
                        <div>
                            <h3 className="font-mono text-headline-sm font-bold text-primary">
                                {mode === "create"
                                    ? "Log Business Travel Journey"
                                    : mode === "edit"
                                      ? "Edit Business Travel Journey"
                                      : "Amend Verified Business Travel Record"}
                            </h3>
                            <p className="font-mono text-[11px] text-on-surface-variant">
                                Scope 3: Category 6 Business Travel (Multi-Modal Flight, Taxi, Rail & Ferry Builder)
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container-high transition-colors">
                        <MaterialIcon name="close" size="sm" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
                    <FormErrorSummary errors={errors} />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Reporting Period <span className="text-error">*</span>
                            </label>
                            <select
                                value={reportingPeriodId || (periods[0]?.id ?? "")}
                                onChange={(e) => setReportingPeriodId(e.target.value)}
                                className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-mono text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                {periods.length === 0 && <option value="">Loading reporting periods...</option>}
                                {periods.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} ({p.reportingYear})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Journey Title <span className="text-error">*</span>
                            </label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Global Sales Summit Q1"
                                className="font-mono text-xs font-bold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Facility / Site (Optional)
                            </label>
                            <select
                                value={facilityId}
                                onChange={(e) => setFacilityId(e.target.value)}
                                className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-mono text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                <option value="">No specific facility (Corporate level)</option>
                                {facilities.map((fac) => (
                                    <option key={fac.id} value={fac.id}>
                                        {fac.name} ({fac.facilityCode})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Travel Start Date <span className="text-error">*</span>
                            </label>
                            <DatePicker
                                value={startDate}
                                onChange={setStartDate}
                                className="font-mono text-xs"
                            />
                        </div>

                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Travel Return / End Date <span className="text-error">*</span>
                            </label>
                            <DatePicker
                                value={endDate}
                                onChange={setEndDate}
                                className="font-mono text-xs"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-mono text-xs font-semibold text-primary mb-1">
                            Journey Description / Purpose
                        </label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Executive team client meetings in London & New York"
                            className="font-mono text-xs"
                        />
                    </div>

                    {/* Multi-modal Trip Segments Builder */}
                    <div className="space-y-3 pt-3 border-t border-outline-variant/40">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
                                    Itemized Journey Trip Segments ({trips.length})
                                </h4>
                                <p className="font-mono text-[10px] text-on-surface-variant">
                                    Add individual land, air, or sea legs for this travel activity.
                                </p>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => handleAddTrip("AIR")}
                                    className="flex items-center gap-1 rounded bg-sky-50 px-2 py-1 font-mono text-[11px] font-bold text-sky-700 hover:bg-sky-100 border border-sky-200">
                                    <MaterialIcon name="add" size="xs" /> Flight Leg
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAddTrip("LAND")}
                                    className="flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 font-mono text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 border border-emerald-200">
                                    <MaterialIcon name="add" size="xs" /> Land Leg
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAddTrip("SEA")}
                                    className="flex items-center gap-1 rounded bg-indigo-50 px-2 py-1 font-mono text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 border border-indigo-200">
                                    <MaterialIcon name="add" size="xs" /> Sea Ferry
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                            {trips.map((trip, idx) => (
                                <div
                                    key={`trip-${idx}`}
                                    className="rounded-xl bg-surface-container-low p-3.5 border border-outline-variant/60 space-y-3 relative">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary/20 text-secondary font-mono text-[10px] font-bold">
                                                #{idx + 1}
                                            </span>
                                            <span
                                                className={`flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                                                    trip.transport_mode === "AIR"
                                                        ? "bg-sky-100 text-sky-800"
                                                        : trip.transport_mode === "LAND"
                                                          ? "bg-emerald-100 text-emerald-800"
                                                          : "bg-indigo-100 text-indigo-800"
                                                }`}>
                                                <MaterialIcon
                                                    name={
                                                        trip.transport_mode === "AIR"
                                                            ? "flight"
                                                            : trip.transport_mode === "LAND"
                                                              ? "directions_car"
                                                              : "directions_boat"
                                                    }
                                                    size="xs"
                                                />
                                                {trip.transport_mode} Mode
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTrip(idx)}
                                            className="text-on-surface-variant hover:text-error transition-colors p-1">
                                            <MaterialIcon name="delete" size="xs" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        <div className="sm:col-span-2">
                                            <label className="block font-mono text-[10px] font-bold text-on-surface-variant mb-0.5">
                                                Trip Segment Description
                                            </label>
                                            <Input
                                                value={trip.description}
                                                onChange={(e) =>
                                                    handleTripChange(idx, { description: e.target.value })
                                                }
                                                placeholder="e.g. Flight London Heathrow to JFK Airport"
                                                className="font-mono text-xs h-8"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-mono text-[10px] font-bold text-on-surface-variant mb-0.5">
                                                Distance (km)
                                            </label>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                min="0.1"
                                                value={trip.distance}
                                                onChange={(e) =>
                                                    handleTripChange(idx, { distance: Number(e.target.value) })
                                                }
                                                placeholder="e.g. 5550"
                                                className="font-mono text-xs font-bold h-8"
                                            />
                                        </div>
                                    </div>

                                    {/* Mode-specific factor selectors */}
                                    {trip.transport_mode === "LAND" && (
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1 border-t border-outline-variant/30">
                                            <div>
                                                <label className="block font-mono text-[10px] font-bold text-on-surface-variant mb-0.5">
                                                    Vehicle / Car Type
                                                </label>
                                                <CustomSelect
                                                    options={carTypeOptions}
                                                    value={trip.car_type_id || carTypes[0]?.id || ""}
                                                    onChange={(val) => handleTripChange(idx, { car_type_id: val })}
                                                    placeholder="Select vehicle type..."
                                                    className="font-mono text-xs"
                                                    variant="form"
                                                    isSearchable={true}
                                                />
                                            </div>

                                            <div>
                                                <label className="block font-mono text-[10px] font-bold text-on-surface-variant mb-0.5">
                                                    Fuel Type
                                                </label>
                                                <select
                                                    value={trip.fuel_type || "diesel"}
                                                    onChange={(e) =>
                                                        handleTripChange(idx, {
                                                            fuel_type: e.target.value as LandFuelType,
                                                        })
                                                    }
                                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-mono text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                                    <option value="diesel">Diesel</option>
                                                    <option value="petrol">Petrol / Gasoline</option>
                                                    <option value="hybrid">Hybrid Vehicle</option>
                                                    <option value="bev">Battery Electric Vehicle (BEV)</option>
                                                    <option value="phev">Plug-in Hybrid (PHEV)</option>
                                                    <option value="cng">CNG (Compressed Natural Gas)</option>
                                                    <option value="lpg">LPG</option>
                                                    <option value="general">General Average Fuel</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    {trip.transport_mode === "AIR" && (
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-1 border-t border-outline-variant/30">
                                            <div>
                                                <label className="block font-mono text-[10px] font-bold text-on-surface-variant mb-0.5">
                                                    Flight Haul Type
                                                </label>
                                                <select
                                                    value={trip.haul_type || "Long-haul"}
                                                    onChange={(e) =>
                                                        handleTripChange(idx, {
                                                            haul_type: e.target.value as AirHaulType,
                                                        })
                                                    }
                                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-mono text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                                    {airHaulTypes.map((h) => (
                                                        <option key={h} value={h}>
                                                            {h} Flight
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block font-mono text-[10px] font-bold text-on-surface-variant mb-0.5">
                                                    Flight Cabin Class
                                                </label>
                                                <select
                                                    value={trip.cabin_class || "Business class"}
                                                    onChange={(e) =>
                                                        handleTripChange(idx, {
                                                            cabin_class: e.target.value as AirCabinClass,
                                                        })
                                                    }
                                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-mono text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                                    {airCabinClasses.map((c) => (
                                                        <option key={c} value={c}>
                                                            {c}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="flex items-center pt-3">
                                                <label className="flex items-center gap-2 font-mono text-xs font-semibold text-primary cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={trip.include_rf ?? true}
                                                        onChange={(e) =>
                                                            handleTripChange(idx, { include_rf: e.target.checked })
                                                        }
                                                        className="h-4 w-4 rounded border-outline-variant text-secondary focus:ring-secondary"
                                                    />
                                                    <span>Include Radiative Forcing (RF)</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {trip.transport_mode === "SEA" && (
                                        <div className="pt-1 border-t border-outline-variant/30">
                                            <label className="block font-mono text-[10px] font-bold text-on-surface-variant mb-0.5">
                                                Ferry Passenger Type
                                            </label>
                                            <select
                                                value={trip.passenger_type || "Foot passenger"}
                                                onChange={(e) =>
                                                    handleTripChange(idx, {
                                                        passenger_type: e.target.value as SeaPassengerType,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-mono text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                                {seaPassengerTypes.map((p) => (
                                                    <option key={p} value={p}>
                                                        {p}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/40">
                        <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={busy}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="md" disabled={busy}>
                            {busy
                                ? "Saving..."
                                : mode === "create"
                                  ? "Create Travel Journey"
                                  : mode === "edit"
                                    ? "Update Journey"
                                    : "Save Amended Record"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
