"use client";

import { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import Select from "react-select";
import { LuPlus, LuSparkles, LuX, LuCalendarDays, LuFactory, LuTrendingUp, LuCheck } from "react-icons/lu";
import { Sidebar } from "@/components/dashboard/SidebarShell";
import {
    useScope1ActivitiesQuery,
    useCreateScope1ActivityMutation,
    useFacilitiesQuery,
    useEmissionFactorSourcesQuery,
    useFuelCategoriesQuery,
    useFuelsQuery,
    useFuelUnitsQuery,
} from "@/lib/report/hooks";
import { useSidebarStore } from "@/lib/sidebarStore";
import type { ApiErrorBody } from "@/types/api/common";

interface ActivityFormState {
    facility_id: string | null;
    emission_type: "stationary" | "mobile" | "";
    fuel_id: string | null;
    quantity: string;
    quantity_unit_id: string | null;
    source_id: string | null;
    calculation_type: "measured" | "estimated" | "";
    data_quality_tier: "tier_1" | "tier_2" | "tier_3" | "";
    start_date: string;
    end_date: string;
    notes: string;
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function formatEmissions(value: string): string {
    const num = parseFloat(value);
    return !isNaN(num) ? num.toFixed(3) : "0.000";
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

export default function Scope1ActivitiesPage() {
    const sidebarOpen = useSidebarStore((s) => s.isOpen);
    const setActiveSection = useSidebarStore((s) => s.setActiveSection);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    const {
        data: activities = [],
        isLoading: isLoadingActivities,
        isError: isErrorActivities,
    } = useScope1ActivitiesQuery();
    const { data: facilities = [], isLoading: isLoadingFacilities } = useFacilitiesQuery(isModalOpen);
    const { data: emissionSources = [], isLoading: isLoadingSources } = useEmissionFactorSourcesQuery(isModalOpen);
    const { data: fuelCategories = [], isLoading: isLoadingCategories } = useFuelCategoriesQuery(isModalOpen);
    const createActivityMutation = useCreateScope1ActivityMutation();

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const { data: fuels = [], isLoading: isLoadingFuels } = useFuelsQuery(
        selectedCategoryId || undefined,
        isModalOpen && !!selectedCategoryId,
    );

    const [selectedFuelId, setSelectedFuelId] = useState<string | null>(null);
    const { data: units = [], isLoading: isLoadingUnits } = useFuelUnitsQuery(
        selectedFuelId || undefined,
        isModalOpen && !!selectedFuelId,
    );

    const [formState, setFormState] = useState<ActivityFormState>({
        facility_id: null,
        emission_type: "",
        fuel_id: null,
        quantity: "",
        quantity_unit_id: null,
        source_id: null,
        calculation_type: "",
        data_quality_tier: "",
        start_date: "",
        end_date: "",
        notes: "",
    });

    useEffect(() => {
        setActiveSection("scope-1");
        setIsMounted(true);
    }, [setActiveSection]);

    const facilityOptions = useMemo(() => facilities.map((f) => ({ label: f.name, value: f.id })), [facilities]);

    const sourceOptions = useMemo(
        () =>
            emissionSources.map((s) => ({
                label: `${s.standard} ${s.version} (${s.region})`,
                value: s.id,
            })),
        [emissionSources],
    );

    const categoryOptions = useMemo(
        () => fuelCategories.map((c) => ({ label: c.name, value: c.id })),
        [fuelCategories],
    );

    const fuelOptions = useMemo(() => fuels.map((f) => ({ label: f.name, value: f.id })), [fuels]);

    const unitOptions = useMemo(() => units.map((u) => ({ label: `${u.name} (${u.symbol})`, value: u.id })), [units]);

    const emissionTypeOptions = [
        { label: "Stationary", value: "stationary" },
        { label: "Mobile", value: "mobile" },
    ];

    const calculationTypeOptions = [
        { label: "Measured", value: "measured" },
        { label: "Estimated", value: "estimated" },
    ];

    const dataQualityOptions = [
        { label: "Tier 1 (Primary Data)", value: "tier_1" },
        { label: "Tier 2 (Secondary Data)", value: "tier_2" },
        { label: "Tier 3 (Defaults)", value: "tier_3" },
    ];

    const handleResetForm = () => {
        setFormState({
            facility_id: null,
            emission_type: "",
            fuel_id: null,
            quantity: "",
            quantity_unit_id: null,
            source_id: null,
            calculation_type: "",
            data_quality_tier: "",
            start_date: "",
            end_date: "",
            notes: "",
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
            setSubmitError("Please select a facility");
            return;
        }

        if (!formState.fuel_id) {
            setSubmitError("Please select a fuel");
            return;
        }

        if (!formState.quantity || parseFloat(formState.quantity) <= 0) {
            setSubmitError("Please enter a valid quantity");
            return;
        }

        if (!formState.quantity_unit_id) {
            setSubmitError("Please select a quantity unit");
            return;
        }

        if (!formState.source_id) {
            setSubmitError("Please select an emission factor source");
            return;
        }

        if (!formState.emission_type) {
            setSubmitError("Please select an emission type");
            return;
        }

        if (!formState.calculation_type) {
            setSubmitError("Please select a calculation type");
            return;
        }

        if (!formState.data_quality_tier) {
            setSubmitError("Please select a data quality tier");
            return;
        }

        if (!formState.start_date || !formState.end_date) {
            setSubmitError("Please select both start and end dates");
            return;
        }

        try {
            await createActivityMutation.mutateAsync({
                facility_id: formState.facility_id,
                emission_type: formState.emission_type,
                fuel_id: formState.fuel_id,
                quantity: formState.quantity,
                quantity_unit_id: formState.quantity_unit_id,
                source_id: formState.source_id,
                calculation_type: formState.calculation_type,
                data_quality_tier: formState.data_quality_tier,
                start_date: formState.start_date,
                end_date: formState.end_date,
                notes: formState.notes,
            });

            setSubmitSuccess("Activity added successfully");
            handleResetForm();
            setTimeout(() => {
                setIsModalOpen(false);
                setSubmitSuccess(null);
            }, 1500);
        } catch (error) {
            if (error instanceof AxiosError) {
                const body = error.response?.data as ApiErrorBody | undefined;
                setSubmitError(body?.response ?? body?.message ?? "Failed to add activity");
            } else {
                setSubmitError("Failed to add activity");
            }
        }
    }

    const totalEmissions = useMemo(() => {
        return activities.reduce((sum, activity) => {
            return sum + parseFloat(activity.calculated_emissions.t_co2e);
        }, 0);
    }, [activities]);

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50 text-slate-900">
            {/* Background Effects */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-emerald-400/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] h-[60%] w-[60%] rounded-full bg-teal-300/10 blur-[150px]" />
            </div>

            <Sidebar />

            <main
                className={[
                    "gl-main-offset relative z-10 px-3 pb-8 pt-16 sm:px-4 lg:pr-8 lg:pt-8",
                    !sidebarOpen ? "gl-main-offset--collapsed" : "",
                ].join(" ")}>
                <div className="mx-auto w-full max-w-[1600px] overflow-hidden">
                    {/* Header */}
                    <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700 shadow-sm backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                </span>
                                Scope 1 Direct Emissions
                            </div>

                            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                                Scope 1 Activities
                            </h1>

                            <p className="max-w-2xl text-sm font-medium text-slate-500">
                                Track and manage direct emissions from stationary and mobile combustion sources.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}>
                            <button
                                type="button"
                                onClick={handleOpenModal}
                                className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] hover:shadow-emerald-500/40 active:scale-95 md:w-auto">
                                <LuPlus className="h-5 w-5 transition-transform group-hover:rotate-90" />
                                Add Activity
                            </button>
                        </motion.div>
                    </header>

                    {/* Success Alert */}
                    <AnimatePresence>
                        {submitSuccess && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 overflow-hidden">
                                <div className="rounded-2xl border border-emerald-200/50 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-800 backdrop-blur-md">
                                    <span className="font-bold">Success:</span> {submitSuccess}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Stats */}
                    {isLoadingActivities ? (
                        <div className="mb-8 grid gap-4 sm:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/40 backdrop-blur-md" />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-8 grid gap-4 sm:grid-cols-3">
                            {[
                                {
                                    label: "Total Activities",
                                    value: activities.length.toString(),
                                    icon: LuFactory,
                                    color: "from-emerald-500 to-teal-600",
                                },
                                {
                                    label: "Total Emissions",
                                    value: totalEmissions.toFixed(3),
                                    unit: "tCO2e",
                                    icon: LuTrendingUp,
                                    color: "from-blue-500 to-cyan-600",
                                },
                                {
                                    label: "Verified",
                                    value: activities.filter((a) => a.is_verified).length.toString(),
                                    icon: LuCheck,
                                    color: "from-emerald-500 to-green-600",
                                },
                            ].map((stat) => {
                                const IconComponent = stat.icon;
                                return (
                                    <motion.div
                                        key={stat.label}
                                        whileHover={{ y: -4 }}
                                        className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/50 p-5 shadow-lg shadow-black/5 backdrop-blur-xl">
                                        <div
                                            className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-2xl transition-all group-hover:scale-150`}
                                        />
                                        <div className="relative">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                                        {stat.label}
                                                    </p>
                                                    <h3 className="mt-2 text-2xl font-black text-slate-900">
                                                        {stat.value}
                                                        {stat.unit && (
                                                            <span className="ml-1 text-sm font-semibold text-slate-500">
                                                                {stat.unit}
                                                            </span>
                                                        )}
                                                    </h3>
                                                </div>
                                                <div
                                                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg text-white`}>
                                                    <IconComponent className="h-6 w-6" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* Activities Table */}
                    {isErrorActivities ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="rounded-2xl border border-red-200/50 bg-red-50/80 p-8 text-center backdrop-blur-md">
                            <p className="text-sm font-semibold text-red-600">
                                Failed to load activities. Please try again.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="rounded-2xl border border-white/60 bg-white/50 shadow-lg shadow-black/5 backdrop-blur-xl">
                            <div className="border-b border-slate-200/50 px-6 py-4">
                                <h2 className="text-lg font-bold text-slate-900">Activities</h2>
                                <p className="mt-1 text-sm font-medium text-slate-500">
                                    {activities.length} record{activities.length !== 1 ? "s" : ""} found
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-slate-200/50 bg-slate-50/50">
                                        <tr className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                            <th className="px-6 py-3">Facility</th>
                                            <th className="px-6 py-3">Fuel</th>
                                            <th className="px-6 py-3">Quantity</th>
                                            <th className="px-6 py-3">Period</th>
                                            <th className="px-6 py-3">Emissions (tCO2e)</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Date Added</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {isLoadingActivities ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-8 text-center">
                                                    <div className="inline-flex items-center gap-2 text-slate-500">
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                                                        Loading activities...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : activities.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <LuFactory className="h-8 w-8 text-slate-300" />
                                                        <p className="text-sm font-medium text-slate-500">
                                                            No activities yet. Add your first one!
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            activities.map((activity) => (
                                                <tr
                                                    key={activity.id}
                                                    className="transition-colors hover:bg-slate-50/50">
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-slate-900">
                                                            {activity.fuel?.name || "Unknown"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                            {activity.fuel?.name || "N/A"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-slate-700">
                                                        {parseFloat(activity.quantity).toFixed(2)}{" "}
                                                        <span className="text-xs text-slate-500">
                                                            {activity.quantity_unit?.symbol}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">
                                                        {formatDate(activity.activity_period.start_date)} -{" "}
                                                        {formatDate(activity.activity_period.end_date)}
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-emerald-600">
                                                        {formatEmissions(activity.calculated_emissions.t_co2e)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                                activity.status === "approved"
                                                                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                                                    : "border border-amber-200 bg-amber-50 text-amber-700"
                                                            }`}>
                                                            {activity.is_verified && <LuCheck className="h-3 w-3" />}
                                                            {activity.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500">
                                                        {formatDate(activity.created_at)}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.section>
                    )}
                </div>
            </main>

            {/* Add Activity Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="scrollbar-thin max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/50 bg-white p-6 shadow-2xl sm:p-8">
                            <div className="mb-8 flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700">
                                        <LuSparkles className="h-3.5 w-3.5" />
                                        New Activity
                                    </div>
                                    <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900">
                                        Add Scope-1 Activity
                                    </h3>
                                    <p className="mt-2 text-sm font-medium text-slate-500">
                                        Record a new direct emissions activity from stationary or mobile sources.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        handleResetForm();
                                    }}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700">
                                    <LuX className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitForm} className="grid gap-5 sm:grid-cols-2">
                                {/* Facility */}
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
                                                setFormState((p) => ({
                                                    ...p,
                                                    facility_id: opt?.value ?? null,
                                                }))
                                            }
                                            placeholder="Select facility..."
                                            styles={selectStylesLight}
                                        />
                                    ) : (
                                        <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
                                    )}
                                </FormField>

                                {/* Emission Type */}
                                <FormField label="Emission Type *">
                                    {isMounted ? (
                                        <Select
                                            menuPortalTarget={document.body}
                                            options={emissionTypeOptions}
                                            value={
                                                formState.emission_type
                                                    ? emissionTypeOptions.find(
                                                          (opt) => opt.value === formState.emission_type,
                                                      )
                                                    : null
                                            }
                                            onChange={(opt) =>
                                                setFormState((p) => ({
                                                    ...p,
                                                    emission_type: opt?.value as any,
                                                }))
                                            }
                                            placeholder="Select type..."
                                            styles={selectStylesLight}
                                        />
                                    ) : (
                                        <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
                                    )}
                                </FormField>

                                {/* Fuel Category */}
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
                                                setFormState((p) => ({
                                                    ...p,
                                                    fuel_id: null,
                                                    quantity_unit_id: null,
                                                }));
                                                setSelectedFuelId(null);
                                            }}
                                            placeholder="Select category..."
                                            styles={selectStylesLight}
                                        />
                                    ) : (
                                        <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
                                    )}
                                </FormField>

                                {/* Fuel */}
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

                                {/* Quantity */}
                                <FormField label="Quantity *">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="Enter quantity"
                                        value={formState.quantity}
                                        onChange={(e) =>
                                            setFormState((p) => ({
                                                ...p,
                                                quantity: e.target.value,
                                            }))
                                        }
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-800 outline-none transition-all hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                    />
                                </FormField>

                                {/* Unit */}
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
                                                setFormState((p) => ({
                                                    ...p,
                                                    quantity_unit_id: opt?.value ?? null,
                                                }))
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

                                {/* Source */}
                                <FormField label="Emission Factor Source *">
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
                                                setFormState((p) => ({
                                                    ...p,
                                                    source_id: opt?.value ?? null,
                                                }))
                                            }
                                            placeholder="Select source..."
                                            styles={selectStylesLight}
                                        />
                                    ) : (
                                        <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
                                    )}
                                </FormField>

                                {/* Calculation Type */}
                                <FormField label="Calculation Type *">
                                    {isMounted ? (
                                        <Select
                                            menuPortalTarget={document.body}
                                            options={calculationTypeOptions}
                                            value={
                                                formState.calculation_type
                                                    ? calculationTypeOptions.find(
                                                          (opt) => opt.value === formState.calculation_type,
                                                      )
                                                    : null
                                            }
                                            onChange={(opt) =>
                                                setFormState((p) => ({
                                                    ...p,
                                                    calculation_type: opt?.value as any,
                                                }))
                                            }
                                            placeholder="Select type..."
                                            styles={selectStylesLight}
                                        />
                                    ) : (
                                        <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
                                    )}
                                </FormField>

                                {/* Data Quality Tier */}
                                <FormField label="Data Quality Tier *">
                                    {isMounted ? (
                                        <Select
                                            menuPortalTarget={document.body}
                                            options={dataQualityOptions}
                                            value={
                                                formState.data_quality_tier
                                                    ? dataQualityOptions.find(
                                                          (opt) => opt.value === formState.data_quality_tier,
                                                      )
                                                    : null
                                            }
                                            onChange={(opt) =>
                                                setFormState((p) => ({
                                                    ...p,
                                                    data_quality_tier: opt?.value as any,
                                                }))
                                            }
                                            placeholder="Select tier..."
                                            styles={selectStylesLight}
                                        />
                                    ) : (
                                        <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
                                    )}
                                </FormField>

                                {/* Start Date */}
                                <FormField label="Start Date *">
                                    <input
                                        type="date"
                                        value={formState.start_date}
                                        onChange={(e) =>
                                            setFormState((p) => ({
                                                ...p,
                                                start_date: e.target.value,
                                            }))
                                        }
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-800 outline-none transition-all hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                    />
                                </FormField>

                                {/* End Date */}
                                <FormField label="End Date *">
                                    <input
                                        type="date"
                                        value={formState.end_date}
                                        onChange={(e) =>
                                            setFormState((p) => ({
                                                ...p,
                                                end_date: e.target.value,
                                            }))
                                        }
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-800 outline-none transition-all hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                    />
                                </FormField>

                                {/* Notes */}
                                <FormField label="Notes" className="sm:col-span-2">
                                    <textarea
                                        value={formState.notes}
                                        onChange={(e) =>
                                            setFormState((p) => ({
                                                ...p,
                                                notes: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter any additional notes..."
                                        rows={3}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                    />
                                </FormField>

                                {/* Error Alert */}
                                {submitError && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 sm:col-span-2">
                                        {submitError}
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6 sm:col-span-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            handleResetForm();
                                        }}
                                        className="h-11 rounded-xl px-6 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createActivityMutation.isPending}
                                        className="h-11 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-colors hover:bg-emerald-700 disabled:opacity-50">
                                        {createActivityMutation.isPending ? "Saving..." : "Save Activity"}
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
        <label className={`grid gap-2 ${className}`}>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600">{label}</span>
            {children}
        </label>
    );
}
