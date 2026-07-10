"use client";

import { useState } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import { LuLayoutGrid } from "react-icons/lu";

// Custom vector SVGs matching the icons in the screenshots, updated to use the emerald color palette
const ProcessEmissionsIcon = () => (
    <svg viewBox="0 0 100 100" className="w-16 h-16 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Beaker outline */}
        <path d="M35 15h30M42 15v15L25 75a6 6 0 0 0 5 9h40a6 6 0 0 0 5-9L58 30V15" />
        {/* Liquid level */}
        <path d="M28 66h44" strokeDasharray="3 3" />
        {/* Bubbles */}
        <circle cx="45" cy="50" r="3" className="fill-emerald-500 stroke-emerald-500" />
        <circle cx="55" cy="62" r="2.5" className="fill-emerald-500 stroke-emerald-500" />
        <circle cx="38" cy="72" r="4" className="fill-emerald-500 stroke-emerald-500" />
        <circle cx="50" cy="75" r="2" className="fill-emerald-500 stroke-emerald-500" />
        <circle cx="62" cy="70" r="3" className="fill-emerald-500 stroke-emerald-500" />
        {/* Fumes */}
        <path d="M46 10c-2-3 2-3 0-6M54 10c2-3-2-3 0-6" className="text-emerald-600" />
    </svg>
);

const CompanyVehiclesIcon = () => (
    <svg viewBox="0 0 100 100" className="w-16 h-16 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Truck Body */}
        <path d="M15 35h50v35H15zM65 45h15l8 10v15H65z" />
        {/* Wheels */}
        <circle cx="32" cy="75" r="9" className="fill-white stroke-slate-900" strokeWidth="2.5" />
        <circle cx="32" cy="75" r="3" className="fill-emerald-500 stroke-emerald-500" />
        <circle cx="72" cy="75" r="9" className="fill-white stroke-slate-900" strokeWidth="2.5" />
        <circle cx="72" cy="75" r="3" className="fill-emerald-500 stroke-emerald-500" />
        {/* Window */}
        <path d="M68 50h10v8H68z" />
        {/* Exhaust puff */}
        <path d="M8 68c-2-1-4 1-3 3s2 1 3 0" className="text-emerald-600" strokeWidth="2" />
    </svg>
);

const CompanyFacilityIcon = () => (
    <svg viewBox="0 0 100 100" className="w-16 h-16 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Building outline */}
        <path d="M25 85V20a3 3 0 0 1 3-3h44a3 3 0 0 1 3 3v65" />
        {/* Grid of windows */}
        <path d="M35 30h8v8h-8zM57 30h8v8h-8zM35 48h8v8h-8zM57 48h8v8h-8zM35 66h8v8h-8zM57 66h8v8h-8z" />
        {/* Door */}
        <path d="M46 72h8v13h-8z" className="stroke-emerald-600" />
        {/* Small details */}
        <circle cx="50" cy="78" r="1.5" className="fill-emerald-500 stroke-emerald-500" />
    </svg>
);

const FugitiveEmissionsIcon = () => (
    <svg viewBox="0 0 100 100" className="w-16 h-16 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Flanged Pipes */}
        <path d="M15 45h20M65 45h20M35 38v14M65 38v14" />
        {/* Valve body/center */}
        <rect x="39" y="35" width="22" height="20" rx="2" className="stroke-slate-900" />
        {/* Pressure gauge Dial */}
        <circle cx="50" cy="22" r="10" className="fill-white stroke-slate-900" />
        <path d="M50 22l6-4" className="stroke-emerald-500" strokeWidth="2" />
        {/* Leaks / Vapor waves */}
        <path d="M30 35c-2-3-5-3-7-3M70 35c2-3 5-3 7-3" className="stroke-emerald-600" strokeWidth="2" />
        <path d="M48 62c-2 3-1 6-3 9M54 62c2 3 1 6 3 9" className="stroke-emerald-600" strokeWidth="2" />
    </svg>
);

// SVG Icons for Scope 2
const HeatingCoolingIcon = () => (
    <svg viewBox="0 0 100 100" className="w-16 h-16 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Thermometer */}
        <path d="M44 20v45a8 8 0 1 0 12 0V20a6 6 0 0 0-12 0z" />
        {/* Liquid indicator */}
        <path d="M50 48v22" className="stroke-emerald-500" strokeWidth="4" />
        <circle cx="50" cy="70" r="5" className="fill-emerald-500 stroke-emerald-500" />
        {/* Heat lines */}
        <path d="M68 25c2 2 2 5 0 7M74 20c4 3 4 8 0 11M28 25c-2 2-2 5 0 7M22 20c-4 3-4 8 0 11" className="stroke-emerald-600" strokeWidth="2" />
    </svg>
);

const SteamIcon = () => (
    <svg viewBox="0 0 100 100" className="w-16 h-16 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Steam clouds */}
        <path d="M30 65c-4 0-8-3-8-7s4-7 9-6c1-5 6-9 11-8 5 0 9 3 10 7a9 9 0 0 1 12 1c4 3 3 8-1 9s-27 4-33 4z" />
        {/* Heat waves rising */}
        <path d="M40 38c-3-5 3-7 0-12M50 34c-3-5 3-7 0-12M60 38c-3-5 3-7 0-12" className="stroke-emerald-600" strokeWidth="2" />
        <path d="M45 74c0 4-4 8-8 8" className="stroke-emerald-600" strokeWidth="2" />
    </svg>
);

const PurchasedElectricityIcon = () => (
    <svg viewBox="0 0 100 100" className="w-16 h-16 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Transmission Tower structure */}
        <path d="M50 15L25 85M50 15l25 70" />
        <path d="M33 60h34M38 43h24M44 26h12" />
        {/* Crossarms */}
        <path d="M18 43h64M23 26h54" />
        {/* Hanging insulators */}
        <path d="M22 43v10M78 43v10M27 26v8M73 26v8" />
        {/* Electrical sparks */}
        <path d="M50 48l-4 6h8l-4 6" className="stroke-emerald-500 fill-none" strokeWidth="2" />
    </svg>
);

// SVG Icons for Scope 3
const GoodsServicesIcon = () => (
    <svg viewBox="0 0 100 100" className="w-16 h-16 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Open Box */}
        <path d="M50 20L20 33v34l30 13 30-13V33L50 20z" />
        <path d="M20 33l30 13 30-13M50 46v34" />
        {/* Checkmark badge */}
        <circle cx="70" cy="45" r="10" className="fill-white stroke-slate-900" strokeWidth="2" />
        <path d="M66 45l3 3 5-5" className="stroke-emerald-500" strokeWidth="2" />
    </svg>
);

const BusinessTravelIcon = () => (
    <svg viewBox="0 0 100 100" className="w-16 h-16 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Airplane flying */}
        <path d="M20 50l30-8 28-28 6 2 1 12-25 18 18 10 10-6 4 1-2 8-16 6-10 16-4-1 2-8z" />
        {/* Contrails */}
        <path d="M15 57c-4 0-6 2-8 1M11 63c-3 1-5 3-7 2" className="stroke-emerald-500" strokeWidth="2" />
    </svg>
);

const WasteIcon = () => (
    <svg viewBox="0 0 100 100" className="w-16 h-16 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Bin outline */}
        <path d="M30 30h40v50a5 5 0 0 1-5 5H35a5 5 0 0 1-5-5V30z" />
        <path d="M25 30h50M42 30V20a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10" />
        {/* Recycling arrows */}
        <path d="M45 46a6 6 0 0 1 10 0l2 4M55 64a6 6 0 0 1-10 0l-2-4" className="stroke-emerald-500" />
        <path d="M42 46h4v4M58 64h-4v-4" className="stroke-emerald-500" />
    </svg>
);

const EmployeeCommutingIcon = () => (
    <svg viewBox="0 0 100 100" className="w-16 h-16 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Bus/Train outline */}
        <rect x="25" y="25" width="50" height="42" rx="6" className="stroke-slate-900" />
        {/* Windows */}
        <path d="M30 32h16v14H30zM54 32h16v14H54z" />
        {/* Wheels/Tracks */}
        <circle cx="38" cy="73" r="6" className="fill-white stroke-slate-900" strokeWidth="2.5" />
        <circle cx="38" cy="73" r="2" className="fill-emerald-500 stroke-emerald-500" />
        <circle cx="62" cy="73" r="6" className="fill-white stroke-slate-900" strokeWidth="2.5" />
        <circle cx="62" cy="73" r="2" className="fill-emerald-500 stroke-emerald-500" />
        {/* Headlights */}
        <path d="M28 58h4M68 58h4" className="stroke-emerald-500" strokeWidth="3" />
    </svg>
);

// Types
type ActivityItem = {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType;
};

type ScopeConfig = {
    id: string;
    scopeTitle: string;
    bannerLabel: string;
    categoryLabel: string;
    activities: ActivityItem[];
};

// Scope Configurations
const SCOPES_CONFIG: ScopeConfig[] = [
    {
        id: "scope-1",
        scopeTitle: "SCOPE 1",
        bannerLabel: "• REPORTING COMPANY",
        categoryLabel: "• Direct Emissions",
        activities: [
            {
                id: "process",
                title: "Process Emissions",
                description: "Direct greenhouse gas emissions from physical or chemical processing during manufacturing, such as calcination in cement production or chemical reductions in steelmaking. These are inherent to industrial processes and require precise stoichiometric tracking.",
                icon: ProcessEmissionsIcon,
            },
            {
                id: "vehicles",
                title: "Company Vehicles",
                description: "Mobile combustion emissions from vehicles owned or controlled by the reporting organization (e.g., corporate fleets, delivery vans, and heavy machinery). Monitored via fuel card transactions, telematics, and direct invoices.",
                icon: CompanyVehiclesIcon,
            },
            {
                id: "facility",
                title: "Company Facility",
                description: "Stationary combustion emissions from boilers, furnaces, heaters, and generators operating within facilities owned or leased by the company. Calculations are based on natural gas, fuel oil, or coal consumed.",
                icon: CompanyFacilityIcon,
            },
            {
                id: "fugitive",
                title: "Fugitive Emissions",
                description: "Intentional or unintentional releases of greenhouse gases, such as refrigerant leaks from HVAC systems, methane leaks from pipelines, or wastewater treatment emissions. Monitored through refrigerant top-up logs and pressure tests.",
                icon: FugitiveEmissionsIcon,
            },
        ],
    },
    {
        id: "scope-2",
        scopeTitle: "SCOPE 2",
        bannerLabel: "• UPSTREAM ACTIVITIES",
        categoryLabel: "• Indirect Electricity Emissions",
        activities: [
            {
                id: "heating",
                title: "Heating & Cooling for Own Use",
                description: "Emissions from the consumption of purchased heat, steam, or chilled water imported into company facilities. Calculated using supplier-specific utility factors or national grid averages.",
                icon: HeatingCoolingIcon,
            },
            {
                id: "steam",
                title: "Steam",
                description: "Indirect emissions associated with the production of steam purchased from a third-party district energy system. Essential for chemical processing and heating, calculated based on mass or energy units consumed.",
                icon: SteamIcon,
            },
            {
                id: "electricity",
                title: "Purchased Electricity",
                description: "Indirect emissions from electricity generated by third-party utilities and consumed in company operations. GreenLedger supports both location-based grid averages and market-based contract/REC accounting methods.",
                icon: PurchasedElectricityIcon,
            },
        ],
    },
    {
        id: "scope-3",
        scopeTitle: "SCOPE 3",
        bannerLabel: "• UPSTREAM & DOWNSTREAM VALUE CHAIN",
        categoryLabel: "• Value Chain Emissions",
        activities: [
            {
                id: "goods",
                title: "Purchased Goods & Services",
                description: "Upstream emissions from raw materials, packaging, and outsourced services purchased by the company. GreenLedger calculates these using spend-based models or supplier-specific life-cycle assessments (LCA).",
                icon: GoodsServicesIcon,
            },
            {
                id: "travel",
                title: "Business Travel",
                description: "Emissions from employee transportation for business-related activities in third-party owned vehicles (flights, rail, rental cars, and hotels). Tracked via travel agency integrations and expense records.",
                icon: BusinessTravelIcon,
            },
            {
                id: "waste",
                title: "Waste Generated in Operations",
                description: "Emissions from the disposal and treatment of waste generated in the organization’s operations (landfilling, incineration, recycling). Monitored using waste haul manifests and disposal facility reports.",
                icon: WasteIcon,
            },
            {
                id: "commute",
                title: "Employee Commuting",
                description: "Emissions from the transportation of employees between their homes and their worksites. Estimated using annual survey data, transit usage tracking, or default work-from-home adjustment factors.",
                icon: EmployeeCommutingIcon,
            },
        ],
    },
];

export default function SolutionsSection() {
    // Current active Scope tab
    const [activeScopeId, setActiveScopeId] = useState<string>("scope-1");
    // Selected activity within current Scope
    const [selectedActivityIds, setSelectedActivityIds] = useState<Record<string, string>>({
        "scope-1": "process",
        "scope-2": "heating",
        "scope-3": "goods",
    });

    const currentScope = SCOPES_CONFIG.find((s) => s.id === activeScopeId) || SCOPES_CONFIG[0];
    const currentActivityId = selectedActivityIds[activeScopeId] || currentScope.activities[0].id;
    const currentActivity = currentScope.activities.find((a) => a.id === currentActivityId) || currentScope.activities[0];

    return (
        <LazyMotion features={domAnimation} strict>
            {/* Section is styled full-bleed with w-screen, zero rounded corners, and deep dark border separation */}
            <section id="solutions" className="full-bleed scroll-mt-24 bg-white py-16 px-6 sm:px-8 md:px-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header Block with robust technical typography, matching the green palette of the landing page */}
                    <div className="mb-10 text-left">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-3 py-1 border border-emerald-900/10 select-none">
                            INVENTORY MODULE / EMISSIONS SPINE
                        </span>
                        <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-slate-950 uppercase font-mono">
                            Greenhouse Gas Scopes Ledger
                        </h2>
                        <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed max-w-3xl">
                            Select a scope category below to display target activity streams and compliance definitions. Select individual activity elements to inspect ledger emission mappings.
                        </p>
                    </div>

                    {/* Scope Selector Tabs - Flat layout with zero rounding, grid style, themed in brand green */}
                    <div className="flex flex-wrap gap-2 mb-8 border-b-2 border-slate-900 pb-4">
                        {SCOPES_CONFIG.map((scope) => {
                            const isActive = activeScopeId === scope.id;
                            return (
                                <button
                                    key={scope.id}
                                    type="button"
                                    onClick={() => setActiveScopeId(scope.id)}
                                    className={`relative px-6 py-3 font-mono text-xs md:text-sm font-bold tracking-wider cursor-pointer border-2 transition-all ${
                                        isActive
                                            ? "bg-emerald-950 text-white border-emerald-950 scale-100"
                                            : "bg-white text-slate-600 border-slate-200 hover:border-emerald-950 hover:text-emerald-950"
                                    }`}
                                    style={{ borderRadius: "0px" }}
                                >
                                    {scope.id === "scope-1" && "SCOPE 1 (DIRECT)"}
                                    {scope.id === "scope-2" && "SCOPE 2 (INDIRECT)"}
                                    {scope.id === "scope-3" && "SCOPE 3 (VALUE CHAIN)"}
                                </button>
                            );
                        })}
                    </div>

                    {/* Technical Grid Card: Exact Screenshot layout with zero rounded corners, recolored to emerald brand palette */}
                    <div className="border-2 border-slate-950 bg-white shadow-2xl relative" style={{ borderRadius: "0px" }}>
                        {/* 1. Header (Dark bar with brain icon placeholder) */}
                        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b-2 border-slate-950 select-none" style={{ borderRadius: "0px" }}>
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-emerald-600 rounded-none flex items-center justify-center text-xs font-black shadow-lg text-white">
                                    GL
                                </div>
                                <span className="font-mono text-lg font-black tracking-widest text-slate-100 flex items-center">
                                    <span className="text-emerald-400 font-black mr-0.5">S</span>{currentScope.scopeTitle.substring(1)}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <LuLayoutGrid className="w-5 h-5 text-slate-400" />
                            </div>
                        </div>

                        {/* 2. Primary Green/Emerald Banner - Replaced amber with brand emerald green */}
                        <div className="bg-emerald-700 text-white font-black uppercase tracking-wider px-6 py-3.5 text-xs md:text-sm flex items-center gap-2 border-b-2 border-slate-950 select-none shadow-sm">
                            <span className="inline-block w-2 h-2 rounded-none bg-white animate-pulse" />
                            {currentScope.bannerLabel}
                        </div>

                        {/* 3. Secondary Gray Banner */}
                        <div className="bg-slate-100 border-b-2 border-slate-950 text-slate-900 text-xs md:text-sm font-black px-6 py-3.5 flex items-center gap-2 select-none">
                            <span>•</span>
                            {currentScope.categoryLabel}
                        </div>

                        {/* 4. White Background Icon Grid - Flat corners, bold dividers, matching screenshots */}
                        <div className="bg-white grid grid-cols-2 sm:grid-cols-4 select-none divide-x-2 divide-slate-950 divide-y-2 sm:divide-y-0 divide-y-slate-950">
                            {currentScope.activities.map((activity) => {
                                const isSelected = currentActivityId === activity.id;
                                const IconComp = activity.icon;

                                return (
                                    <button
                                        key={activity.id}
                                        type="button"
                                        onClick={() => setSelectedActivityIds({
                                            ...selectedActivityIds,
                                            [activeScopeId]: activity.id,
                                        })}
                                        className={`flex flex-col items-center text-center p-6 transition-all duration-150 cursor-pointer ${
                                            isSelected
                                                ? "bg-emerald-50/40 font-bold"
                                                : "bg-white hover:bg-slate-50"
                                        }`}
                                        style={{ borderRadius: "0px" }}
                                    >
                                        <div className={`p-4 transition-transform duration-200 ${
                                            isSelected ? "scale-105" : "hover:scale-102"
                                        }`}>
                                            <IconComp />
                                        </div>
                                        <span className="text-xs md:text-sm font-extrabold text-slate-900 tracking-tight leading-tight mt-4 uppercase font-mono">
                                            {activity.title}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* 5. Dynamic Readout Panel - Technical detail readout box using dark emerald theme */}
                        <div className="bg-slate-50 p-6 border-t-2 border-slate-950" style={{ borderRadius: "0px" }}>
                            <div className="flex flex-col md:flex-row gap-4 items-start">
                                <div className="bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-mono text-[10px] tracking-wider uppercase px-3 py-1 font-bold inline-block shrink-0 select-none">
                                    SPECIFICATION READOUT //
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-base font-extrabold text-slate-950 uppercase font-mono tracking-tight">{currentActivity.title}</h4>
                                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed mt-2 font-normal">
                                        {currentActivity.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </LazyMotion>
    );
}
