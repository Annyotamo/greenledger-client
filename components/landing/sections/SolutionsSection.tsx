"use client";

import { useState } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import { LuLayoutGrid } from "react-icons/lu";

// Custom vector SVGs matching the icons in the screenshots, sized down for a compact layout
const ProcessEmissionsIcon = () => (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Steam clouds */}
        <path d="M30 65c-4 0-8-3-8-7s4-7 9-6c1-5 6-9 11-8 5 0 9 3 10 7a9 9 0 0 1 12 1c4 3 3 8-1 9s-27 4-33 4z" />
        {/* Heat waves rising */}
        <path d="M40 38c-3-5 3-7 0-12M50 34c-3-5 3-7 0-12M60 38c-3-5 3-7 0-12" className="stroke-emerald-600" strokeWidth="2" />
        <path d="M45 74c0 4-4 8-8 8" className="stroke-emerald-600" strokeWidth="2" />
    </svg>
);

const PurchasedElectricityIcon = () => (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Open Box */}
        <path d="M50 20L20 33v34l30 13 30-13V33L50 20z" />
        <path d="M20 33l30 13 30-13M50 46v34" />
        {/* Checkmark badge */}
        <circle cx="70" cy="45" r="10" className="fill-white stroke-slate-900" strokeWidth="2" />
        <path d="M66 45l3 3 5-5" className="stroke-emerald-500" strokeWidth="2" />
    </svg>
);

const BusinessTravelIcon = () => (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Airplane flying */}
        <path d="M20 50l30-8 28-28 6 2 1 12-25 18 18 10 10-6 4 1-2 8-16 6-10 16-4-1 2-8z" />
        {/* Contrails */}
        <path d="M15 57c-4 0-6 2-8 1M11 63c-3 1-5 3-7 2" className="stroke-emerald-500" strokeWidth="2" />
    </svg>
);

const WasteIcon = () => (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Bin outline */}
        <path d="M30 30h40v50a5 5 0 0 1-5 5H35a5 5 0 0 1-5-5V30z" />
        <path d="M25 30h50M42 30V20a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10" />
        {/* Recycling arrows */}
        <path d="M45 46a6 6 0 0 1 10 0l2 4M55 64a6 6 0 0 1-10 0l-2-4" className="stroke-emerald-500" />
        <path d="M42 46h4v4M58 64h-4v-4" className="stroke-emerald-500" />
    </svg>
);

const EmployeeCommutingIcon = () => (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-slate-900" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

// Scope Configurations (omitted internal string bullets to allow code-driven layouts)
const SCOPES_CONFIG: ScopeConfig[] = [
    {
        id: "scope-1",
        scopeTitle: "SCOPE 1",
        bannerLabel: "REPORTING COMPANY",
        categoryLabel: "Direct Emissions",
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
        bannerLabel: "UPSTREAM ACTIVITIES",
        categoryLabel: "Indirect Electricity Emissions",
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
        bannerLabel: "UPSTREAM & DOWNSTREAM VALUE CHAIN",
        categoryLabel: "Value Chain Emissions",
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

    // Perfect border alignment helper to avoid overlapping or doubled inner borders
    const getBorderClasses = (idx: number, total: number) => {
        const isLastInRowMobile = idx % 2 === 1 || idx === total - 1;
        const isLastRowMobile = Math.floor(idx / 2) === Math.floor((total - 1) / 2);

        const colsDesktop = total === 3 ? 3 : 4;
        const isLastInRowDesktop = idx % colsDesktop === colsDesktop - 1 || idx === total - 1;
        const isLastRowDesktop = Math.floor(idx / colsDesktop) === Math.floor((total - 1) / colsDesktop);

        return `${isLastInRowMobile ? "" : "border-r-2"} ${isLastRowMobile ? "" : "border-b-2"} ${isLastInRowDesktop ? "sm:border-r-0" : "sm:border-r-2"} ${isLastRowDesktop ? "sm:border-b-0" : "sm:border-b-2"} border-slate-950`;
    };

    return (
        <LazyMotion features={domAnimation} strict>
            {/* Section is styled full-bleed with w-screen, zero rounded corners, and deep dark border separation */}
            <section id="solutions" className="full-bleed scroll-mt-24 bg-white py-10 px-6 sm:px-8 md:px-12">
                {/* Scaled down max-width to max-w-3xl for compact look */}
                <div className="max-w-3xl mx-auto">
                    {/* Header Block matching the site typography cleanly */}
                    <div className="mb-6 text-left">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-2 py-0.5 border border-emerald-900/10 select-none">
                            INVENTORY MODULE / EMISSIONS SPINE
                        </span>
                        <h2 className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase font-mono">
                            Greenhouse Gas Scopes Ledger
                        </h2>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                            Select a scope category below to display target activity streams and compliance definitions. Select individual activity elements to inspect ledger emission mappings.
                        </p>
                    </div>

                    {/* Scope Selector Tabs - Flat layout with zero rounding, matched to serving tabs layout */}
                    <div className="flex flex-wrap gap-1.5 mb-6 pb-3">
                        {SCOPES_CONFIG.map((scope) => {
                            const isActive = activeScopeId === scope.id;
                            return (
                                <button
                                    key={scope.id}
                                    type="button"
                                    onClick={() => setActiveScopeId(scope.id)}
                                    className={`relative px-4 py-2 font-mono text-[11px] sm:text-xs font-bold tracking-wider cursor-pointer border-2 transition-all ${
                                        isActive
                                            ? "bg-emerald-950 text-white border-emerald-950 scale-100"
                                            : "bg-white text-slate-500 border-slate-200 hover:border-emerald-950 hover:text-emerald-950"
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

                    {/* Compact Technical Grid Card: Exact layout matching screenshots */}
                    <div className="bg-white shadow-xl relative" style={{ borderRadius: "0px" }}>
                        {/* 1. Header (Dark bar with S in green square box) */}
                        <div className="bg-slate-950 text-white px-4 py-2.5 flex items-center justify-between select-none" style={{ borderRadius: "0px" }}>
                            <div className="flex items-center gap-2">

                                <span className="font-mono text-sm font-black tracking-widest text-slate-100 uppercase">
                                    SCOPE {currentScope.id.split("-")[1]}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <LuLayoutGrid className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>

                        {/* 2. Primary Green/Emerald Banner - Single square bullet point */}
                        <div className="bg-emerald-700 text-white font-black uppercase tracking-wider px-4 py-2 text-[10px] sm:text-xs flex items-center gap-2 border-b-2 border-slate-950 select-none">
                            <span className="inline-block w-2.5 h-2.5 bg-white shrink-0" />
                            <span>{currentScope.bannerLabel}</span>
                        </div>

                        {/* 3. Secondary Gray Banner - Single circular bullet point */}
                        <div className="bg-slate-100 border-b-2 border-slate-950 text-slate-900 text-[10px] sm:text-xs font-black px-4 py-2 flex items-center gap-2 select-none">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                            <span>{currentScope.categoryLabel}</span>
                        </div>

                        {/* 4. White Background Icon Grid - Flat corners, dynamically generated non-overlapping borders */}
                        <div className={`bg-white grid ${currentScope.activities.length === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4"} select-none`}>
                            {currentScope.activities.map((activity, idx) => {
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
                                        className={`flex flex-col items-center text-center p-4 sm:p-5 transition-all duration-100 cursor-pointer ${
                                            isSelected
                                                ? "bg-emerald-50/30 font-bold"
                                                : "bg-white hover:bg-slate-50/50"
                                        } ${getBorderClasses(idx, currentScope.activities.length)}`}
                                        style={{ borderRadius: "0px" }}
                                    >
                                        <div className={`transition-transform duration-150 ${
                                            isSelected ? "scale-105" : "hover:scale-102"
                                        }`}>
                                            <IconComp />
                                        </div>
                                        <span className="text-[10px] sm:text-xs font-extrabold text-slate-900 tracking-tight leading-tight mt-3 uppercase font-mono">
                                            {activity.title}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* 5. Dynamic Readout Panel - Technical detail readout box using dark emerald theme */}
                        <div className="bg-slate-50 p-4 border-t-2 border-slate-950" style={{ borderRadius: "0px" }}>
                            <div className="flex flex-col md:flex-row gap-3 items-start">
                                <div className="bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 font-bold inline-block shrink-0 select-none">
                                    SPECIFICATION READOUT //
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-950 uppercase font-mono tracking-tight">{currentActivity.title}</h4>
                                    <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed mt-1 font-normal">
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
