"use client";

import { useMemo, useState } from "react";
import { AxiosError } from "axios";
import { LuCircleCheck, LuCog, LuFlaskConical, LuLeaf, LuLoaderCircle, LuSave, LuSparkles } from "react-icons/lu";
import { useAddFactorMutation } from "@/lib/factor/hooks";
import type { AddFactorRequest, EmissionScope } from "@/types/factor";
import type { ApiErrorBody } from "@/types/api/common";

const scopeOptions: Array<{ id: EmissionScope; label: string; description: string; disabled?: boolean }> = [
    { id: "scope-1", label: "Scope 1", description: "Direct emissions from owned/controlled sources." },
    { id: "scope-2", label: "Scope 2", description: "Indirect emissions from purchased electricity.", disabled: true },
    { id: "scope-3", label: "Scope 3", description: "All other indirect value-chain emissions.", disabled: true },
];

const initialForm: AddFactorRequest = {
    fuelName: "Petrol 2 (100% mineral petrol)",
    fuelType: "Liquid fuels 2",
    unit: "tonnes",
    co2eTotal: 3154.08213,
    co2Factor: 3135,
    ch4Factor: 11.0432,
    n2oFactor: 8.03893,
    convertTo: "kg",
};

export function ScopeFactorSettings() {
    const [activeScope, setActiveScope] = useState<EmissionScope>("scope-1");
    const [form, setForm] = useState<AddFactorRequest>(initialForm);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [errorText, setErrorText] = useState<string | null>(null);
    const addFactorMutation = useAddFactorMutation();

    const payloadPreview = useMemo(() => form, [form]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFeedback(null);
        setErrorText(null);

        try {
            await addFactorMutation.mutateAsync(form);
            setFeedback("Scope-1 factor saved successfully.");
        } catch (error) {
            if (error instanceof AxiosError) {
                const body = error.response?.data as ApiErrorBody | undefined;
                setErrorText(body?.response ?? body?.message ?? "Unable to save factor right now.");
                return;
            }
            setErrorText("Unable to save factor right now.");
        }
    }

    return (
        <section className="mt-5 rounded-2xl border border-white/70 bg-white/78 p-4 shadow-sm sm:p-5">
            <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-emerald-900/75">
                        <LuCog className="h-3.5 w-3.5" />
                        Settings · Emission factors
                    </p>
                    <h2 className="mt-2 text-xl font-bold tracking-tight text-emerald-950">Factor scope configuration</h2>
                    <p className="mt-1 max-w-2xl text-sm text-slate-700">
                        Create and govern emission factors with typed payloads and secure token-auth API operations.
                    </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-900/10 bg-emerald-50/80 px-3 py-2 text-xs font-semibold text-emerald-900">
                    <LuSparkles className="h-4 w-4" />
                    Pro controls
                </span>
            </header>

            <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]">
                <div className="space-y-3">
                    {scopeOptions.map((scope) => {
                        const isActive = activeScope === scope.id;
                        return (
                            <button
                                key={scope.id}
                                type="button"
                                disabled={scope.disabled}
                                onClick={() => setActiveScope(scope.id)}
                                className={[
                                    "w-full rounded-2xl border px-4 py-3 text-left transition",
                                    scope.disabled
                                        ? "cursor-not-allowed border-slate-200 bg-slate-100/70 text-slate-500"
                                        : isActive
                                          ? "border-emerald-300 bg-emerald-50/75 shadow-sm"
                                          : "border-emerald-900/10 bg-white/80 hover:border-emerald-300/60 hover:bg-white",
                                ].join(" ")}>
                                <p className="text-sm font-bold text-slate-900">{scope.label}</p>
                                <p className="mt-1 text-xs text-slate-600">{scope.description}</p>
                            </button>
                        );
                    })}
                </div>

                <form onSubmit={handleSubmit} className="rounded-2xl border border-emerald-900/10 bg-white/85 p-4">
                    <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                        <LuLeaf className="h-3.5 w-3.5" />
                        Active scope: Scope 1
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Fuel name">
                            <input value={form.fuelName} onChange={(e) => setForm((p) => ({ ...p, fuelName: e.target.value }))} className={inputClass} />
                        </Field>
                        <Field label="Fuel type">
                            <input value={form.fuelType} onChange={(e) => setForm((p) => ({ ...p, fuelType: e.target.value }))} className={inputClass} />
                        </Field>
                        <Field label="Unit">
                            <input value={form.unit} onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))} className={inputClass} />
                        </Field>
                        <Field label="Convert to">
                            <input value={form.convertTo} onChange={(e) => setForm((p) => ({ ...p, convertTo: e.target.value }))} className={inputClass} />
                        </Field>
                        <Field label="CO2e total">
                            <input type="number" step="0.00001" value={form.co2eTotal} onChange={(e) => setForm((p) => ({ ...p, co2eTotal: Number(e.target.value || 0) }))} className={inputClass} />
                        </Field>
                        <Field label="CO2 factor">
                            <input type="number" step="0.00001" value={form.co2Factor} onChange={(e) => setForm((p) => ({ ...p, co2Factor: Number(e.target.value || 0) }))} className={inputClass} />
                        </Field>
                        <Field label="CH4 factor">
                            <input type="number" step="0.00001" value={form.ch4Factor} onChange={(e) => setForm((p) => ({ ...p, ch4Factor: Number(e.target.value || 0) }))} className={inputClass} />
                        </Field>
                        <Field label="N2O factor">
                            <input type="number" step="0.00001" value={form.n2oFactor} onChange={(e) => setForm((p) => ({ ...p, n2oFactor: Number(e.target.value || 0) }))} className={inputClass} />
                        </Field>
                    </div>

                    <button
                        type="submit"
                        disabled={addFactorMutation.isPending || activeScope !== "scope-1"}
                        className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
                        {addFactorMutation.isPending ? <LuLoaderCircle className="h-4 w-4 animate-spin" /> : <LuSave className="h-4 w-4" />}
                        Save Scope-1 factor
                    </button>
                    {feedback ? (
                        <p className="mt-3 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-900">
                            <LuCircleCheck className="h-4 w-4" />
                            {feedback}
                        </p>
                    ) : null}
                    {errorText ? <p className="mt-3 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{errorText}</p> : null}
                </form>
            </div>

            <div className="mt-4 rounded-xl border border-emerald-900/10 bg-emerald-950 p-3">
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100/85">
                    <LuFlaskConical className="h-3.5 w-3.5" />
                    Payload preview
                </p>
                <pre className="max-h-48 overflow-auto text-xs text-emerald-100">{JSON.stringify(payloadPreview, null, 2)}</pre>
            </div>
        </section>
    );
}

const inputClass =
    "h-10 w-full rounded-xl border border-emerald-900/15 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-200/45";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-900/65">{label}</span>
            {children}
        </label>
    );
}
