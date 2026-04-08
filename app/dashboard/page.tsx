"use client";

import { Sidebar } from "@/components/dashboard/SidebarShell";

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full text-slate-900">
      <div className="md:pl-72">
        <Sidebar />
        <main className="pt-16 md:pt-8 px-4 sm:px-5 md:px-8 lg:px-10">
          <section className="section-bg rounded-2xl border border-white/60 shadow-xl backdrop-blur-md h-[calc(100vh-6.5rem)] md:h-[calc(100vh-7rem)] flex flex-col items-center justify-center text-center px-6 sm:px-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-900/80 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-700 ring-1 ring-emerald-900/10" />
              <span>Dashboard</span>
              <span className="text-slate-700/80">finance‑grade ESG &amp; GHG</span>
            </div>

            <h1 className="mt-7 max-w-3xl text-balance text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-emerald-950">
              ESG &amp; GHG cockpit coming{" "}
              <span className="bg-linear-to-r from-emerald-800 via-emerald-700 to-emerald-600 bg-clip-text text-transparent">
                very soon
              </span>
              .
            </h1>

            <p className="max-w-xl text-sm sm:text-base text-slate-700 mb-8">
              This space will surface scope‑1 to scope‑3 emissions, ESG accounting
              ledgers, finance‑grade disclosures, and audit‑ready evidence in a single
              control tower once data pipelines are connected.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[0.75rem] text-slate-700">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 border border-emerald-900/10 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-700 ring-1 ring-emerald-900/10" />
                Live evidence trails
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 border border-emerald-900/10 shadow-sm">
                Scope‑1, 2, 3 ready
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 border border-emerald-900/10 shadow-sm">
                Finance‑grade ESG ledgers
              </span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

