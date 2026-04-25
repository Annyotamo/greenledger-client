"use client";

import { useMemo, useState } from "react";

const TEMPLATE = {
  fuelName: "T4",
  fuelType: "T3",
  unit: "tonnes",
  co2eTotal: 3154.08213,
  co2Factor: 3135,
  ch4Factor: 11.0432,
  n2oFactor: 8.03893,
  convertTo: "kg",
  emissionStandard: {
    source: "DEFRA",
    gwpBasis: "AR5",
    version: "2025",
  },
  year: "2025",
  facilityName: "Siliguri",
};

type FactorFormState = typeof TEMPLATE;

type SubmitResult = { ok: boolean; status?: number; body?: any; message?: string } | null;

type FactorRow = {
  id: string;
  fuelName: string;
  fuelType: string;
  unit: string;
  co2eTotal: number;
  co2Factor: number;
  ch4Factor: number;
  n2oFactor: number;
  emissionStandard: { gwpBasis: string; source: string; version: string };
  year: string;
  convertTo: string;
  creationDateString?: string;
  updateDateString?: string;
  updatedby?: unknown;
};

function asNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function inputBaseClass(invalid?: boolean) {
  return [
    "w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition",
    "border-black/10 focus:border-black/20 focus:ring-4 focus:ring-black/5",
    invalid ? "border-red-400/70 focus:border-red-400/70 focus:ring-red-500/10" : "",
  ].join(" ");
}

function labelClass() {
  return "text-[12px] font-medium text-black/70";
}

function sectionTitleClass() {
  return "text-sm font-semibold";
}

function helpTextClass() {
  return "text-[12px] text-(--muted)";
}

export function AddFactorForm() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult>(null);
  const [form, setForm] = useState<FactorFormState>(TEMPLATE);
  const [tab, setTab] = useState<"add" | "view" | "upload">("add");

  const [loadingFactors, setLoadingFactors] = useState(false);
  const [factorsResult, setFactorsResult] = useState<SubmitResult>(null);
  const [factors, setFactors] = useState<FactorRow[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<SubmitResult>(null);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.fuelName.trim()) e.fuelName = "Fuel name is required.";
    if (!form.fuelType.trim()) e.fuelType = "Fuel type is required.";
    if (!form.facilityName.trim()) e.facilityName = "Facility name is required.";
    if (!form.unit.trim()) e.unit = "Unit is required.";
    if (!form.convertTo.trim()) e.convertTo = "Convert-to unit is required.";
    if (!form.year.trim()) e.year = "Year is required.";
    if (!form.emissionStandard.source.trim()) e.source = "Source is required.";
    if (!form.emissionStandard.gwpBasis.trim()) e.gwpBasis = "GWP basis is required.";
    if (!form.emissionStandard.version.trim()) e.version = "Version is required.";

    const numbers: Array<keyof FactorFormState> = ["co2eTotal", "co2Factor", "ch4Factor", "n2oFactor"];
    for (const k of numbers) {
      const v = form[k];
      if (typeof v !== "number" || !Number.isFinite(v)) e[String(k)] = "Must be a valid number.";
    }
    return e;
  }, [form]);

  const canSubmit = Object.keys(errors).length === 0 && !submitting;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return factors;
    return factors.filter((f) => {
      const hay = [
        f.fuelName,
        f.fuelType,
        f.unit,
        f.convertTo,
        f.year,
        f.emissionStandard?.source,
        f.emissionStandard?.gwpBasis,
        f.emissionStandard?.version,
        f.creationDateString,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [factors, query]);

  const totalPages = useMemo(() => {
    const total = filtered.length;
    const size = Math.max(1, pageSize);
    return Math.max(1, Math.ceil(total / size));
  }, [filtered.length, pageSize]);

  const pageSafe = Math.min(Math.max(1, page), totalPages);

  const paged = useMemo(() => {
    const size = Math.max(1, pageSize);
    const start = (pageSafe - 1) * size;
    return filtered.slice(start, start + size);
  }, [filtered, pageSafe, pageSize]);

  function set<K extends keyof FactorFormState>(key: K, value: FactorFormState[K]) {
    setForm((cur) => ({ ...cur, [key]: value }));
  }

  function setEmission<K extends keyof FactorFormState["emissionStandard"]>(
    key: K,
    value: FactorFormState["emissionStandard"][K],
  ) {
    setForm((cur) => ({ ...cur, emissionStandard: { ...cur.emissionStandard, [key]: value } }));
  }

  async function fetchFactors() {
    setFactorsResult(null);
    setLoadingFactors(true);
    try {
      const res = await fetch("/api/factor/getFactor", { method: "GET" });
      const body = await res.json().catch(() => null);
      const next = Array.isArray(body?.data) ? (body.data as FactorRow[]) : [];
      setFactors(next);
      setPage(1);
      setFactorsResult({ ok: res.ok, status: res.status, body, message: body?.message });
    } catch (e) {
      setFactorsResult({ ok: false, message: e instanceof Error ? e.message : "Request failed" });
    } finally {
      setLoadingFactors(false);
    }
  }

  async function submit() {
    setResult(null);
    if (!canSubmit) {
      setResult({ ok: false, message: "Please fix the highlighted fields and try again." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/factor/superAdmin/addFactor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const body = await res.json().catch(() => null);
      setResult({ ok: res.ok, status: res.status, body, message: body?.message });
      if (res.ok) {
        setTab("view");
        await fetchFactors();
      }
    } catch (e) {
      setResult({ ok: false, message: e instanceof Error ? e.message : "Request failed" });
    } finally {
      setSubmitting(false);
    }
  }

  async function onPickFile(file: File | null) {
    setCsvFile(file);
    setUploadResult(null);
  }

  async function uploadCsv() {
    setUploadResult(null);
    if (!csvFile) {
      setUploadResult({ ok: false, message: "Please choose a CSV file first." });
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", csvFile, csvFile.name);

      const res = await fetch("/api/factor/superAdmin/uploadFactor", { method: "POST", body: fd });
      const body = await res.json().catch(() => null);
      setUploadResult({ ok: res.ok, status: res.status, body, message: body?.message });
      if (res.ok) {
        setTab("view");
        await fetchFactors();
      }
    } catch (e) {
      setUploadResult({ ok: false, message: e instanceof Error ? e.message : "Upload failed" });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="gl-card p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Scope 1 • Factors</h1>
          <p className="mt-1 text-sm text-(--muted)">
            Add a factor to the database (Super Admin).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full bg-white/70 p-1 ring-1 ring-black/5 shadow-[0_18px_50px_-45px_rgba(15,23,42,0.35)]">
            <button
              type="button"
              className={[
                "px-3 py-2 text-sm rounded-full transition font-medium",
                tab === "add" ? "bg-black/6 text-black" : "text-black/70 hover:bg-black/5",
              ].join(" ")}
              onClick={() => setTab("add")}
              disabled={submitting || loadingFactors || uploading}
            >
              Add
            </button>
            <button
              type="button"
              className={[
                "px-3 py-2 text-sm rounded-full transition font-medium",
                tab === "view" ? "bg-black/6 text-black" : "text-black/70 hover:bg-black/5",
              ].join(" ")}
              onClick={() => {
                setTab("view");
                if (!factors.length) void fetchFactors();
              }}
              disabled={submitting || loadingFactors || uploading}
            >
              View
            </button>
            <button
              type="button"
              className={[
                "px-3 py-2 text-sm rounded-full transition font-medium",
                tab === "upload" ? "bg-black/6 text-black" : "text-black/70 hover:bg-black/5",
              ].join(" ")}
              onClick={() => setTab("upload")}
              disabled={submitting || loadingFactors || uploading}
            >
              Upload CSV
            </button>
          </div>

          <button
            type="button"
            className="px-3 py-2 rounded-xl bg-white/70 text-sm font-medium ring-1 ring-black/5 hover:bg-white/90 transition disabled:opacity-60"
            onClick={() => {
              setForm(TEMPLATE);
              setResult(null);
            }}
            disabled={submitting}
          >
            Reset
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-(--brand) text-white text-sm font-medium shadow-sm disabled:opacity-60"
            onClick={submit}
            disabled={tab !== "add" || !canSubmit}
          >
            {submitting ? "Adding…" : "Add factor"}
          </button>
        </div>
      </div>

      {result ? (
        <div
          className={[
            "mt-5 rounded-2xl px-4 py-3 text-sm ring-1",
            result.ok
              ? "bg-emerald-50/60 ring-emerald-200/70 text-emerald-950"
              : "bg-red-50/60 ring-red-200/70 text-red-900",
          ].join(" ")}
        >
          <div className="font-semibold">
            {result.ok ? "Saved successfully." : "Couldn’t save."}
            {typeof result.status === "number" ? (
              <span className="font-medium text-black/40"> (HTTP {result.status})</span>
            ) : null}
          </div>
          {result.ok ? null : (
            <div className="mt-1 text-black/60">{result.message ?? "Please check your inputs and try again."}</div>
          )}
        </div>
      ) : null}

      {tab === "add" ? (
        <div className="mt-6 min-w-0">
          <div className="rounded-2xl bg-white/60 p-4 ring-1 ring-black/5 shadow-[0_18px_50px_-45px_rgba(15,23,42,0.28)]">
            <div className={sectionTitleClass()}>Basic details</div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className={labelClass()}>Facility name</div>
                <input
                  value={form.facilityName}
                  onChange={(e) => set("facilityName", e.target.value)}
                  className={inputBaseClass(Boolean(errors.facilityName))}
                  placeholder="e.g. Siliguri"
                />
                {errors.facilityName ? <div className="mt-1 text-[12px] text-red-600">{errors.facilityName}</div> : null}
              </div>

              <div>
                <div className={labelClass()}>Year</div>
                <input
                  value={form.year}
                  onChange={(e) => set("year", e.target.value)}
                  className={inputBaseClass(Boolean(errors.year))}
                  placeholder="e.g. 2025"
                />
                {errors.year ? <div className="mt-1 text-[12px] text-red-600">{errors.year}</div> : null}
              </div>

              <div>
                <div className={labelClass()}>Fuel name</div>
                <input
                  value={form.fuelName}
                  onChange={(e) => set("fuelName", e.target.value)}
                  className={inputBaseClass(Boolean(errors.fuelName))}
                  placeholder="e.g. Diesel"
                />
                {errors.fuelName ? <div className="mt-1 text-[12px] text-red-600">{errors.fuelName}</div> : null}
              </div>

              <div>
                <div className={labelClass()}>Fuel type</div>
                <input
                  value={form.fuelType}
                  onChange={(e) => set("fuelType", e.target.value)}
                  className={inputBaseClass(Boolean(errors.fuelType))}
                  placeholder="e.g. Mobile combustion"
                />
                {errors.fuelType ? <div className="mt-1 text-[12px] text-red-600">{errors.fuelType}</div> : null}
              </div>

              <div>
                <div className={labelClass()}>Unit</div>
                <input
                  value={form.unit}
                  onChange={(e) => set("unit", e.target.value)}
                  className={inputBaseClass(Boolean(errors.unit))}
                  placeholder="e.g. tonnes"
                />
                {errors.unit ? <div className="mt-1 text-[12px] text-red-600">{errors.unit}</div> : null}
              </div>

              <div>
                <div className={labelClass()}>Convert to</div>
                <input
                  value={form.convertTo}
                  onChange={(e) => set("convertTo", e.target.value)}
                  className={inputBaseClass(Boolean(errors.convertTo))}
                  placeholder="e.g. kg"
                />
                {errors.convertTo ? <div className="mt-1 text-[12px] text-red-600">{errors.convertTo}</div> : null}
              </div>
            </div>
            <div className={["mt-3", helpTextClass()].join(" ")}>
              Tip: you can keep units as free text for now (backend validates as needed).
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white/60 p-4 ring-1 ring-black/5 shadow-[0_18px_50px_-45px_rgba(15,23,42,0.28)]">
            <div className={sectionTitleClass()}>Emission factors</div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className={labelClass()}>CO2e total</div>
                <input
                  inputMode="decimal"
                  value={String(form.co2eTotal)}
                  onChange={(e) => {
                    const n = asNumber(e.target.value);
                    set("co2eTotal", n ?? (Number.NaN as any));
                  }}
                  className={inputBaseClass(Boolean(errors.co2eTotal))}
                  placeholder="e.g. 3154.08213"
                />
                {errors.co2eTotal ? <div className="mt-1 text-[12px] text-red-600">{errors.co2eTotal}</div> : null}
              </div>

              <div>
                <div className={labelClass()}>CO2 factor</div>
                <input
                  inputMode="decimal"
                  value={String(form.co2Factor)}
                  onChange={(e) => {
                    const n = asNumber(e.target.value);
                    set("co2Factor", n ?? (Number.NaN as any));
                  }}
                  className={inputBaseClass(Boolean(errors.co2Factor))}
                  placeholder="e.g. 3135"
                />
                {errors.co2Factor ? <div className="mt-1 text-[12px] text-red-600">{errors.co2Factor}</div> : null}
              </div>

              <div>
                <div className={labelClass()}>CH4 factor</div>
                <input
                  inputMode="decimal"
                  value={String(form.ch4Factor)}
                  onChange={(e) => {
                    const n = asNumber(e.target.value);
                    set("ch4Factor", n ?? (Number.NaN as any));
                  }}
                  className={inputBaseClass(Boolean(errors.ch4Factor))}
                  placeholder="e.g. 11.0432"
                />
                {errors.ch4Factor ? <div className="mt-1 text-[12px] text-red-600">{errors.ch4Factor}</div> : null}
              </div>

              <div>
                <div className={labelClass()}>N2O factor</div>
                <input
                  inputMode="decimal"
                  value={String(form.n2oFactor)}
                  onChange={(e) => {
                    const n = asNumber(e.target.value);
                    set("n2oFactor", n ?? (Number.NaN as any));
                  }}
                  className={inputBaseClass(Boolean(errors.n2oFactor))}
                  placeholder="e.g. 8.03893"
                />
                {errors.n2oFactor ? <div className="mt-1 text-[12px] text-red-600">{errors.n2oFactor}</div> : null}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white/60 p-4 ring-1 ring-black/5 shadow-[0_18px_50px_-45px_rgba(15,23,42,0.28)]">
            <div className={sectionTitleClass()}>Emission standard</div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <div className={labelClass()}>Source</div>
                <input
                  value={form.emissionStandard.source}
                  onChange={(e) => setEmission("source", e.target.value)}
                  className={inputBaseClass(Boolean(errors.source))}
                  placeholder="e.g. DEFRA"
                />
                {errors.source ? <div className="mt-1 text-[12px] text-red-600">{errors.source}</div> : null}
              </div>
              <div>
                <div className={labelClass()}>GWP basis</div>
                <input
                  value={form.emissionStandard.gwpBasis}
                  onChange={(e) => setEmission("gwpBasis", e.target.value)}
                  className={inputBaseClass(Boolean(errors.gwpBasis))}
                  placeholder="e.g. AR5"
                />
                {errors.gwpBasis ? <div className="mt-1 text-[12px] text-red-600">{errors.gwpBasis}</div> : null}
              </div>
              <div>
                <div className={labelClass()}>Version</div>
                <input
                  value={form.emissionStandard.version}
                  onChange={(e) => setEmission("version", e.target.value)}
                  className={inputBaseClass(Boolean(errors.version))}
                  placeholder="e.g. 2025"
                />
                {errors.version ? <div className="mt-1 text-[12px] text-red-600">{errors.version}</div> : null}
              </div>
            </div>
          </div>
        </div>
      ) : tab === "view" ? (
        <div className="mt-6 rounded-2xl bg-white/60 p-4 ring-1 ring-black/5 shadow-[0_18px_50px_-45px_rgba(15,23,42,0.28)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className={sectionTitleClass()}>All factors</div>
              <div className={helpTextClass()}>
                Loaded: <span className="font-medium text-black/70">{factors.length}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search fuel, year, unit, source…"
                  className="w-72 max-w-[75vw] rounded-xl bg-white/90 px-3 py-2 text-sm outline-none ring-1 ring-black/10 focus:ring-4 focus:ring-black/5"
                />
              </div>
              <select
                value={String(pageSize)}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-xl bg-white/90 px-3 py-2 text-sm font-medium text-black/70 outline-none ring-1 ring-black/10 focus:ring-4 focus:ring-black/5"
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}/page
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="px-3 py-2 rounded-xl bg-white/90 text-sm font-medium ring-1 ring-black/10 hover:bg-white transition disabled:opacity-60"
                onClick={fetchFactors}
                disabled={loadingFactors}
              >
                {loadingFactors ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          </div>

          {factorsResult && !factorsResult.ok ? (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50/40 p-3 text-sm">
              <div className="font-medium">Couldn’t load factors</div>
              <pre className="mt-2 whitespace-pre-wrap text-[12px] leading-5 text-(--muted)">
                {JSON.stringify(factorsResult.body ?? { message: factorsResult.message }, null, 2)}
              </pre>
            </div>
          ) : null}

          <div className="mt-4 overflow-hidden rounded-2xl bg-white/90 ring-1 ring-black/10">
            <div className="overflow-auto">
              <table className="min-w-[920px] w-full text-sm">
                    <thead className="bg-black/2">
                      <tr className="text-left text-[12px] text-black/60">
                        <th className="px-4 py-3 font-medium">Fuel</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Year</th>
                        <th className="px-4 py-3 font-medium">Unit →</th>
                        <th className="px-4 py-3 font-medium">Source</th>
                        <th className="px-4 py-3 font-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paged.map((f) => {
                        return (
                          <tr
                            key={f.id}
                            className="border-t border-black/5 hover:bg-black/2"
                          >
                            <td className="px-4 py-3">
                              <div className="font-medium text-black/80">{f.fuelName}</div>
                              <div className="text-[12px] text-(--muted)">#{f.id.slice(0, 10)}…</div>
                            </td>
                            <td className="px-4 py-3 text-black/70">{f.fuelType}</td>
                            <td className="px-4 py-3 text-black/70">{f.year}</td>
                            <td className="px-4 py-3 text-black/70">
                              {f.unit} <span className="text-black/30">→</span> {f.convertTo}
                            </td>
                            <td className="px-4 py-3 text-black/70">{f.emissionStandard?.source ?? "-"}</td>
                            <td className="px-4 py-3 text-black/70">{f.creationDateString ?? "-"}</td>
                          </tr>
                        );
                      })}
                      {!loadingFactors && paged.length === 0 ? (
                        <tr className="border-t border-black/5">
                          <td className="px-4 py-8 text-(--muted)" colSpan={6}>
                            No factors found.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[12px] text-black/50">
              Showing{" "}
              <span className="font-medium text-black/70">
                {filtered.length ? (pageSafe - 1) * pageSize + 1 : 0}
              </span>
              {" – "}
              <span className="font-medium text-black/70">
                {Math.min(pageSafe * pageSize, filtered.length)}
              </span>{" "}
              of <span className="font-medium text-black/70">{filtered.length}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage(1)}
                disabled={pageSafe <= 1}
                className="px-3 py-2 rounded-xl bg-white/90 text-sm font-medium ring-1 ring-black/10 hover:bg-white transition disabled:opacity-50"
              >
                First
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pageSafe <= 1}
                className="px-3 py-2 rounded-xl bg-white/90 text-sm font-medium ring-1 ring-black/10 hover:bg-white transition disabled:opacity-50"
              >
                Prev
              </button>
              <div className="text-sm font-semibold text-black/70">
                Page {pageSafe} / {totalPages}
              </div>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={pageSafe >= totalPages}
                className="px-3 py-2 rounded-xl bg-white/90 text-sm font-medium ring-1 ring-black/10 hover:bg-white transition disabled:opacity-50"
              >
                Next
              </button>
              <button
                type="button"
                onClick={() => setPage(totalPages)}
                disabled={pageSafe >= totalPages}
                className="px-3 py-2 rounded-xl bg-white/90 text-sm font-medium ring-1 ring-black/10 hover:bg-white transition disabled:opacity-50"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-black/5 bg-white/60 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className={sectionTitleClass()}>Upload scope 1 factors (CSV)</div>
                  <div className={helpTextClass()}>
                    Uploads to <span className="font-mono">POST /factor/superAdmin/uploadFactor</span>.
                  </div>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-(--brand) text-white text-sm font-medium shadow-sm disabled:opacity-60"
                  onClick={uploadCsv}
                  disabled={!csvFile || uploading}
                >
                  {uploading ? "Uploading…" : "Upload"}
                </button>
              </div>

              <div className="mt-4">
                <label
                  className={[
                    "block rounded-2xl border border-dashed border-black/15 bg-white/60 p-5",
                    "hover:bg-white transition cursor-pointer",
                  ].join(" ")}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files?.[0] ?? null;
                    if (f) void onPickFile(f);
                  }}
                >
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      void onPickFile(f);
                    }}
                  />
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium">Drop your CSV here</div>
                      <div className={helpTextClass()}>or click to browse</div>
                    </div>
                    <div className="text-[12px] text-black/60">
                      {csvFile ? (
                        <span className="font-medium text-black/70">{csvFile.name}</span>
                      ) : (
                        "No file selected"
                      )}
                    </div>
                  </div>
                </label>
              </div>

              {null}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-black/5 bg-white/60 p-4">
              <div className={sectionTitleClass()}>Response</div>
              <div className={helpTextClass()}>Shown after upload completes.</div>

              {uploadResult ? (
                <div
                  className={[
                    "mt-3 rounded-2xl border p-4 text-sm",
                    uploadResult.ok ? "border-emerald-200 bg-emerald-50/40" : "border-red-200 bg-red-50/40",
                  ].join(" ")}
                >
                  <div className="font-medium">
                    {uploadResult.ok ? "Uploaded" : "Upload failed"}
                    {typeof uploadResult.status === "number" ? (
                      <span className="text-(--muted)"> (HTTP {uploadResult.status})</span>
                    ) : null}
                  </div>
                  <pre className="mt-2 whitespace-pre-wrap text-[12px] leading-5 text-(--muted)">
                    {JSON.stringify(uploadResult.body ?? { message: uploadResult.message }, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="mt-3 rounded-xl border border-black/10 bg-white p-3 text-sm text-(--muted)">
                  No upload yet.
                </div>
              )}

              <div className="mt-4 rounded-xl border border-black/10 bg-white p-3">
                <div className="text-[12px] font-medium text-black/70">CSV columns</div>
                <div className={["mt-1", helpTextClass()].join(" ")}>
                  Your screenshot suggests headers like <span className="font-mono">Activity</span>,{" "}
                  <span className="font-mono">Fuel</span>, <span className="font-mono">Unit</span>, multiple{" "}
                  <span className="font-mono">kg CO2e</span> columns, emission standard, year, source type, version,
                  output unit. The backend decides the exact mapping.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

