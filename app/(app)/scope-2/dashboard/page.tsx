"use client";

import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Sidebar } from "@/components/dashboard/SidebarShell";

// Chart data
const monthlyEnergyData = [
    { month: "Apr", captive: 3200, grid: 800 },
    { month: "May", captive: 3400, grid: 750 },
    { month: "Jun", captive: 3100, grid: 900 },
    { month: "Jul", captive: 3300, grid: 700 },
    { month: "Aug", captive: 3500, grid: 850 },
    { month: "Sep", captive: 3200, grid: 800 },
    { month: "Oct", captive: 3600, grid: 900 },
    { month: "Nov", captive: 3400, grid: 1000 },
    { month: "Dec", captive: 3800, grid: 900 },
];

const energyMixData = [
    { name: "Captive", value: 79, fill: "#10b981" },
    { name: "Grid", value: 21, fill: "#cbd5e1" },
];

const captiveSourceData = [
    { source: "WHRB 3 DRI Kilns", value: 19200, fill: "#10b981" },
    { source: "CFBC Coal", value: 4800, fill: "#f97316" },
    { source: "CFBC Dolochar", value: 2200, fill: "#f59e0b" },
    { source: "AFBC Coal", value: 1800, fill: "#fb923c" },
    { source: "AFBC Dolochar", value: 1400, fill: "#fbbf24" },
    { source: "Solar Rooftop", value: 1000, fill: "#3b82f6" },
];

const fuelMixData = [
    { category: "CFBC", coal: 4800, dolochar: 2200 },
    { category: "AFBC", coal: 1800, dolochar: 1400 },
];

const hierarchyData = [
    { source: "Captive WHRB", value: 19200, fill: "#10b981" },
    { source: "Captive CFBC+AFBC", value: 9800, fill: "#f97316" },
    { source: "Renewable Solar", value: 1000, fill: "#3b82f6" },
    { source: "Grid DISCOM", value: 8200, fill: "#cbd5e1" },
];

export default function Scope2Dashboard() {
    return (
        <div className="flex min-h-screen bg-white lg:bg-slate-50">
            <Sidebar />

            <main className="flex-1 pt-16 lg:pt-0 lg:ml-60 pb-8">
                <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            GREENLEDGER · ENERGY MODULE · FY 2024–25
                        </p>
                        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-3">
                            Energy Consumption Dashboard
                        </h1>
                        <p className="mt-2 text-sm lg:text-base text-slate-600">
                            Shyam Steel — DRI / Sponge Iron Plant · Captive vs. Grid Energy Bifurcation
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard
                            label="TOTAL ENERGY CONSUMED"
                            value="38,600"
                            unit="MWh"
                            description="FY 2024–25 (9 months)"
                        />
                        <StatCard
                            label="CAPTIVE GENERATED"
                            value="30,400"
                            unit="MWh"
                            description="79% of total consumption"
                        />
                        <StatCard label="GRID SOURCED" value="8,200" unit="MWh" description="21% from DISCOM" />
                        <StatCard label="GRID DISPLACEMENT" value="56" unit="%" description="vs. FY 2023-24 baseline" />
                    </div>

                    {/* Charts Row 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                Monthly Captive vs. Grid Energy
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={monthlyEnergyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCaptive" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                                        </linearGradient>
                                        <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.01} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: "12px" }} />
                                    <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="captive"
                                        stroke="#10b981"
                                        fillOpacity={1}
                                        fill="url(#colorCaptive)"
                                        name="Captive"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="grid"
                                        stroke="#f59e0b"
                                        fillOpacity={1}
                                        fill="url(#colorGrid)"
                                        name="Grid"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Energy Mix Pie */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">December Energy Mix</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={energyMixData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        dataKey="value">
                                        {energyMixData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-700">Captive</span>
                                    <span className="text-sm font-semibold text-slate-900">79%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: "79%" }} />
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-sm font-medium text-slate-700">Grid</span>
                                    <span className="text-sm font-semibold text-slate-900">21%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-400" style={{ width: "21%" }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Captive by Source */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Captive Generation by Source</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={captiveSourceData}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 150, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                                    <XAxis type="number" stroke="#94a3b8" style={{ fontSize: "12px" }} />
                                    <YAxis
                                        dataKey="source"
                                        type="category"
                                        width={140}
                                        stroke="#94a3b8"
                                        style={{ fontSize: "11px" }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "8px",
                                        }}
                                        formatter={(value: any) =>
                                            `${typeof value === "number" ? value.toLocaleString() : value} MWh`
                                        }
                                    />
                                    <Bar dataKey="value" fill="#10b981" radius={[0, 8, 8, 0]}>
                                        {captiveSourceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Fuel Mix */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Fuel Mix: CFBC & AFBC Boilers</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={fuelMixData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis dataKey="category" stroke="#94a3b8" style={{ fontSize: "12px" }} />
                                    <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "8px",
                                        }}
                                        formatter={(value: any) =>
                                            `${typeof value === "number" ? value.toLocaleString() : value} MWh`
                                        }
                                    />
                                    <Legend />
                                    <Bar dataKey="coal" fill="#f97316" radius={[8, 8, 0, 0]} name="Coal" />
                                    <Bar dataKey="dolochar" fill="#fbbf24" radius={[8, 8, 0, 0]} name="Dolochar" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Charts Row 3 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Energy Hierarchy */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Energy Hierarchy</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={hierarchyData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis
                                        dataKey="source"
                                        angle={-45}
                                        textAnchor="end"
                                        height={100}
                                        stroke="#94a3b8"
                                        style={{ fontSize: "12px" }}
                                    />
                                    <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "8px",
                                        }}
                                        formatter={(value: any) =>
                                            `${typeof value === "number" ? value.toLocaleString() : value} MWh`
                                        }
                                    />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                        {hierarchyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Source Breakdown Tree */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Source Breakdown Tree</h3>
                            <div className="space-y-1 text-sm overflow-y-auto max-h-80 font-mono text-slate-700">
                                <TreeItem label="Captive Generated" value="30,400 MWh" color="text-emerald-600" bold />
                                <TreeItem label="├─ Captive Steam" value="19,200 MWh" indent={1} />
                                <TreeItem label="│  ├─ WHRB 3 DRI Kilns" value="19,200 MWh" indent={2} />
                                <TreeItem label="│  │  ├─ Kiln 1" value="6,500 MWh" indent={3} />
                                <TreeItem label="│  │  ├─ Kiln 2" value="6,400 MWh" indent={3} />
                                <TreeItem label="│  │  └─ Kiln 3" value="6,300 MWh" indent={3} />
                                <TreeItem label="├─ Captive Fossil" value="10,200 MWh" indent={1} />
                                <TreeItem label="│  ├─ CFBC" value="7,000 MWh" indent={2} />
                                <TreeItem label="│  │  ├─ Coal" value="4,800 MWh" indent={3} />
                                <TreeItem label="│  │  └─ Dolochar" value="2,200 MWh" indent={3} />
                                <TreeItem label="│  └─ AFBC" value="3,200 MWh" indent={2} />
                                <TreeItem label="│     ├─ Coal" value="1,800 MWh" indent={3} />
                                <TreeItem label="│     └─ Dolochar" value="1,400 MWh" indent={3} />
                                <TreeItem label="└─ Captive Renewable" value="1,000 MWh" indent={1} />
                                <TreeItem label="   └─ Solar Rooftop 3MWp" value="1,000 MWh" indent={2} />
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                    <TreeItem label="Grid DISCOM" value="8,200 MWh" color="text-slate-600" />
                                    <TreeItem label="└─ EF 0.712 tCO₂/MWh" value="CEA V21.0" indent={1} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <p className="text-xs text-slate-500">
                            Data shown is static for demonstration purposes. For real data integration, connect your
                            energy monitoring systems.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({
    label,
    value,
    unit,
    description,
}: {
    label: string;
    value: string;
    unit: string;
    description: string;
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
            <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl lg:text-4xl font-bold text-slate-900">{value}</span>
                <span className="text-sm font-medium text-slate-600">{unit}</span>
            </div>
            <p className="mt-3 text-xs text-slate-500">{description}</p>
        </div>
    );
}

function TreeItem({
    label,
    value,
    indent = 0,
    color = "text-slate-700",
    bold = false,
}: {
    label: string;
    value: string;
    indent?: number;
    color?: string;
    bold?: boolean;
}) {
    return (
        <div
            style={{ paddingLeft: `${indent * 12}px` }}
            className={`${bold ? "font-bold" : ""} ${color} flex justify-between items-center gap-4`}>
            <span>{label}</span>
            <span className="font-mono text-right whitespace-nowrap">{value}</span>
        </div>
    );
}
