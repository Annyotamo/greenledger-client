// components/lwg/LwgOnboardingWizard.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/select";
import { useFacilities } from "@/lib/facility/hooks";
import { useCreateLwgProfile } from "@/lib/lwg/hooks";
import {
    LWG_EFFLUENT_TYPE_LABELS,
    LWG_STAGE_LABELS,
    type LwgEffluentType,
    type LwgOutputUnit,
    type LwgStage,
} from "@/lib/lwg/types";
import { cn } from "@/lib/utils/cn";

export function LwgOnboardingWizard() {
    const router = useRouter();
    const { data: facilities = [], isLoading: isLoadingFacilities } = useFacilities();
    const createProfileMutation = useCreateLwgProfile();

    const [facilityId, setFacilityId] = useState("");
    const [tanneryName, setTanneryName] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [stagesRun, setStagesRun] = useState<LwgStage[]>([
        "stage_3_crust_to_finish",
    ]);
    const [outputUnit, setOutputUnit] = useState<LwgOutputUnit>("sq_ft");
    const [effluentType, setEffluentType] = useState<LwgEffluentType>("both");
    const [usesSubcontractors, setUsesSubcontractors] = useState(false);

    const [validationError, setValidationError] = useState<string | null>(null);

    const handleFacilitySelect = (selectedId: string) => {
        setFacilityId(selectedId);
        const fac = facilities.find((f) => f.id === selectedId);
        if (fac) {
            if (!tanneryName) setTanneryName(fac.name || "");
            if (!city && fac.city) setCity(fac.city);
            if (!state && fac.state) setState(fac.state);
        }
    };

    const toggleStage = (stage: LwgStage) => {
        setStagesRun((prev) => {
            if (prev.includes(stage)) {
                if (prev.length === 1) return prev; // Keep at least one
                return prev.filter((s) => s !== stage);
            }
            return [...prev, stage];
        });
    };

    const validate = () => {
        if (!facilityId) {
            setValidationError("Please select an operational facility.");
            return false;
        }
        if (!tanneryName.trim()) {
            setValidationError("Registered Tannery Name is required.");
            return false;
        }
        if (!city.trim() || !state.trim()) {
            setValidationError("City and State are required.");
            return false;
        }
        if (stagesRun.length === 0) {
            setValidationError("At least one manufacturing stage must be selected.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        if (!validate()) return;

        try {
            await createProfileMutation.mutateAsync({
                facilityId,
                tanneryName: tanneryName.trim(),
                state: state.trim(),
                city: city.trim(),
                stagesRun,
                effluentTreatmentType: effluentType,
                outputUnit,
                usesSubcontractors,
            });
            router.replace("/lwg");
        } catch (err) {
            console.error("Failed to create LWG profile:", err);
            setValidationError(
                err instanceof Error ? err.message : "Failed to create tannery profile.",
            );
        }
    };

    const facilityOptions = facilities.map((f) => ({
        label: `${f.name} (${f.facilityCode || f.city || "Site"})`,
        value: f.id,
    }));

    const effluentOptions: { label: string; value: LwgEffluentType }[] = [
        { label: LWG_EFFLUENT_TYPE_LABELS.direct_discharge_own_etp, value: "direct_discharge_own_etp" },
        { label: LWG_EFFLUENT_TYPE_LABELS.discharge_to_cetp, value: "discharge_to_cetp" },
        { label: LWG_EFFLUENT_TYPE_LABELS.both, value: "both" },
    ];

    const allStages: LwgStage[] = [
        "stage_1_raw_to_wetblue",
        "stage_2_wetblue_to_crust",
        "stage_3_crust_to_finish",
        "stage_1_to_3_raw_to_finish",
        "stage_2_to_3_wetblue_to_finish",
    ];

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            {/* Header intro banner */}
            <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
                        <MaterialIcon name="workspace_premium" size="lg" />
                    </div>
                    <div>
                        <h2 className="font-display text-xl font-bold tracking-tight text-primary">
                            Leather Working Group (LWG) Tannery Onboarding
                        </h2>
                        <p className="mt-1 font-sans text-xs text-on-surface-variant max-w-2xl leading-relaxed">
                            Configure your tannery manufacturing parameters per LWG Environmental Audit Protocol Issue 7.x.
                            Upon setup, a continuous 24-month audit sliding window and default factory departments will be initialized.
                        </p>
                    </div>
                </div>
            </div>

            {/* Error callout */}
            {validationError && (
                <div className="flex items-start gap-3 rounded-xl border border-error/30 bg-error/5 p-4 text-xs text-error">
                    <MaterialIcon name="error" size="sm" className="mt-0.5 shrink-0" />
                    <div>
                        <p className="font-bold uppercase tracking-wider text-[11px]">Configuration Error</p>
                        <p className="mt-0.5">{validationError}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Facility & Location Card */}
                <Card>
                    <CardHeader bordered tone="strip">
                        <div className="flex items-center gap-2.5">
                            <MaterialIcon name="domain" size="sm" className="text-emerald-700" />
                            <h3 className="font-display text-sm font-semibold tracking-tight text-primary">
                                1. Operational Facility & Location
                            </h3>
                        </div>
                    </CardHeader>
                    <CardBody className="space-y-5">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="grid gap-1.5 md:col-span-2">
                                <label className="block font-sans text-xs font-semibold text-on-surface-variant">
                                    Primary Operational Facility <span className="text-error">*</span>
                                </label>
                                <CustomSelect
                                    options={facilityOptions}
                                    value={facilityId}
                                    onChange={handleFacilitySelect}
                                    placeholder={isLoadingFacilities ? "Loading facilities..." : "Select registered facility..."}
                                />
                                <p className="font-sans text-[11px] text-on-surface-variant/70">
                                    Link your LWG certification audit workspace to a registered site in GreenLedger.
                                </p>
                            </div>

                            <div className="grid gap-1.5 md:col-span-2">
                                <label className="block font-sans text-xs font-semibold text-on-surface-variant">
                                    Tannery Registered Business Name <span className="text-error">*</span>
                                </label>
                                <Input
                                    value={tanneryName}
                                    onChange={(e) => setTanneryName(e.target.value)}
                                    placeholder="e.g., Evergreen Tannery Pvt Ltd"
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <label className="block font-sans text-xs font-semibold text-on-surface-variant">
                                    City <span className="text-error">*</span>
                                </label>
                                <Input
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="e.g., Ranipet"
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <label className="block font-sans text-xs font-semibold text-on-surface-variant">
                                    State / Province <span className="text-error">*</span>
                                </label>
                                <Input
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    placeholder="e.g., Tamil Nadu"
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* 2. Manufacturing Stages Run */}
                <Card>
                    <CardHeader bordered tone="strip">
                        <div className="flex items-center gap-2.5">
                            <MaterialIcon name="precision_manufacturing" size="sm" className="text-emerald-700" />
                            <h3 className="font-display text-sm font-semibold tracking-tight text-primary">
                                2. Production Stages Operated
                            </h3>
                        </div>
                    </CardHeader>
                    <CardBody className="space-y-4">
                        <p className="font-sans text-xs text-on-surface-variant">
                            Select all manufacturing stages operated on-site. Per LWG Protocol rules, energy and water intensity denominators will be derived based on the highest completed stage.
                        </p>

                        <div className="space-y-2.5">
                            {allStages.map((stage) => {
                                const isSelected = stagesRun.includes(stage);
                                return (
                                    <label
                                        key={stage}
                                        onClick={() => toggleStage(stage)}
                                        className={cn(
                                            "flex items-start gap-3 rounded-xl border p-3.5 transition-all cursor-pointer select-none",
                                            isSelected
                                                ? "border-emerald-600/60 bg-emerald-50/40 text-primary shadow-2xs"
                                                : "border-outline-variant bg-surface hover:bg-surface-container-high/60 text-on-surface-variant",
                                        )}>
                                        <div className="flex h-5 items-center">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => {}} // handled by parent onClick
                                                className="h-4 w-4 rounded border-outline-variant text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex-1 text-xs">
                                            <p className="font-semibold text-primary">{LWG_STAGE_LABELS[stage]}</p>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </CardBody>
                </Card>

                {/* 3. Operational Preferences & Environmental Parameters */}
                <Card>
                    <CardHeader bordered tone="strip">
                        <div className="flex items-center gap-2.5">
                            <MaterialIcon name="tune" size="sm" className="text-emerald-700" />
                            <h3 className="font-display text-sm font-semibold tracking-tight text-primary">
                                3. Environmental & Measurement Parameters
                            </h3>
                        </div>
                    </CardHeader>
                    <CardBody className="space-y-6">
                        {/* Area Unit Selection */}
                        <div className="space-y-2">
                            <label className="block font-sans text-xs font-semibold text-on-surface-variant">
                                Preferred Leather Area Measurement Unit
                            </label>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <label
                                    onClick={() => setOutputUnit("sq_ft")}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl border p-3.5 transition-all cursor-pointer select-none",
                                        outputUnit === "sq_ft"
                                            ? "border-emerald-600/70 bg-emerald-50/50 text-primary shadow-2xs font-semibold"
                                            : "border-outline-variant bg-surface hover:bg-surface-container-high text-on-surface-variant",
                                    )}>
                                    <input
                                        type="radio"
                                        name="outputUnit"
                                        checked={outputUnit === "sq_ft"}
                                        onChange={() => {}}
                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div>
                                        <p className="text-xs font-semibold text-primary">Square Feet (sq ft)</p>
                                        <p className="text-[11px] text-on-surface-variant">Standard Asian commercial trade unit</p>
                                    </div>
                                </label>

                                <label
                                    onClick={() => setOutputUnit("m2")}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl border p-3.5 transition-all cursor-pointer select-none",
                                        outputUnit === "m2"
                                            ? "border-emerald-600/70 bg-emerald-50/50 text-primary shadow-2xs font-semibold"
                                            : "border-outline-variant bg-surface hover:bg-surface-container-high text-on-surface-variant",
                                    )}>
                                    <input
                                        type="radio"
                                        name="outputUnit"
                                        checked={outputUnit === "m2"}
                                        onChange={() => {}}
                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div>
                                        <p className="text-xs font-semibold text-primary">Square Meters (m²)</p>
                                        <p className="text-[11px] text-on-surface-variant">Official LWG Issue 7 Protocol metric unit</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Effluent Treatment Type */}
                        <div className="grid gap-1.5">
                            <label className="block font-sans text-xs font-semibold text-on-surface-variant">
                                Effluent Treatment Configuration
                            </label>
                            <CustomSelect
                                options={effluentOptions}
                                value={effluentType}
                                onChange={(val) => setEffluentType(val as LwgEffluentType)}
                            />
                            <p className="font-sans text-[11px] text-on-surface-variant/70">
                                Specifies whether wastewater is treated via on-site ETP, discharged to a CETP cluster, or a hybrid of both.
                            </p>
                        </div>

                        {/* Subcontractor Toggle */}
                        <div className="flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-low/60 p-4">
                            <div>
                                <p className="font-sans text-xs font-semibold text-primary">
                                    Subcontracted Operations (Section 2)
                                </p>
                                <p className="font-sans text-[11px] text-on-surface-variant mt-0.5">
                                    Check this if the facility outsources processing steps (e.g. splitting, shaving, dyeing) to external units.
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={usesSubcontractors}
                                    onChange={(e) => setUsesSubcontractors(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                    </CardBody>
                </Card>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                        variant="secondary"
                        size="md"
                        type="button"
                        onClick={() => router.back()}
                        disabled={createProfileMutation.isPending}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        type="submit"
                        disabled={createProfileMutation.isPending}>
                        <MaterialIcon name="check_circle" size="xs" />
                        {createProfileMutation.isPending
                            ? "Configuring Tannery..."
                            : "Complete Setup & Launch LWG Workspace"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
