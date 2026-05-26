"use client";

import { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import Select from "react-select";
import { LuPlus, LuSparkles, LuX, LuDatabase, LuFilter, LuZap, LuFactory } from "react-icons/lu";
import { Sidebar } from "@/components/dashboard/SidebarShell";
import {
    useCreateScope2EnergyActivityMutation,
    useScope2EnergyActivitiesQuery,
    useEmissionFactorSourcesQuery,
    useFacilitiesQuery,
    useFuelCategoriesQuery,
    useFuelUnitsQuery,
    useFuelsQuery,
} from "@/lib/report/hooks";
import { useSidebarStore } from "@/lib/sidebarStore";
import type { ApiErrorBody } from "@/types/api/common";
import type { CreateScope2EnergyActivityRequest, Scope2EnergyActivity } from "@/types/report";

interface EnergyActivityFormState {
    facility_id: string | null;
    source_id: string | null;
    fuel_id: string | null;
    quantity: string;
    quantity_unit_id: string | null;
    activity_date: string;
}

const selectStylesLight = {
    control: (base: any) => ({
        ...base,
        height: "44px",
        minHeight: "44px",
        borderRadius: "12px",
        borderColor: "#e2e8f0",
        backgroundColor: "#f8fafc",
        fontSize: "14px",
        fontWeight: "500",
        color: "#1e293b",
        boxShadow: "none",
        "&:hover": {
            borderColor: "#cbd5e1",
        },
    }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isSelected ? "#10b981" : state.isFocused ? "#f1f5f9" : "white",
        color: state.isSelected ? "white" : "#1e293b",
        cursor: "pointer",
        "&:active": {
            backgroundColor: "#10b981",
        },
    }),
    menuList: (base: any) => ({
        ...base,
        borderRadius: "12px",
        maxHeight: "300px",
    }),
    menuPortal: (base: any) => ({
        ...base,
        zIndex: 9999,
    }),
};

function formatDate(dateString: string): string {
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) {
        return dateString;
    }
    return parsed.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function formatQuantity(value: string | number): string {
    const num = Number(value);
    return Number.isNaN(num) ? "-" : num.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function Scope2EnergyActivityPage() {
    const sidebarOpen = useSidebarStore((s) => s.isOpen);
    const setActiveSection = useSidebarStore((s) => s.setActiveSection);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [selectedFuelId, setSelectedFuelId] = useState<string | null>(null);

    const {
        data: activities = [],
        isLoading: isLoadingActivities,
        isError: isErrorActivities,
    } = useScope2EnergyActivitiesQuery();
    const { data: facilities = [], isLoading: isLoadingFacilities } = useFacilitiesQuery(isModalOpen);
    const { data: sources = [], isLoading: isLoadingSources } = useEmissionFactorSourcesQuery(isModalOpen);
    const { data: categories = [], isLoading: isLoadingCategories } = useFuelCategoriesQuery(isModalOpen);
    const { data: fuels = [], isLoading: isLoadingFuels } = useFuelsQuery(
        selectedCategoryId || undefined,
        isModalOpen && !!selectedCategoryId,
    );
    const { data: units = [], isLoading: isLoadingUnits } = useFuelUnitsQuery(
        selectedFuelId || undefined,
        isModalOpen && !!selectedFuelId,
    );
    const createEnergyActivityMutation = useCreateScope2EnergyActivityMutation();

    const [formState, setFormState] = useState<EnergyActivityFormState>({
        facility_id: null,
        source_id: null,
        fuel_id: null,
        quantity: "",
        quantity_unit_id: null,
        activity_date: new Date().toISOString().slice(0, 7),
    });

    useEffect(() => {
        setActiveSection("scope-2");
        setIsMounted(true);
    }, [setActiveSection]);

    const facilityOptions = useMemo(
        () => facilities.map((facility) => ({ label: facility.name, value: facility.id })),
        [facilities],
    );

    const sourceOptions = useMemo(
        () =>
            sources.map((source) => ({
                label: `${source.standard} ${source.version} (${source.region})`,
                value: source.id,
            })),
        [sources],
    );

    const categoryOptions = useMemo(
        () => categories.map((category) => ({ label: category.name, value: category.id })),
        [categories],
    );

    const fuelOptions = useMemo(() => fuels.map((fuel) => ({ label: fuel.name, value: fuel.id })), [fuels]);

    const unitOptions = useMemo(
        () => units.map((unit) => ({ label: `${unit.name} (${unit.symbol})`, value: unit.id })),
        [units],
    );

    const energyStats = useMemo(() => {
        const totalQuantity = activities.reduce((sum, activity) => sum + Number(activity.quantity || 0), 0);
        const totalTonnes = activities.reduce(
            (sum, activity) => sum + Number(activity.calculated_tonnes || activity.calculated_emissions?.tonnes || 0),
            0,
        );
        const totalGJ = activities.reduce(
            (sum, activity) => sum + Number(activity.energy_gj || activity.calculated_emissions?.energy_gj || 0),
            0,
        );
        return { totalQuantity, totalTonnes, totalGJ, totalCount: activities.length };
    }, [activities]);

    const handleResetForm = () => {
        setFormState({
            facility_id: null,
            source_id: null,
            fuel_id: null,
            quantity: "",
            quantity_unit_id: null,
            activity_date: new Date().toISOString().slice(0, 7),
        });
        setSelectedCategoryId(null);
        setSelectedFuelId(null);
        setSubmitError(null);
    };

    const handleOpenModal = () => {
        handleResetForm();
        setSubmitSuccess(null);
        setIsModalOpen(true);
    };

    async function handleSubmitForm(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitError(null);

        if (!formState.facility_id) {
            setSubmitError("Please select a facility.");
            return;
        }
        if (!formState.source_id) {
            setSubmitError("Please select a source.");
            return;
        }
        if (!formState.fuel_id) {
            setSubmitError("Please select a fuel.");
            return;
        }
        if (!formState.quantity || Number(formState.quantity) <= 0) {
            setSubmitError("Please enter a valid quantity.");
            return;
        }
        if (!formState.quantity_unit_id) {
            setSubmitError("Please select a unit.");
            return;
        }
        if (!formState.activity_date) {
            setSubmitError("Please choose an activity month.");
            return;
        }

        try {
            const payload: CreateScope2EnergyActivityRequest = {
                fuel_id: formState.fuel_id!,
                quantity: Number(formState.quantity),
                unit_id: formState.quantity_unit_id!,
                source_id: formState.source_id!,
                activity_date: `${formState.activity_date}-01`,
            };
            await createEnergyActivityMutation.mutateAsync(payload);
            setSubmitSuccess("Energy activity added successfully.");
            setIsModalOpen(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                const body = error.response?.data as ApiErrorBody | undefined;
                setSubmitError(body?.response ?? body?.message ?? "Failed to add energy activity.");
            } else {
                setSubmitError("Failed to add energy activity.");
            }
        }
    }

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50/50 text-slate-900">
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-emerald-400/15 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] h-[60%] w-[60%] rounded-full bg-teal-300/15 blur-[150px]" />
            </div>

            <Sidebar />

            <main
                className={[
                    "gl-main-offset relative z-10 px-3 pb-8 pt-16 sm:px-4 lg:pr-8 lg:pt-8",
                    !sidebarOpen ? "gl-main-offset--collapsed" : "",
                ].join(" ")}>
                <div className="mx-auto w-full max-w-[1600px] overflow-hidden">
                    <header className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-start">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-white/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-900 shadow-sm backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                </span>
                                Scope-2 energy activity
                            </div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                                Energy Activity
                            </h1>
                            <p className="max-w-2xl text-sm font-medium text-slate-500">
                                Record and review indirect energy activity using facility, source, fuel, category and
                                unit selections.
                            </p>
                        </div>

                        <div className="flex w-full flex-col items-stretch gap-3 md:w-auto md:items-end">
                            <button
                                type="button"
                                onClick={handleOpenModal}
                                className="group inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] md:w-auto">
                                <LuPlus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                                Add energy activity
                            </button>
                        </div>
                    </header>

                    <AnimatePresence>
                        {submitSuccess && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-5 overflow-hidden">
                                <div className="rounded-2xl border border-emerald-200/50 bg-emerald-50/80 px-4 py-3 text-xs font-medium text-emerald-800 backdrop-blur-md">
                                    <span className="font-bold">Success:</span> {submitSuccess}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isLoadingActivities ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {[...Array(4)].map((_, index) => (
                                <div
                                    key={index}
                                    className="h-28 animate-pulse rounded-2xl bg-white/40 backdrop-blur-md"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {[
                                {
                                    label: "Activities",
                                    value: energyStats.totalCount.toString(),
                                    icon: LuDatabase,
                                },
                                {
                                    label: "Total tonnes",
                                    value: formatQuantity(energyStats.totalTonnes),
                                    icon: LuZap,
                                },
                                {
                                    label: "Total energy (GJ)",
                                    value: formatQuantity(energyStats.totalGJ),
                                    icon: LuSparkles,
                                },
                            ].map((stat) => {
                                const IconComponent = stat.icon;
                                return (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35 }}
                                        className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 opacity-50 blur-2xl" />
                                        <div className="relative flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">
                                                    {stat.label}
                                                </p>
                                                <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
                                            </div>
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
                                                <IconComponent className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    <div className="mt-5 rounded-2xl border border-white/60 bg-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                        <div className="mb-4 border-b border-slate-200/50 pb-3">
                            <h2 className="text-base font-bold text-slate-800 sm:text-lg">Energy activity records</h2>
                            <p className="mt-1 text-[11px] font-medium text-slate-500">
                                {activities.length} record{activities.length !== 1 ? "s" : ""} found.
                            </p>
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/60 shadow-inner">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[960px] text-left text-xs">
                                    <thead className="bg-slate-50/50">
                                        <tr className="border-b border-slate-200/60 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                            <th className="px-3 py-2">Fuel</th>
                                            <th className="px-3 py-2">Quantity</th>
                                            <th className="px-3 py-2">Unit</th>
                                            <th className="px-3 py-2">Source</th>
                                            <th className="px-3 py-2">Activity Date</th>
                                            <th className="px-3 py-2">Tonnes</th>
                                            <th className="px-3 py-2">Energy (GJ)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {isLoadingActivities ? (
                                            <tr>
                                                <td
                                                    colSpan={7}
                                                    className="px-4 py-8 text-center text-sm text-slate-500">
                                                    Loading energy activities...
                                                </td>
                                            </tr>
                                        ) : activities.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={7}
                                                    className="px-4 py-12 text-center text-sm text-slate-500">
                                                    No energy activity recorded yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            activities.map((activity) => (
                                                <tr
                                                    key={activity.id}
                                                    className="transition-colors hover:bg-slate-50/50">
                                                    <td className="px-3 py-2 text-slate-600">
                                                        {activity.fuel?.name ?? "—"}
                                                    </td>
                                                    <td className="px-3 py-2 text-slate-700">
                                                        {formatQuantity(activity.quantity)}
                                                    </td>
                                                    <td className="px-3 py-2 text-slate-600">
                                                        {activity.quantity_unit?.symbol ?? "—"}
                                                    </td>
                                                    <td className="px-3 py-2 text-slate-600">
                                                        {activity.source
                                                            ? `${activity.source.standard} ${activity.source.version}`
                                                            : "—"}
                                                    </td>
                                                    <td className="px-3 py-2 text-slate-600">
                                                        {formatDate(activity.activity_date)}
                                                    </td>
                                                    <td className="px-3 py-2 font-semibold text-slate-800">
                                                        {formatQuantity(
                                                            activity.calculated_tonnes ||
                                                                activity.calculated_emissions?.tonnes ||
                                                                "0",
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 font-semibold text-slate-800">
                                                        {formatQuantity(
                                                            activity.energy_gj ||
                                                                activity.calculated_emissions?.energy_gj ||
                                                                "0",
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:p-6">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="scrollbar-thin max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/50 bg-white p-6 shadow-2xl sm:p-8">
                            <div className="mb-8 flex items-start justify-between gap-4">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-emerald-700">
                                        <LuSparkles className="h-3.5 w-3.5" />
                                        Manual entry
                                    </div>
                                    <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900">
                                        Add Scope-2 Energy Activity
                                    </h3>
                                    <p className="mt-1 text-sm font-medium text-slate-500">
                                        Choose facility, source, category, fuel and unit to record a new activity.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
                                    <LuX className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitForm} className="grid gap-5 sm:grid-cols-2">
                                <FormField label="Facility *">
                                    {isMounted && !isLoadingFacilities ? (
                                        <Select
                                            menuPortalTarget={document.body}
                                            options={facilityOptions}
                                            value={
                                                formState.facility_id
                                                    ? facilityOptions.find((opt) => opt.value === formState.facility_id)
                                                    : null
                                            }
                                            onChange={(opt) =>
                                                setFormState((p) => ({ ...p, facility_id: opt?.value ?? null }))
                                            }
                                            placeholder="Select facility..."
                                            styles={selectStylesLight}
                                        />
                                    ) : (
                                        <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
                                    )}
                                </FormField>

                                <FormField label="Source *">
                                    {isMounted && !isLoadingSources ? (
                                        <Select
                                            menuPortalTarget={document.body}
                                            options={sourceOptions}
                                            value={
                                                formState.source_id
                                                    ? sourceOptions.find((opt) => opt.value === formState.source_id)
                                                    : null
                                            }
                                            onChange={(opt) =>
                                                setFormState((p) => ({ ...p, source_id: opt?.value ?? null }))
                                            }
                                            placeholder="Select source..."
                                            styles={selectStylesLight}
                                        />
                                    ) : (
                                        <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
                                    )}
                                </FormField>

                                <FormField label="Fuel Category *">
                                    {isMounted && !isLoadingCategories ? (
                                        <Select
                                            menuPortalTarget={document.body}
                                            options={categoryOptions}
                                            value={
                                                selectedCategoryId
                                                    ? categoryOptions.find((opt) => opt.value === selectedCategoryId)
                                                    : null
                                            }
                                            onChange={(opt) => {
                                                setSelectedCategoryId(opt?.value ?? null);
                                                setSelectedFuelId(null);
                                                setFormState((p) => ({ ...p, fuel_id: null, quantity_unit_id: null }));
                                            }}
                                            placeholder="Select category..."
                                            styles={selectStylesLight}
                                        />
                                    ) : (
                                        <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
                                    )}
                                </FormField>

                                <FormField label="Fuel *">
                                    {isMounted && !isLoadingFuels ? (
                                        <Select
                                            menuPortalTarget={document.body}
                                            options={fuelOptions}
                                            value={
                                                formState.fuel_id
                                                    ? fuelOptions.find((opt) => opt.value === formState.fuel_id)
                                                    : null
                                            }
                                            onChange={(opt) => {
                                                setSelectedFuelId(opt?.value ?? null);
                                                setFormState((p) => ({
                                                    ...p,
                                                    fuel_id: opt?.value ?? null,
                                                    quantity_unit_id: null,
                                                }));
                                            }}
                                            isDisabled={!selectedCategoryId}
                                            placeholder="Select fuel..."
                                            styles={{
                                                ...selectStylesLight,
                                                control: (base: any) => ({
                                                    ...selectStylesLight.control(base),
                                                    opacity: !selectedCategoryId ? 0.5 : 1,
                                                    cursor: !selectedCategoryId ? "not-allowed" : "pointer",
                                                }),
                                            }}
                                        />
                                    ) : (
                                        <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
                                    )}
                                </FormField>

                                <FormField label="Quantity *">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="Enter quantity"
                                        value={formState.quantity}
                                        onChange={(e) => setFormState((p) => ({ ...p, quantity: e.target.value }))}
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-800 outline-none transition-all hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                    />
                                </FormField>

                                <FormField label="Unit *">
                                    {isMounted && !isLoadingUnits ? (
                                        <Select
                                            menuPortalTarget={document.body}
                                            options={unitOptions}
                                            value={
                                                formState.quantity_unit_id
                                                    ? unitOptions.find(
                                                          (opt) => opt.value === formState.quantity_unit_id,
                                                      )
                                                    : null
                                            }
                                            onChange={(opt) =>
                                                setFormState((p) => ({ ...p, quantity_unit_id: opt?.value ?? null }))
                                            }
                                            isDisabled={!selectedFuelId}
                                            placeholder="Select unit..."
                                            styles={{
                                                ...selectStylesLight,
                                                control: (base: any) => ({
                                                    ...selectStylesLight.control(base),
                                                    opacity: !selectedFuelId ? 0.5 : 1,
                                                    cursor: !selectedFuelId ? "not-allowed" : "pointer",
                                                }),
                                            }}
                                        />
                                    ) : (
                                        <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
                                    )}
                                </FormField>

                                <FormField label="Activity month *">
                                    <input
                                        type="month"
                                        value={formState.activity_date}
                                        onChange={(e) => setFormState((p) => ({ ...p, activity_date: e.target.value }))}
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-800 outline-none transition-all hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                    />
                                </FormField>

                                {submitError && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 sm:col-span-2">
                                        {submitError}
                                    </div>
                                )}

                                <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-6 sm:col-span-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="h-11 rounded-xl px-6 text-sm font-bold text-slate-600 hover:bg-slate-100">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createEnergyActivityMutation.isPending}
                                        className="h-11 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50">
                                        {createEnergyActivityMutation.isPending ? "Saving…" : "Save Activity"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function FormField({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
    return (
        <label className={`grid gap-2 ${className ?? ""}`}>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600">{label}</span>
            {children}
        </label>
    );
}
