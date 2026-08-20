"use client";

import { useState, useMemo } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { CustomSelect, CustomSelectOption } from "@/components/ui/select";
import { FormErrorSummary } from "@/components/ui/FormErrorSummary";
import { useFacilities } from "@/lib/facility/hooks";
import {
    AmendTravelActivityPayload,
    CreateTravelActivityPayload,
    LandFuelType,
    TransportMode,
    TravelActivityEntry,
    TravelTripDto,
} from "@/lib/scope3/travel/types";
import { useCarTypes } from "@/lib/scope3/travel/hooks";

interface Category7FormModalProps {
    isOpen: boolean;
    mode: "create" | "edit" | "amend";
    initialEntry?: TravelActivityEntry | null;
    onClose: () => void;
    onSubmit: (payload: CreateTravelActivityPayload | AmendTravelActivityPayload) => Promise<void>;
    isSubmitting: boolean;
}

export function Category7FormModal({
    isOpen,
    mode,
    initialEntry,
    onClose,
    onSubmit,
    isSubmitting,
}: Category7FormModalProps) {
    const facilitiesQuery = useFacilities();
    const carTypesQuery = useCarTypes();

    const facilities = useMemo(() => facilitiesQuery.data ?? [], [facilitiesQuery.data]);
    const carTypes = useMemo(() => carTypesQuery.data ?? [], [carTypesQuery.data]);

    const isEditOrAmend = (mode === "edit" || mode === "amend") && Boolean(initialEntry);

    const [title, setTitle] = useState(
        () => (isEditOrAmend ? initialEntry?.title || "" : ""),
    );
    const [description, setDescription] = useState(
        () => (isEditOrAmend ? initialEntry?.description || "" : ""),
    );
    const [facilityId, setFacilityId] = useState(
        () => (isEditOrAmend ? initialEntry?.facilityId || "" : ""),
    );
    const [startDate, setStartDate] = useState(
        () => (isEditOrAmend ? initialEntry?.startDate || "2026-01-01" : "2026-01-01"),
    );
    const [endDate, setEndDate] = useState(
        () => (isEditOrAmend ? initialEntry?.endDate || "2026-03-31" : "2026-03-31"),
    );

    const [trips, setTrips] = useState<TravelTripDto[]>(() => {
        if (isEditOrAmend && initialEntry?.trips && initialEntry.trips.length > 0) {
            return initialEntry.trips.map((t, idx) => ({
                trip_order: idx + 1,
                transport_mode: t.transportMode,
                description: t.description,
                distance: t.distance,
                car_type_id: t.carTypeId,
                fuel_type: t.fuelType,
            }));
        }
        return [
            {
                trip_order: 1,
                transport_mode: "LAND",
                description: "Employee Suburban Rail Commute Leg",
                distance: 1420,
                car_type_id: "car-type-rail",
                fuel_type: "general",
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

    function handleAddTrip() {
        setTrips((prev) => [
            ...prev,
            {
                trip_order: prev.length + 1,
                transport_mode: "LAND" as TransportMode,
                description: "Staff Bus / Carpool Commute",
                distance: 250,
                car_type_id: carTypes[0]?.id || "car-type-bus",
                fuel_type: "diesel",
            },
        ]);
    }

    function handleRemoveTrip(index: number) {
        if (trips.length <= 1) {
            alert("An employee commute log must have at least one segment.");
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

        if (!title.trim()) {
            newErrors.title = "Commute title is required (e.g. Q1 Staff Rail Commute).";
        }
        if (!startDate) {
            newErrors.startDate = "Start date is required.";
        }
        if (!endDate) {
            newErrors.endDate = "End date is required.";
        }
        if (trips.length === 0) {
            newErrors.trips = "Please add at least one commute leg.";
        }

        trips.forEach((t, idx) => {
            if (!t.description.trim()) {
                newErrors[`trip_${idx}_desc`] = `Commute Leg #${idx + 1} description is required.`;
            }
            if (!t.distance || t.distance <= 0) {
                newErrors[`trip_${idx}_dist`] = `Commute Leg #${idx + 1} distance in km must be > 0.`;
            }
            if (!t.car_type_id) {
                newErrors[`trip_${idx}_car`] = `Commute Leg #${idx + 1} requires a vehicle / transit selection.`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        const basePayload: CreateTravelActivityPayload = {
            category: "EMPLOYEE_COMMUTING",
            title: title.trim(),
            description: description.trim() || null,
            facility_id: facilityId || null,
            start_date: startDate,
            end_date: endDate,
            status: "submitted",
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
    }

    if (!isOpen) return null;

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
                            7
                        </span>
                        <div>
                            <h3 className="font-mono text-headline-sm font-bold text-primary">
                                {mode === "create"
                                    ? "Log Employee Commute Activity"
                                    : mode === "edit"
                                      ? "Edit Employee Commute Activity"
                                      : "Amend Verified Commute Record"}
                            </h3>
                            <p className="font-mono text-[11px] text-on-surface-variant">
                                Scope 3: Category 7 Employee Commuting (Rail, Bus, Carpool & Personal Vehicles)
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
                                Commute Title <span className="text-error">*</span>
                            </label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Q1 Staff Rail Commute"
                                className="font-mono text-xs font-bold"
                            />
                        </div>

                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Office Facility / Work Site
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
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Commute Period Start Date <span className="text-error">*</span>
                            </label>
                            <DatePicker
                                value={startDate}
                                onChange={setStartDate}
                                className="font-mono text-xs"
                            />
                        </div>

                        <div>
                            <label className="block font-mono text-xs font-semibold text-primary mb-1">
                                Commute Period End Date <span className="text-error">*</span>
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
                            Commute Description / Survey Remarks
                        </label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Aggregated quarterly staff commuting survey results"
                            className="font-mono text-xs"
                        />
                    </div>

                    {/* Commute Legs Builder */}
                    <div className="space-y-3 pt-3 border-t border-outline-variant/40">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
                                    Itemized Commute Legs ({trips.length})
                                </h4>
                                <p className="font-mono text-[10px] text-on-surface-variant">
                                    Add individual transit legs (rail, bus, carpool, personal vehicle).
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddTrip}
                                className="flex items-center gap-1 rounded bg-emerald-50 px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 border border-emerald-200">
                                <MaterialIcon name="add" size="xs" /> Add Commute Leg
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                            {trips.map((trip, idx) => (
                                <div
                                    key={`commute-${idx}`}
                                    className="rounded-xl bg-surface-container-low p-3.5 border border-outline-variant/60 space-y-3 relative">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary/20 text-secondary font-mono text-[10px] font-bold">
                                                #{idx + 1}
                                            </span>
                                            <span className="flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800 uppercase">
                                                <MaterialIcon name="commute" size="xs" /> Commute Transit Leg
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
                                                Commute Leg Description
                                            </label>
                                            <Input
                                                value={trip.description}
                                                onChange={(e) =>
                                                    handleTripChange(idx, { description: e.target.value })
                                                }
                                                placeholder="e.g. Employee Suburban Rail Commute"
                                                className="font-mono text-xs h-8"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-mono text-[10px] font-bold text-on-surface-variant mb-0.5">
                                                Total Distance (km)
                                            </label>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                min="0.1"
                                                value={trip.distance}
                                                onChange={(e) =>
                                                    handleTripChange(idx, { distance: Number(e.target.value) })
                                                }
                                                placeholder="e.g. 1420"
                                                className="font-mono text-xs font-bold h-8"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1 border-t border-outline-variant/30">
                                        <div>
                                            <label className="block font-mono text-[10px] font-bold text-on-surface-variant mb-0.5">
                                                Transit / Vehicle Type
                                            </label>
                                            <CustomSelect
                                                options={carTypeOptions}
                                                value={trip.car_type_id || carTypes[0]?.id || ""}
                                                onChange={(val) => handleTripChange(idx, { car_type_id: val })}
                                                placeholder="Select transit type..."
                                                className="font-mono text-xs"
                                                variant="form"
                                                isSearchable={true}
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-mono text-[10px] font-bold text-on-surface-variant mb-0.5">
                                                Fuel / Energy Type
                                            </label>
                                            <select
                                                value={trip.fuel_type || "diesel"}
                                                onChange={(e) =>
                                                    handleTripChange(idx, {
                                                        fuel_type: e.target.value as LandFuelType,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-mono text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                                <option value="general">General / Public Transit</option>
                                                <option value="diesel">Diesel</option>
                                                <option value="petrol">Petrol / Gasoline</option>
                                                <option value="hybrid">Hybrid</option>
                                                <option value="bev">Battery Electric (BEV)</option>
                                                <option value="phev">Plug-in Hybrid (PHEV)</option>
                                                <option value="cng">CNG</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/40">
                        <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                            {isSubmitting
                                ? "Saving..."
                                : mode === "create"
                                  ? "Create Commute Record"
                                  : mode === "edit"
                                    ? "Update Record"
                                    : "Save Amended Record"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
