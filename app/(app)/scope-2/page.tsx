"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { LuBolt, LuBuilding2, LuCircleDollarSign, LuFactory, LuZap } from "react-icons/lu";
import { Sidebar } from "@/components/dashboard/SidebarShell";
import { useSidebarStore } from "@/lib/sidebarStore";

function formatNumber(value: number): string {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

const DUMMY_MONTHLY = [
    { month: "Jan", mwh: 1240, cost: 18600 },
    { month: "Feb", mwh: 1188, cost: 17220 },
    { month: "Mar", mwh: 1325, cost: 19875 },
    { month: "Apr", mwh: 1290, cost: 19350 },
    { month: "May", mwh: 1362, cost: 20430 },
    { month: "Jun", mwh: 1410, cost: 21150 },
];

const DUMMY_GRID_MIX = [
    { name: "Grid (location-based)", value: 58, color: "#059669" },
    { name: "Market-based PPAs", value: 27, color: "#10b981" },
    { name: "Renewable certificates", value: 15, color: "#34d399" },
];

const DUMMY_SITES = [
    { site: "HQ — Bengaluru", mwh: 420 },
    { site: "Plant A", mwh: 380 },
    { site: "Plant B", mwh: 310 },
    { site: "Warehouse", mwh: 265 },
];

export default function Scope2DashboardPage() {
    const sidebarOpen = useSidebarStore((s) => s.isOpen);
    const setActiveSection = useSidebarStore((s) => s.setActiveSection);

    useEffect(() => {
        setActiveSection("scope-2");
    }, [setActiveSection]);

    const totals = useMemo(
        () => ({
            mwh: DUMMY_MONTHLY.reduce((a, r) => a + r.mwh, 0),
            cost: DUMMY_MONTHLY.reduce((a, r) => a + r.cost, 0),
            intensity: 0.42,
        }),
        [],
    );

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-50/50 text-slate-900">
            <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
                <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-emerald-400/20 blur-[120px] gl-drift" />
                <div className="absolute bottom-[-10%] right-[-10%] h-[60%] w-[60%] rounded-full bg-teal-300/20 blur-[150px] gl-drift-2" />
            </div>

            <Sidebar />

            <main
                className={[
                    "gl-main-offset relative z-10 px-4 pb-12 pt-20 sm:px-6 lg:pr-12 lg:pt-10",
                    !sidebarOpen ? "gl-main-offset--collapsed" : "",
                ].join(" ")}>
                <div className="mx-auto max-w-7xl">
                    <header className="mb-10 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.45 }}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-white/70 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-emerald-900 shadow-sm backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>
                            Scope-2 overview (sample data)
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.05 }}
                            className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            Purchased energy cockpit
                        </motion.h1>
                        <p className="max-w-2xl text-sm font-medium text-slate-600 sm:text-base">
                            Placeholder dashboard until Scope-2 analytics API is connected. Figures below are static
                            examples for layout and charts only.
                        </p>
                    </header>

                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                            {
                                label: "6-mo electricity (demo)",
                                value: formatNumber(totals.mwh),
                                unit: "MWh",
                                icon: <LuZap />,
                            },
                            {
                                label: "Spend (demo)",
                                value: formatNumber(totals.cost),
                                unit: "",
                                icon: <LuCircleDollarSign />,
                            },
                            {
                                label: "Sites tracked",
                                value: String(DUMMY_SITES.length),
                                unit: "",
                                icon: <LuBuilding2 />,
                            },
                            {
                                label: "Intensity (demo)",
                                value: String(totals.intensity),
                                unit: "tCO₂e / MWh",
                                icon: <LuBolt />,
                            },
                        ].map((stat, idx) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.06, duration: 0.35 }}
                                className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-100/60 blur-2xl" />
                                <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
                                    {stat.icon}
                                </div>
                                <p className="relative mt-4 text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">
                                    {stat.label}
                                </p>
                                <div className="relative mt-1 flex items-baseline gap-1.5">
                                    <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                                    {stat.unit ? (
                                        <span className="text-xs font-semibold text-slate-500">{stat.unit}</span>
                                    ) : null}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
                        <motion.section
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="rounded-3xl border border-white/60 bg-white/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                            <h2 className="text-lg font-bold text-slate-800">Monthly purchased electricity</h2>
                            <p className="mt-1 text-xs font-medium text-slate-500">Demo series (MWh vs. cost)</p>
                            <div className="mt-4 h-64 w-full min-h-[240px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={DUMMY_MONTHLY} margin={{ left: -12, right: 8, top: 8, bottom: 0 }}>
                                        <defs>
                                                    <linearGradient id="s2a" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: 12,
                                                border: "1px solid rgb(226 232 240)",
                                                fontSize: 12,
                                            }}
                                        />
                                        <Area type="monotone" dataKey="mwh" name="MWh" stroke="#10b981" strokeWidth={2} fill="url(#s2a)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.28, duration: 0.4 }}
                            className="flex flex-col rounded-3xl border border-white/60 bg-white/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                            <div className="mb-2 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Reporting mix</h2>
                                    <p className="mt-1 text-xs font-medium text-slate-500">Demo allocation</p>
                                </div>
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                    <LuFactory className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="relative min-h-[200px] flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={DUMMY_GRID_MIX}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={52}
                                            outerRadius={78}
                                            paddingAngle={3}
                                            stroke="none">
                                            {DUMMY_GRID_MIX.map((e) => (
                                                <Cell key={e.name} fill={e.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.section>
                    </div>

                    <motion.section
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.4 }}
                        className="mt-8 rounded-3xl border border-white/60 bg-white/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                        <h2 className="text-lg font-bold text-slate-800">Site consumption (demo)</h2>
                        <p className="mt-1 text-xs font-medium text-slate-500">MWh by location</p>
                        <div className="mt-4 h-56 w-full min-h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={DUMMY_SITES} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.06)" />
                                    <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                    <YAxis
                                        dataKey="site"
                                        type="category"
                                        width={120}
                                        tick={{ fontSize: 11, fill: "#475569" }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip />
                                    <Bar dataKey="mwh" name="MWh" fill="#10b981" radius={[0, 8, 8, 0]} barSize={22} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.section>
                </div>
            </main>
        </div>
    );
}
