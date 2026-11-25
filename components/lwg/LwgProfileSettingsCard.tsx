// components/lwg/LwgProfileSettingsCard.tsx
"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/select";
import { useLwgProfile, useUpdateLwgProfile } from "@/lib/lwg/hooks";
import {
    LWG_EFFLUENT_TYPE_LABELS,
    LWG_STAGE_LABELS,
    type LwgEffluentType,
    type LwgOutputUnit,
    type LwgStage,
} from "@/lib/lwg/types";
import { cn } from "@/lib/utils/cn";

export function LwgProfileSettingsCard() {
    const { data: profile, isLoading } = useLwgProfile();
    const updateProfileMutation = useUpdateLwgProfile();

    const [tanneryName, setTanneryName] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [stagesRun, setStagesRun] = useState<LwgStage[]>([]);
    const [outputUnit, setOutputUnit] = useState<LwgOutputUnit>("sq_ft");
    const [effluentType, setEffluentType] = useState<LwgEffluentType>("both");
    const [usesSubcontractors, setUsesSubcontractors] = useState(false);

    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Sync form state when profile loads
    useEffect(() => {
        if (profile) {
            setTanneryName(profile.tanneryName || "");
            setState(profile.state || "");
            setCity(profile.city || "");
            setStagesRun(profile.stagesRun || []);
            setOutputUnit(profile.outputUnit || "sq_ft");
            setEffluentType(profile.effluentTreatmentType || "both");
            setUsesSubcontractors(profile.usesSubcontractors || false);
        }
    }, [profile]);

    const allStages: LwgStage[] = [
        "stage_1_raw_to_wetblue",
        "stage_2_wetblue_to_crust",
        "stage_3_crust_to_finish",
        "stage_1_to_3_raw_to_finish",
        "stage_2_to_3_wetblue_to_finish",
    ];

    const toggleStage = (stage: LwgStage) => {
        setStagesRun((prev) => {
            if (prev.includes(stage)) {
                if (prev.length === 1) return prev; // Keep at least one
                return prev.filter((s) => s !== stage);
            }
            return [...prev, stage];
        });
    };

    const effluentOptions: { label: string; value: LwgEffluentType }[] = [
        { label: LWG_EFFLUENT_TYPE_LABELS.direct_discharge_own_etp, value: "direct_discharge_own_etp" },
        { label: LWG_EFFLUENT_TYPE_LABELS.discharge_to_cetp, value: "discharge_to_cetp" },
        { label: LWG_EFFLUENT_TYPE_LABELS.both, value: "both" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setSuccessMessage(null);

        if (!tanneryName.trim()) {
            setFormError("Tannery registered name is required.");
            return;
        }
        if (!city.trim() || !state.trim()) {
            setFormError("City and State are required.");
            return;
        }
        if (stagesRun.length === 0) {
            setFormError("At least one production stage must be selected.");
            return;
        }

        try {
            await updateProfileMutation.mutateAsync({
                tanneryName: tanneryName.trim(),
                state: state.trim(),
                city: city.trim(),
                stagesRun,
                effluentTreatmentType: effluentType,
                outputUnit,
                usesSubcontractors,
            });
            setSuccessMessage("Tannery profile settings updated successfully.");
            setTimeout(() => setSuccessMessage(null), 4000);
        } catch (err) {
            console.error("Failed to update profile", err);
            setFormError(
                err instanceof Error ? err.message : "Failed to update profile settings.",
            );
        }
    };

    if (isLoading) {
        return (
            <Card className="animate-pulse">
                <CardHeader bordered tone="strip">
                    <div className="h-5 w-48 rounded bg-surface-container-high" />
                </CardHeader>
                <CardBody className="space-y-4">
                    <div className="h-10 w-full rounded bg-surface-container-high" />
                    <div className="h-10 w-full rounded bg-surface-container-high" />
                    <div className="h-24 w-full rounded bg-surface-container-high" />
                </CardBody>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader bordered tone="strip">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <MaterialIcon name="factory" size="sm" />
                        </div>
                        <div>
                            <h3 className="font-display text-sm font-bold tracking-tight text-primary">
                                Tannery Profile & Protocol Configuration
                            </h3>
                            <p className="font-sans text-xs text-on-surface-variant">
                                Leather Protocol Issue 7.x facility attributes and operational boundary parameters.
                            </p>
                        </div>
                    </div>

                    {profile && (
                        <div className="hidden sm:flex items-center gap-2 rounded-lg bg-surface-container-low px-2.5 py-1 text-[11px] font-mono text-on-surface-variant border border-outline-variant/60">
                            <MaterialIcon name="date_range" size="xs" />
                            <span>Audit Window: {profile.dataWindowStart} to {profile.dataWindowEnd}</span>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardBody>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Feedback Banners */}
                    {formError && (
                        <div className="flex items-start gap-2.5 rounded-xl border border-error/30 bg-error/5 p-3.5 text-xs text-error animate-fade-in">
                            <MaterialIcon name="error" size="xs" className="mt-0.5 shrink-0" />
                            <span>{formError}</span>
                        </div>
                    )}
                    {successMessage && (
                        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50/80 p-3.5 text-xs text-emerald-800 animate-fade-in">
                            <MaterialIcon name="check_circle" size="xs" className="mt-0.5 shrink-0 text-emerald-600" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Facility & Location Info */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2 space-y-1.5">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Tannery Registered Business Name <span className="text-error">*</span>
                            </label>
                            <Input
                                value={tanneryName}
                                onChange={(e) => setTanneryName(e.target.value)}
                                placeholder="Registered Tannery Legal Entity"
                                disabled={updateProfileMutation.isPending}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                City <span className="text-error">*</span>
                            </label>
                            <Input
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g., Ranipet"
                                disabled={updateProfileMutation.isPending}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                State / Province <span className="text-error">*</span>
                            </label>
                            <Input
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                placeholder="e.g., Tamil Nadu"
                                disabled={updateProfileMutation.isPending}
                            />
                        </div>
                    </div>

                    {/* Stages Run */}
                    <div className="space-y-2">
                        <label className="block font-sans text-xs font-semibold text-primary">
                            Production Stages Operated On-Site <span className="text-error">*</span>
                        </label>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {allStages.map((stage) => {
                                const isSelected = stagesRun.includes(stage);
                                return (
                                    <label
                                        key={stage}
                                        onClick={() => toggleStage(stage)}
                                        className={cn(
                                            "flex items-start gap-2.5 rounded-xl border p-2.5 transition-all cursor-pointer select-none text-xs",
                                            isSelected
                                                ? "border-emerald-600/70 bg-emerald-50/50 text-primary shadow-2xs"
                                                : "border-outline-variant bg-surface hover:bg-surface-container-high text-on-surface-variant",
                                        )}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => {}}
                                            className="mt-0.5 h-3.5 w-3.5 rounded border-outline-variant text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <span className="leading-snug">{LWG_STAGE_LABELS[stage]}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Measurement Unit & Effluent Treatment */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Area Unit */}
                        <div className="space-y-2">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Preferred Leather Area Unit
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <label
                                    onClick={() => setOutputUnit("sq_ft")}
                                    className={cn(
                                        "flex items-center gap-2 rounded-xl border p-2.5 cursor-pointer text-xs transition-colors",
                                        outputUnit === "sq_ft"
                                            ? "border-emerald-600/70 bg-emerald-50/50 font-semibold text-primary"
                                            : "border-outline-variant bg-surface hover:bg-surface-container-high text-on-surface-variant",
                                    )}>
                                    <input
                                        type="radio"
                                        name="outputUnit"
                                        checked={outputUnit === "sq_ft"}
                                        onChange={() => {}}
                                        className="h-3.5 w-3.5 text-emerald-600"
                                    />
                                    <span>Square Feet (sq ft)</span>
                                </label>

                                <label
                                    onClick={() => setOutputUnit("m2")}
                                    className={cn(
                                        "flex items-center gap-2 rounded-xl border p-2.5 cursor-pointer text-xs transition-colors",
                                        outputUnit === "m2"
                                            ? "border-emerald-600/70 bg-emerald-50/50 font-semibold text-primary"
                                            : "border-outline-variant bg-surface hover:bg-surface-container-high text-on-surface-variant",
                                    )}>
                                    <input
                                        type="radio"
                                        name="outputUnit"
                                        checked={outputUnit === "m2"}
                                        onChange={() => {}}
                                        className="h-3.5 w-3.5 text-emerald-600"
                                    />
                                    <span>Square Meters (m²)</span>
                                </label>
                            </div>
                        </div>

                        {/* Effluent Treatment */}
                        <div className="space-y-2">
                            <label className="block font-sans text-xs font-semibold text-primary">
                                Effluent Treatment Configuration
                            </label>
                            <CustomSelect
                                options={effluentOptions}
                                value={effluentType}
                                onChange={(val) => setEffluentType(val as LwgEffluentType)}
                                isDisabled={updateProfileMutation.isPending}
                            />
                        </div>
                    </div>

                    {/* Subcontractors Toggle */}
                    <div className="flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-low/60 p-3.5">
                        <div>
                            <p className="font-sans text-xs font-semibold text-primary">
                                Subcontracted Operations (Protocol Section 2)
                            </p>
                            <p className="font-sans text-[11px] text-on-surface-variant">
                                Outsourced tanning processing steps subject to sub-tier audits.
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={usesSubcontractors}
                                onChange={(e) => setUsesSubcontractors(e.target.checked)}
                                disabled={updateProfileMutation.isPending}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-outline-variant/60">
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            disabled={updateProfileMutation.isPending}>
                            {updateProfileMutation.isPending ? (
                                <>
                                    <MaterialIcon name="sync" size="xs" className="animate-spin" />
                                    <span>Saving Changes...</span>
                                </>
                            ) : (
                                <>
                                    <MaterialIcon name="save" size="xs" />
                                    <span>Save Configuration</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardBody>
        </Card>
    );
}
