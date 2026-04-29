"use client";

import { useMemo, useState } from "react";

type Scope2VersionForm = {
  factorSource: string;
  version: string;
  year: string;
  inputUnit: string;
  factor: string;
};

type SubmitResult = { ok: boolean; status?: number; body?: unknown; message?: string } | null;

const TEMPLATE: Scope2VersionForm = {
  factorSource: "CEA",
  version: "v20.0",
  year: "2024",
  inputUnit: "kWh",
  factor: "10",
};

function inputClass(invalid?: boolean) {
  return [
    "w-full rounded-xl bg-white/90 px-3 py-2.5 text-sm outline-none ring-1 transition",
    invalid ? "ring-red-300 focus:ring-red-400" : "ring-black/10 focus:ring-black/25",
  ].join(" ");
}

function labelClass() {
  return "text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55";
}

export function AddScope2VersionForm() {
  const [form, setForm] = useState<Scope2VersionForm>(TEMPLATE);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult>(null);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.factorSource.trim()) e.factorSource = "Source is required.";
    if (!form.version.trim()) e.version = "Version is required.";
    if (!form.inputUnit.trim()) e.inputUnit = "Input unit is required.";
    if (!form.factor.trim()) e.factor = "Factor is required.";

    const yearNum = Number(form.year);
    if (!form.year.trim() || !Number.isFinite(yearNum) || yearNum <= 0) {
      e.year = "Enter a valid year.";
    }
    return e;
  }, [form]);

  const canSubmit = !submitting && Object.keys(errors).length === 0;

  function set<K extends keyof Scope2VersionForm>(key: K, value: Scope2VersionForm[K]) {
    setForm((cur) => ({ ...cur, [key]: value }));
  }

  async function submit() {
    setResult(null);
    if (!canSubmit) {
      setResult({ ok: false, message: "Please fix the highlighted fields and try again." });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        factorSource: form.factorSource.trim(),
        version: form.version.trim(),
        year: Number(form.year),
        inputUnit: form.inputUnit.trim(),
        factor: form.factor.trim(),
      };

      const res = await fetch("/api/scope2Ingest/addScope2Emission/version", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => null);
      setResult({ ok: res.ok, status: res.status, body, message: (body as any)?.message });
    } catch (e) {
      setResult({ ok: false, message: e instanceof Error ? e.message : "Request failed." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="gl-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Scope 2 • Factors</h1>
          <p className="mt-1 text-sm text-(--muted)">
            Add version-specific Scope 2 emission factors.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setForm(TEMPLATE);
            setResult(null);
          }}
          className="rounded-xl bg-white px-4 py-2 text-sm font-medium ring-1 ring-black/10 transition hover:bg-black/5"
        >
          Reset
        </button>
      </div>

      <div className="mt-5 rounded-2xl bg-white/60 p-4 ring-1 ring-black/5 shadow-[0_18px_50px_-45px_rgba(15,23,42,0.28)]">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className={labelClass()}>Factor source</div>
            <input
              value={form.factorSource}
              onChange={(e) => set("factorSource", e.target.value)}
              className={inputClass(Boolean(errors.factorSource))}
              placeholder="e.g. CEA"
            />
            {errors.factorSource ? <p className="mt-1 text-[12px] text-red-600">{errors.factorSource}</p> : null}
          </div>

          <div>
            <div className={labelClass()}>Version</div>
            <input
              value={form.version}
              onChange={(e) => set("version", e.target.value)}
              className={inputClass(Boolean(errors.version))}
              placeholder="e.g. v20.0"
            />
            {errors.version ? <p className="mt-1 text-[12px] text-red-600">{errors.version}</p> : null}
          </div>

          <div>
            <div className={labelClass()}>Year</div>
            <input
              inputMode="numeric"
              value={form.year}
              onChange={(e) => set("year", e.target.value)}
              className={inputClass(Boolean(errors.year))}
              placeholder="e.g. 2024"
            />
            {errors.year ? <p className="mt-1 text-[12px] text-red-600">{errors.year}</p> : null}
          </div>

          <div>
            <div className={labelClass()}>Input unit</div>
            <input
              value={form.inputUnit}
              onChange={(e) => set("inputUnit", e.target.value)}
              className={inputClass(Boolean(errors.inputUnit))}
              placeholder="e.g. kWh"
            />
            {errors.inputUnit ? <p className="mt-1 text-[12px] text-red-600">{errors.inputUnit}</p> : null}
          </div>

          <div className="sm:col-span-2">
            <div className={labelClass()}>Factor</div>
            <input
              value={form.factor}
              onChange={(e) => set("factor", e.target.value)}
              className={inputClass(Boolean(errors.factor))}
              placeholder="e.g. 10"
            />
            {errors.factor ? <p className="mt-1 text-[12px] text-red-600">{errors.factor}</p> : null}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="rounded-xl bg-(--brand) px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-105 disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Scope 2 version"}
          </button>
        </div>
      </div>

      {result ? (
        <div
          className={[
            "mt-4 rounded-2xl px-4 py-3 text-sm ring-1",
            result.ok ? "bg-emerald-50/70 ring-emerald-200 text-emerald-950" : "bg-red-50/70 ring-red-200 text-red-900",
          ].join(" ")}
        >
          <p className="font-semibold">
            {result.ok ? "Saved successfully." : "Couldn’t save."}
            {typeof result.status === "number" ? <span className="text-black/40"> (HTTP {result.status})</span> : null}
          </p>
          {!result.ok ? (
            <p className="mt-1 text-black/65">{result.message ?? "Please verify input and try again."}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

