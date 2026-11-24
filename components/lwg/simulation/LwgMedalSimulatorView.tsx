// components/lwg/simulation/LwgMedalSimulatorView.tsx
"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateLwgAuditResult, useLwgAuditResult } from "@/lib/lwg/hooks";
import {
    LWG_ALL_SECTIONS,
    LWG_CRITICAL_SECTIONS,
    LWG_MEDAL_CONFIG,
    type LwgMedalRating,
} from "@/lib/lwg/types";
import { calculateMedalFromScores } from "@/lib/lwg/utils";
import { cn } from "@/lib/utils/cn";

export function LwgMedalSimulatorView() {
    const { data: previousAudit, isLoading: isLoadingAudit } = useLwgAuditResult();
    const createAuditMutation = useCreateLwgAuditResult();

    // Default initial scores: Sections 2 to 17
    const defaultScores: Record<number, number> = {
        2: 85,
        3: 80,
        4: 90,
        5: 88,
        6: 78,
        7: 82,
        8: 85,
        9: 86,
        10: 88,
        11: 72, // Intentionally initial bottleneck for realistic preview
        12: 84,
        13: 86,
        14: 85,
        15: 87,
        16: 85,
        17: 88,
    };

    const [scores, setScores] = useState<Record<number, number>>(defaultScores);
    const [criticalOnlyFilter, setCriticalOnlyFilter] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [auditDate, setAuditDate] = useState("2026-06-15");
    const [auditNotes, setAuditNotes] = useState("");
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Sync with previous audit if available
    useEffect(() => {
        if (previousAudit?.sectionScores && Object.keys(previousAudit.sectionScores).length > 0) {
            const loaded: Record<number, number> = {};
            Object.entries(previousAudit.sectionScores).forEach(([k, v]) => {
                const num = Number(k);
                if (!isNaN(num)) loaded[num] = Number(v) || 0;
            });
            setScores((prev) => ({ ...prev, ...loaded }));
            if (previousAudit.auditDate) setAuditDate(previousAudit.auditDate);
            if (previousAudit.notes) setAuditNotes(previousAudit.notes);
        }
    }, [previousAudit]);

    // Live calculation
    const evaluation = calculateMedalFromScores(scores);
    const overallMedal = evaluation.overallMedal;
    const medalMeta = LWG_MEDAL_CONFIG[overallMedal] ?? LWG_MEDAL_CONFIG.fail;

    const scoringSections = LWG_ALL_SECTIONS.filter((s) => s.sectionNumber >= 2);
    const filteredSections = criticalOnlyFilter
        ? scoringSections.filter((s) => s.isCritical)
        : scoringSections;

    const handleScoreChange = (secNum: number, value: number) => {
        const clamped = Math.max(0, Math.min(100, isNaN(value) ? 0 : value));
        setScores((prev) => ({
            ...prev,
            [secNum]: clamped,
        }));
    };

    const applyPreset = (presetScore: number) => {
        const updated: Record<number, number> = {};
        scoringSections.forEach((s) => {
            updated[s.sectionNumber] = presetScore;
        });
        setScores(updated);
    };

    const handleSaveAudit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formattedScores: Record<string, number> = {};
            Object.entries(scores).forEach(([k, v]) => {
                formattedScores[k] = v;
            });

            await createAuditMutation.mutateAsync({
                auditDate,
                sectionScores: formattedScores,
                notes: auditNotes.trim() || null,
            });

            setIsSaveModalOpen(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 4000);
        } catch (err) {
            console.error("Failed to save audit result", err);
        }
    };

    const getMedalVisual = (medal: LwgMedalRating) => {
        switch (medal) {
            case "gold":
                return {
                    bg: "bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-yellow-500/5",
                    border: "border-amber-300",
                    text: "text-amber-900",
                    badge: "bg-amber-100 text-amber-900 border-amber-300",
                };
            case "silver":
                return {
                    bg: "bg-gradient-to-br from-slate-300/30 via-slate-200/15 to-gray-200/5",
                    border: "border-slate-300",
                    text: "text-slate-900",
                    badge: "bg-slate-100 text-slate-800 border-slate-300",
                };
            case "bronze":
                return {
                    bg: "bg-gradient-to-br from-orange-400/20 via-amber-700/10 to-stone-300/5",
                    border: "border-orange-300",
                    text: "text-orange-950",
                    badge: "bg-orange-100 text-orange-900 border-orange-300",
                };
            case "audited":
                return {
                    bg: "bg-gradient-to-br from-sky-400/20 via-blue-500/10 to-blue-200/5",
                    border: "border-blue-300",
                    text: "text-blue-950",
                    badge: "bg-blue-100 text-blue-900 border-blue-300",
                };
            case "fail":
            default:
                return {
                    bg: "bg-gradient-to-br from-rose-500/15 via-red-400/10 to-red-100/5",
                    border: "border-rose-300",
                    text: "text-rose-950",
                    badge: "bg-rose-100 text-rose-900 border-rose-300",
                };
        }
    };

    const visual = getMedalVisual(overallMedal);

    return (
        <div className="space-y-6">
            {/* Success notification */}
            {saveSuccess && (
                <div className="flex items-center gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 animate-fade-in shadow-2xs">
                    <MaterialIcon name="check_circle" size="sm" className="text-emerald-600" />
                    <span>Official Audit Result successfully recorded in GreenLedger.</span>
                </div>
            )}

            {/* Previous Audit Info Banner (if exists) */}
            {previousAudit && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-outline-variant bg-surface p-4 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                            <MaterialIcon name="history_edu" size="sm" />
                        </div>
                        <div>
                            <span className="font-sans text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                                Last Recorded Official Audit
                            </span>
                            <p className="font-display text-sm font-bold text-primary">
                                Audit Date: {previousAudit.auditDate} • Achieved Medal:{" "}
                                <span className="uppercase text-emerald-700">{previousAudit.overallMedal}</span>
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            if (previousAudit?.sectionScores) {
                                const loaded: Record<number, number> = {};
                                Object.entries(previousAudit.sectionScores).forEach(([k, v]) => {
                                    loaded[Number(k)] = Number(v) || 0;
                                });
                                setScores((prev) => ({ ...prev, ...loaded }));
                            }
                        }}>
                        <MaterialIcon name="restart_alt" size="xs" />
                        <span>Reset to Saved Audit Scores</span>
                    </Button>
                </div>
            )}

            {/* Top Control Bar & Live Medal Output */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Projected Medal Crest Card (Col 5) */}
                <Card className={cn("lg:col-span-5 flex flex-col justify-between border-2", visual.border, visual.bg)}>
                    <CardHeader bordered tone="strip">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="military_tech" size="sm" className="text-amber-700" />
                                <h3 className="font-display text-sm font-bold text-primary">
                                    Simulated LWG Medal
                                </h3>
                            </div>
                            <span
                                className={cn(
                                    "rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider border",
                                    visual.badge,
                                )}>
                                Issue 7.x Engine
                            </span>
                        </div>
                    </CardHeader>

                    <CardBody className="space-y-4 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/90 shadow-sm border border-white">
                                    <MaterialIcon
                                        name="workspace_premium"
                                        size="lg"
                                        className={cn(
                                            overallMedal === "gold"
                                                ? "text-amber-600"
                                                : overallMedal === "silver"
                                                ? "text-slate-600"
                                                : overallMedal === "bronze"
                                                ? "text-amber-700"
                                                : "text-rose-600",
                                        )}
                                    />
                                </div>
                                <div>
                                    <span className="font-mono text-xs font-semibold text-on-surface-variant">
                                        Overall Tannery Rating
                                    </span>
                                    <h2 className={cn("font-display text-2xl font-extrabold uppercase", visual.text)}>
                                        {overallMedal === "fail" ? "Non-Compliant" : `${medalMeta.label} Medal`}
                                    </h2>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="font-sans text-[11px] text-on-surface-variant">Min Threshold</span>
                                <p className="font-mono text-xl font-bold text-primary">
                                    {medalMeta.minScore.toFixed(0)}%
                                </p>
                            </div>
                        </div>

                        {/* Holding-Down Rule Alert */}
                        {evaluation.holdingDownSections.length > 0 && (
                            <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-3.5 text-xs text-amber-950 space-y-1.5 shadow-2xs">
                                <div className="flex items-center gap-1.5 font-bold">
                                    <MaterialIcon name="warning" size="xs" className="text-amber-700 shrink-0" />
                                    <span>Holding-Down Rule Bottleneck Identified</span>
                                </div>
                                <p className="font-sans text-[11px] text-amber-900 leading-relaxed">
                                    {evaluation.message}
                                </p>
                                <p className="font-sans text-[10px] text-amber-800/80 italic">
                                    Rule: The facility medal cannot exceed the lowest scoring critical section. Boost bottleneck sections to unlock the next medal tier.
                                </p>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Preset Actions & Simulator Controls (Col 7) */}
                <Card className="lg:col-span-7 flex flex-col justify-between">
                    <CardHeader bordered tone="strip">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="tune" size="sm" className="text-blue-700" />
                                <h3 className="font-display text-sm font-bold text-primary">
                                    Simulation Controls & Quick Presets
                                </h3>
                            </div>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setIsSaveModalOpen(true)}>
                                <MaterialIcon name="save" size="xs" />
                                <span>Save As Audit Result</span>
                            </Button>
                        </div>
                    </CardHeader>

                    <CardBody className="space-y-4">
                        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                            Simulate hypothetical protocol audit scenarios across all 16 scoring sections. Real-time calculations instantly re-evaluate your projected rating and test the impact of the Holding-Down rule.
                        </p>

                        <div className="space-y-2">
                            <span className="font-sans text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                                Quick Simulation Presets
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <button
                                    type="button"
                                    onClick={() => applyPreset(88)}
                                    className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 p-2 text-xs font-bold text-amber-900 transition-colors">
                                    <MaterialIcon name="workspace_premium" size="xs" className="text-amber-600" />
                                    <span>All Gold (88%)</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => applyPreset(78)}
                                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 p-2 text-xs font-bold text-slate-900 transition-colors">
                                    <MaterialIcon name="military_tech" size="xs" className="text-slate-600" />
                                    <span>All Silver (78%)</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => applyPreset(68)}
                                    className="flex items-center justify-center gap-1.5 rounded-xl border border-orange-300 bg-orange-50 hover:bg-orange-100 p-2 text-xs font-bold text-orange-950 transition-colors">
                                    <MaterialIcon name="shield" size="xs" className="text-orange-700" />
                                    <span>All Bronze (68%)</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => applyPreset(50)}
                                    className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 p-2 text-xs font-bold text-blue-950 transition-colors">
                                    <MaterialIcon name="verified" size="xs" className="text-blue-600" />
                                    <span>Audited (50%)</span>
                                </button>
                            </div>
                        </div>

                        {/* Filter Toggle */}
                        <div className="flex items-center justify-between border-t border-outline-variant/60 pt-3">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="critFilter"
                                    checked={criticalOnlyFilter}
                                    onChange={(e) => setCriticalOnlyFilter(e.target.checked)}
                                    className="h-4 w-4 rounded border-outline-variant text-amber-600 focus:ring-amber-500 cursor-pointer"
                                />
                                <label htmlFor="critFilter" className="font-sans text-xs font-semibold text-primary cursor-pointer">
                                    Show Critical Sections Only (13 Sections that dictate medal)
                                </label>
                            </div>
                            <span className="font-mono text-[11px] text-on-surface-variant">
                                {filteredSections.length} Sections Visible
                            </span>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* 16-Section Interactive Slider Matrix */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-bold tracking-tight text-primary">
                        16 Scoring Protocol Sections Matrix
                    </h3>
                    <span className="font-sans text-xs text-on-surface-variant">
                        Move sliders or type exact percentage scores
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSections.map((sec) => {
                        const score = scores[sec.sectionNumber] ?? 0;
                        const rating = evaluation.sectionRatings[String(sec.sectionNumber)] ?? "fail";
                        const isBottleneck = evaluation.holdingDownSections.includes(sec.sectionNumber);

                        return (
                            <div
                                key={sec.sectionNumber}
                                className={cn(
                                    "rounded-2xl border p-4 space-y-3 transition-all",
                                    isBottleneck
                                        ? "border-amber-400 bg-amber-50/40 ring-1 ring-amber-400/50"
                                        : "border-outline-variant bg-surface hover:border-outline-variant/80",
                                )}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-primary">
                                                Section {sec.sectionNumber}
                                            </span>
                                            {sec.isCritical ? (
                                                <span className="inline-flex items-center gap-1 rounded bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                                                    <MaterialIcon name="shield" size="xs" className="text-amber-700" />
                                                    Critical
                                                </span>
                                            ) : (
                                                <span className="rounded bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 text-[9px] font-mono">
                                                    Non-Critical
                                                </span>
                                            )}
                                            {isBottleneck && (
                                                <span className="rounded bg-amber-500 text-white px-1.5 py-0.5 text-[9px] font-bold uppercase animate-pulse">
                                                    Holding Down
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="font-sans text-xs font-bold text-primary truncate max-w-xs">
                                            {sec.title}
                                        </h4>
                                    </div>

                                    {/* Rating badge & numeric score input */}
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={cn(
                                                "rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase",
                                                rating === "gold"
                                                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                                                    : rating === "silver"
                                                    ? "bg-slate-100 text-slate-800 border border-slate-300"
                                                    : rating === "bronze"
                                                    ? "bg-orange-100 text-orange-900 border border-orange-300"
                                                    : rating === "audited"
                                                    ? "bg-blue-100 text-blue-900 border border-blue-300"
                                                    : "bg-rose-100 text-rose-800 border border-rose-300",
                                            )}>
                                            {rating}
                                        </span>
                                        <div className="flex items-center">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={score}
                                                onChange={(e) =>
                                                    handleScoreChange(sec.sectionNumber, parseFloat(e.target.value))
                                                }
                                                className="w-14 rounded-lg border border-outline-variant bg-surface px-1.5 py-1 text-right font-mono text-xs font-bold text-primary focus:outline-none focus:ring-1 focus:ring-emerald-600 tabular-nums"
                                            />
                                            <span className="font-mono text-xs text-on-surface-variant ml-1">%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Slider */}
                                <div className="space-y-1">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={score}
                                        onChange={(e) =>
                                            handleScoreChange(sec.sectionNumber, parseFloat(e.target.value))
                                        }
                                        className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                    />
                                    <div className="flex justify-between font-mono text-[9px] text-on-surface-variant/60">
                                        <span>0% (Fail)</span>
                                        <span>50% (Audited)</span>
                                        <span>65% (Bronze)</span>
                                        <span>75% (Silver)</span>
                                        <span>85% (Gold)</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Save Audit Result Modal */}
            {isSaveModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                    role="dialog"
                    aria-modal="true">
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
                        onClick={() => setIsSaveModalOpen(false)}
                    />
                    <div className="relative w-full max-w-md rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-2xl animate-fade-up">
                        <div className="flex items-start justify-between border-b border-outline-variant/60 pb-3">
                            <div className="flex items-center gap-2.5">
                                <MaterialIcon name="save" size="sm" className="text-emerald-700" />
                                <h3 className="font-display text-base font-bold text-primary">
                                    Record Official Audit Result
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsSaveModalOpen(false)}
                                className="rounded p-1 text-on-surface-variant hover:bg-surface-container-high">
                                <MaterialIcon name="close" size="xs" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveAudit} className="mt-4 space-y-4">
                            <div className="rounded-xl border border-outline-variant/60 bg-surface-container-low/50 p-3 text-xs space-y-1">
                                <span className="font-sans font-semibold text-primary">Projected Medal:</span>
                                <span className="font-bold text-emerald-800 uppercase ml-2 text-sm">
                                    {overallMedal}
                                </span>
                                <p className="font-sans text-[11px] text-on-surface-variant">
                                    Persisting these 16 scores will update your tannery profile standing.
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block font-sans text-xs font-semibold text-primary">
                                    Audit Inspection Date <span className="text-error">*</span>
                                </label>
                                <Input
                                    type="date"
                                    value={auditDate}
                                    onChange={(e) => setAuditDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block font-sans text-xs font-semibold text-primary">
                                    Auditor Name / Certificate Notes (Optional)
                                </label>
                                <textarea
                                    value={auditNotes}
                                    onChange={(e) => setAuditNotes(e.target.value)}
                                    placeholder="e.g., LWG Protocol Issue 7.1.0 on-site assessment by SGS"
                                    rows={3}
                                    className="w-full rounded-xl border border-outline-variant bg-surface px-3 py-2 font-sans text-xs text-primary placeholder:text-on-surface-variant/50 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2 border-t border-outline-variant/60">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setIsSaveModalOpen(false)}
                                    disabled={createAuditMutation.isPending}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    disabled={createAuditMutation.isPending}>
                                    {createAuditMutation.isPending ? "Recording..." : "Confirm & Save"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
