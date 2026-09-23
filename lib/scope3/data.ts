export type Scope3ViewMode = "operational" | "upstream_downstream";

export type Scope3Category = {
    id: number;
    code: string; // e.g. "Cat 1"
    name: string;
    description: string;
    slug: string;
    type: "upstream" | "downstream";
    isImplemented: boolean;
    color: string;
    
    // View 1 (Operational vs Product Focus) Grouping
    view1Group: "Corporate & Operations" | "Supply Chain & Goods" | "Product Lifecycle" | "Business Model";
    
    // View 2 (Basic Upstream vs Downstream) Section & Subgroup
    view2Section: "Upstream (Supply Chain)" | "Downstream (Product & Market)";
    view2Subgroup: 
        | "Procurement & Assets"
        | "Logistics & Energy"
        | "Workforce & Waste"
        | "Product Use Phase"
        | "Logistics & Expansion"
        | "Finance";

    emissionsTco2e: number;
    sharePercent: number;
    trendPercent: number; // e.g. +3.2 or -1.5
    trendDirection: "up" | "down" | "flat";
    spendInr: number;
    spendUsd?: number;
    dataCoveragePercent: number;
    methodology: "Spend-Based" | "Average Data" | "Supplier Specific" | "Hybrid Activity";
    icon: string;
    status: "Verified" | "Audited" | "Estimated" | "Pending Review";
};

export function formatInrSpend(inr: number): string {
    if (inr >= 10000000) {
        return `₹${(inr / 10000000).toFixed(2)} Cr`;
    }
    if (inr >= 100000) {
        return `₹${(inr / 100000).toFixed(2)} L`;
    }
    return `₹${inr.toLocaleString("en-IN")}`;
}

export const SCOPE3_CATEGORIES: Scope3Category[] = [
    // ------------------- IMPLEMENTED CATEGORIES (1, 2, 3, 4, 5, 6, 7, 9, 15) -------------------
    {
        id: 1,
        code: "Cat 1",
        name: "Purchased Goods & Services",
        description: "Extraction, production, and transportation of goods and services purchased or acquired.",
        slug: "category-1",
        type: "upstream",
        isImplemented: true,
        color: "#10b981", // Emerald
        view1Group: "Supply Chain & Goods",
        view2Section: "Upstream (Supply Chain)",
        view2Subgroup: "Procurement & Assets",
        emissionsTco2e: 18420.5,
        sharePercent: 53.9,
        trendPercent: 4.8,
        trendDirection: "up",
        spendInr: 1182500000,
        dataCoveragePercent: 96.2,
        methodology: "Spend-Based",
        icon: "shopping_cart",
        status: "Verified",
    },
    {
        id: 2,
        code: "Cat 2",
        name: "Capital Goods",
        description: "Final goods that have an extended life and are used to manufacture products or provide services.",
        slug: "category-2",
        type: "upstream",
        isImplemented: true,
        color: "#059669", // Dark Emerald
        view1Group: "Corporate & Operations",
        view2Section: "Upstream (Supply Chain)",
        view2Subgroup: "Procurement & Assets",
        emissionsTco2e: 4150.2,
        sharePercent: 12.1,
        trendPercent: 8.2,
        trendDirection: "up",
        spendInr: 448000000,
        dataCoveragePercent: 94.0,
        methodology: "Spend-Based",
        icon: "precision_manufacturing",
        status: "Verified",
    },
    {
        id: 3,
        code: "Cat 3",
        name: "Fuel & Energy Activities",
        description: "Extraction, production, and transportation of fuels and energy purchased (WTT & CEA grid T&D losses).",
        slug: "category-3",
        type: "upstream",
        isImplemented: true,
        color: "#3b82f6", // Blue
        view1Group: "Corporate & Operations",
        view2Section: "Upstream (Supply Chain)",
        view2Subgroup: "Logistics & Energy",
        emissionsTco2e: 2890.4,
        sharePercent: 8.5,
        trendPercent: -3.4,
        trendDirection: "down",
        spendInr: 174000000,
        dataCoveragePercent: 98.5,
        methodology: "Average Data",
        icon: "bolt",
        status: "Audited",
    },
    {
        id: 4,
        code: "Cat 4",
        name: "Upstream Transport & Distribution",
        description: "Transportation & logistics services purchased by reporting company across domestic freight corridors.",
        slug: "category-4",
        type: "upstream",
        isImplemented: true,
        color: "#f59e0b", // Amber
        view1Group: "Supply Chain & Goods",
        view2Section: "Upstream (Supply Chain)",
        view2Subgroup: "Logistics & Energy",
        emissionsTco2e: 3120.8,
        sharePercent: 9.1,
        trendPercent: -2.1,
        trendDirection: "down",
        spendInr: 322500000,
        dataCoveragePercent: 91.5,
        methodology: "Hybrid Activity",
        icon: "local_shipping",
        status: "Audited",
    },
    {
        id: 5,
        code: "Cat 5",
        name: "Waste from Operations",
        description: "Disposal and treatment of waste generated in reporting company's operations across disposal routes.",
        slug: "category-5",
        type: "upstream",
        isImplemented: true,
        color: "#84cc16", // Lime
        view1Group: "Corporate & Operations",
        view2Section: "Upstream (Supply Chain)",
        view2Subgroup: "Workforce & Waste",
        emissionsTco2e: 640.1,
        sharePercent: 1.9,
        trendPercent: -5.2,
        trendDirection: "down",
        spendInr: 34800000,
        dataCoveragePercent: 95.0,
        methodology: "Average Data",
        icon: "delete_sweep",
        status: "Verified",
    },
    {
        id: 6,
        code: "Cat 6",
        name: "Business Travel",
        description: "Transportation of employees for business-related activities across air, rail, and road transit.",
        slug: "category-6",
        type: "upstream",
        isImplemented: true,
        color: "#06b6d4", // Cyan
        view1Group: "Corporate & Operations",
        view2Section: "Upstream (Supply Chain)",
        view2Subgroup: "Workforce & Waste",
        emissionsTco2e: 1180.6,
        sharePercent: 3.5,
        trendPercent: 12.4,
        trendDirection: "up",
        spendInr: 153500000,
        dataCoveragePercent: 99.0,
        methodology: "Hybrid Activity",
        icon: "flight_takeoff",
        status: "Verified",
    },
    {
        id: 7,
        code: "Cat 7",
        name: "Employee Commuting",
        description: "Transportation of employees between home and worksites, including metro transit, EV carpooling & personal vehicles.",
        slug: "category-7",
        type: "upstream",
        isImplemented: true,
        color: "#8b5cf6", // Purple
        view1Group: "Corporate & Operations",
        view2Section: "Upstream (Supply Chain)",
        view2Subgroup: "Workforce & Waste",
        emissionsTco2e: 840.3,
        sharePercent: 2.5,
        trendPercent: 1.1,
        trendDirection: "up",
        spendInr: 78800000,
        dataCoveragePercent: 82.0,
        methodology: "Average Data",
        icon: "commute",
        status: "Estimated",
    },
    {
        id: 9,
        code: "Cat 9",
        name: "Downstream Transport & Distribution",
        description: "Downstream transportation & product distribution logistics across domestic delivery networks.",
        slug: "category-9",
        type: "downstream",
        isImplemented: true,
        color: "#ec4899", // Pink
        view1Group: "Product Lifecycle",
        view2Section: "Downstream (Product & Market)",
        view2Subgroup: "Logistics & Expansion",
        emissionsTco2e: 2650.0,
        sharePercent: 7.7,
        trendPercent: 2.3,
        trendDirection: "up",
        spendInr: 257000000,
        dataCoveragePercent: 89.0,
        methodology: "Hybrid Activity",
        icon: "package_2",
        status: "Verified",
    },
    {
        id: 15,
        code: "Cat 15",
        name: "Investments (Financed)",
        description: "Financed Scope 1, 2 & 3 emissions calculated via asset-level attribution and equity share factors.",
        slug: "category-15",
        type: "downstream",
        isImplemented: true,
        color: "#6366f1", // Indigo
        view1Group: "Business Model",
        view2Section: "Downstream (Product & Market)",
        view2Subgroup: "Finance",
        emissionsTco2e: 250.0,
        sharePercent: 0.7,
        trendPercent: -8.4,
        trendDirection: "down",
        spendInr: 1245000000,
        dataCoveragePercent: 95.5,
        methodology: "Hybrid Activity",
        icon: "account_balance",
        status: "Verified",
    },

    // ------------------- UNIMPLEMENTED CATEGORIES (FILTERED OUT IN ACTIVE TRACKING) -------------------
    {
        id: 8,
        code: "Cat 8",
        name: "Upstream Leased Assets",
        description: "Operation of assets leased by reporting company not included in Scope 1 or Scope 2.",
        slug: "category-8",
        type: "upstream",
        isImplemented: false,
        color: "#94a3b8",
        view1Group: "Supply Chain & Goods",
        view2Section: "Upstream (Supply Chain)",
        view2Subgroup: "Procurement & Assets",
        emissionsTco2e: 0,
        sharePercent: 0,
        trendPercent: 0,
        trendDirection: "flat",
        spendInr: 0,
        dataCoveragePercent: 0,
        methodology: "Average Data",
        icon: "real_estate_agent",
        status: "Estimated",
    },
    {
        id: 10,
        code: "Cat 10",
        name: "Processing of Sold Products",
        description: "Processing of intermediate products sold by third party manufacturers.",
        slug: "category-10",
        type: "downstream",
        isImplemented: false,
        color: "#94a3b8",
        view1Group: "Product Lifecycle",
        view2Section: "Downstream (Product & Market)",
        view2Subgroup: "Product Use Phase",
        emissionsTco2e: 0,
        sharePercent: 0,
        trendPercent: 0,
        trendDirection: "flat",
        spendInr: 0,
        dataCoveragePercent: 0,
        methodology: "Average Data",
        icon: "settings_suggest",
        status: "Estimated",
    },
    {
        id: 11,
        code: "Cat 11",
        name: "Use of Sold Products",
        description: "End-use of goods and services sold by reporting company over lifetime.",
        slug: "category-11",
        type: "downstream",
        isImplemented: false,
        color: "#94a3b8",
        view1Group: "Product Lifecycle",
        view2Section: "Downstream (Product & Market)",
        view2Subgroup: "Product Use Phase",
        emissionsTco2e: 0,
        sharePercent: 0,
        trendPercent: 0,
        trendDirection: "flat",
        spendInr: 0,
        dataCoveragePercent: 0,
        methodology: "Hybrid Activity",
        icon: "power",
        status: "Estimated",
    },
    {
        id: 12,
        code: "Cat 12",
        name: "End-of-Life Treatment of Sold Products",
        description: "Waste disposal and treatment of products sold at end of life.",
        slug: "category-12",
        type: "downstream",
        isImplemented: false,
        color: "#94a3b8",
        view1Group: "Product Lifecycle",
        view2Section: "Downstream (Product & Market)",
        view2Subgroup: "Product Use Phase",
        emissionsTco2e: 0,
        sharePercent: 0,
        trendPercent: 0,
        trendDirection: "flat",
        spendInr: 0,
        dataCoveragePercent: 0,
        methodology: "Average Data",
        icon: "recycling",
        status: "Estimated",
    },
    {
        id: 13,
        code: "Cat 13",
        name: "Downstream Leased Assets",
        description: "Operation of assets owned by reporting company and leased to third parties.",
        slug: "category-13",
        type: "downstream",
        isImplemented: false,
        color: "#94a3b8",
        view1Group: "Business Model",
        view2Section: "Downstream (Product & Market)",
        view2Subgroup: "Logistics & Expansion",
        emissionsTco2e: 0,
        sharePercent: 0,
        trendPercent: 0,
        trendDirection: "flat",
        spendInr: 0,
        dataCoveragePercent: 0,
        methodology: "Supplier Specific",
        icon: "domain_disabled",
        status: "Estimated",
    },
    {
        id: 14,
        code: "Cat 14",
        name: "Franchises",
        description: "Operation of franchises in reporting year.",
        slug: "category-14",
        type: "downstream",
        isImplemented: false,
        color: "#94a3b8",
        view1Group: "Business Model",
        view2Section: "Downstream (Product & Market)",
        view2Subgroup: "Logistics & Expansion",
        emissionsTco2e: 0,
        sharePercent: 0,
        trendPercent: 0,
        trendDirection: "flat",
        spendInr: 0,
        dataCoveragePercent: 0,
        methodology: "Average Data",
        icon: "storefront",
        status: "Estimated",
    },
];

export const SCOPE3_SUMMARY = {
    totalEmissionsTco2e: 34142.9,
    upstreamEmissionsTco2e: 31242.9,
    downstreamEmissionsTco2e: 2900.0,
    upstreamSharePercent: 91.5,
    downstreamSharePercent: 8.5,
    yoyChangePercent: 3.8,
    overallCoveragePercent: 95.4,
    trackedCategoriesCount: 9,
    verifiedSpendInr: 3893100000,
    carbonIntensityPerSpend: 0.088, // kgCO2e / INR spend
    activeSuppliersCount: 128,
};

export const SCOPE3_TREND_DATA = [
    { month: "Jan", upstream: 2450, downstream: 220, total: 2670 },
    { month: "Feb", upstream: 2510, downstream: 230, total: 2740 },
    { month: "Mar", upstream: 2680, downstream: 245, total: 2925 },
    { month: "Apr", upstream: 2590, downstream: 230, total: 2820 },
    { month: "May", upstream: 2720, downstream: 250, total: 2970 },
    { month: "Jun", upstream: 2640, downstream: 240, total: 2880 },
    { month: "Jul", upstream: 2780, downstream: 260, total: 3040 },
    { month: "Aug", upstream: 2810, downstream: 255, total: 3065 },
    { month: "Sep", upstream: 2690, downstream: 240, total: 2930 },
    { month: "Oct", upstream: 2550, downstream: 230, total: 2780 },
    { month: "Nov", upstream: 2420, downstream: 210, total: 2635 },
    { month: "Dec", upstream: 2400, downstream: 205, total: 2605 },
];

export const VENDOR_HOTSPOTS = [
    {
        id: "v-1",
        vendorName: "Apex Logistics India Pvt Ltd",
        category: "Cat 4: Upstream Freight",
        spend: "₹15.27 Cr",
        emissions: "1,420.2 tCO2e",
        intensity: "0.093 kgCO2e/₹",
        dataQuality: "HCV Route Model",
        status: "High Impact",
    },
    {
        id: "v-2",
        vendorName: "Tata Steel & Heavy Alloys",
        category: "Cat 1: Purchased Raw Goods",
        spend: "₹34.19 Cr",
        emissions: "5,840.6 tCO2e",
        intensity: "0.171 kgCO2e/₹",
        dataQuality: "Primary Mill Specifics",
        status: "Action Required",
    },
    {
        id: "v-3",
        vendorName: "Blue Dart Express Logistics",
        category: "Cat 9: Downstream Last Mile",
        spend: "₹16.18 Cr",
        emissions: "1,925.0 tCO2e",
        intensity: "0.119 kgCO2e/₹",
        dataQuality: "LCV Distribution Model",
        status: "Verified",
    },
    {
        id: "v-4",
        vendorName: "State Electricity Distribution Grid",
        category: "Cat 3: T&D Energy Losses",
        spend: "₹10.37 Cr",
        emissions: "1,890.0 tCO2e",
        intensity: "0.182 kgCO2e/₹",
        dataQuality: "CEA Grid Average",
        status: "Monitored",
    },
    {
        id: "v-5",
        vendorName: "ReNew Power & Green Assets",
        category: "Cat 15: Clean Power Investment",
        spend: "₹41.50 Cr",
        emissions: "250.0 tCO2e",
        intensity: "0.006 kgCO2e/₹",
        dataQuality: "Asset Attribution Factor",
        status: "Low Impact",
    },
];

export interface Scope3ActivityItem {
    id: string;
    icon: string;
    iconBgClassName: string;
    iconColorClassName: string;
    categoryCode: string;
    title: string;
    subtitle: string;
    tco2e: string;
    timeAgo: string;
    statusBadge: {
        label: string;
        className: string;
    };
}

export const SCOPE3_RECENT_ACTIVITIES: Scope3ActivityItem[] = [
    {
        id: "s3-act-1",
        icon: "shopping_cart",
        iconBgClassName: "bg-emerald-500/10 text-emerald-600",
        iconColorClassName: "text-emerald-600",
        categoryCode: "Cat 1",
        title: "Raw Material Invoice • 350t Structural Steel Batch",
        subtitle: "Tata Steel & Heavy Alloys • Jamshedpur Plant • Spend: ₹3.42 Cr",
        tco2e: "482.5 tCO2e",
        timeAgo: "2 hours ago",
        statusBadge: {
            label: "Verified",
            className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        },
    },
    {
        id: "s3-act-2",
        icon: "local_shipping",
        iconBgClassName: "bg-amber-500/10 text-amber-600",
        iconColorClassName: "text-amber-600",
        categoryCode: "Cat 4",
        title: "Freight Logistics • Mumbai to Nhava Sheva Port",
        subtitle: "Apex Logistics India • 4,200 t-km via Heavy Commercial Vehicle",
        tco2e: "128.4 tCO2e",
        timeAgo: "5 hours ago",
        statusBadge: {
            label: "Audited",
            className: "bg-blue-50 text-blue-700 border-blue-200",
        },
    },
    {
        id: "s3-act-3",
        icon: "flight_takeoff",
        iconBgClassName: "bg-cyan-500/10 text-cyan-600",
        iconColorClassName: "text-cyan-600",
        categoryCode: "Cat 6",
        title: "Business Travel Audit • Delhi, Mumbai & Bengaluru Routes",
        subtitle: "Domestic & Regional Air Fleet • 18 Segments with Radiative Forcing",
        tco2e: "42.1 tCO2e",
        timeAgo: "Yesterday",
        statusBadge: {
            label: "Verified",
            className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        },
    },
    {
        id: "s3-act-4",
        icon: "bolt",
        iconBgClassName: "bg-blue-500/10 text-blue-600",
        iconColorClassName: "text-blue-600",
        categoryCode: "Cat 3",
        title: "WTT & CEA Grid T&D Losses Allocation • Q2 Energy Statement",
        subtitle: "National Grid Regional Dispatch • 2.4 GWh Consumed Base",
        tco2e: "215.0 tCO2e",
        timeAgo: "1 day ago",
        statusBadge: {
            label: "Audited",
            className: "bg-blue-50 text-blue-700 border-blue-200",
        },
    },
    {
        id: "s3-act-5",
        icon: "commute",
        iconBgClassName: "bg-purple-500/10 text-purple-600",
        iconColorClassName: "text-purple-600",
        categoryCode: "Cat 7",
        title: "Employee Commute Survey Batch • Bengaluru Campus",
        subtitle: "450 Responders • Namma Metro, EV Shuttle & Hybrid Commutes",
        tco2e: "38.6 tCO2e",
        timeAgo: "2 days ago",
        statusBadge: {
            label: "Estimated",
            className: "bg-amber-50 text-amber-700 border-amber-200",
        },
    },
    {
        id: "s3-act-6",
        icon: "account_balance",
        iconBgClassName: "bg-indigo-500/10 text-indigo-600",
        iconColorClassName: "text-indigo-600",
        categoryCode: "Cat 15",
        title: "Portfolio Financed Emissions • Solar & Wind Assets",
        subtitle: "ReNew Power & Green Assets • Equity Attribution Factor: 2.5%",
        tco2e: "12.5 tCO2e",
        timeAgo: "3 days ago",
        statusBadge: {
            label: "Verified",
            className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        },
    },
    {
        id: "s3-act-7",
        icon: "delete_sweep",
        iconBgClassName: "bg-lime-500/10 text-lime-600",
        iconColorClassName: "text-lime-600",
        categoryCode: "Cat 5",
        title: "Industrial Operations Waste Disposal & Composting Audit",
        subtitle: "Pune Facility • 65t Recycled Metals & 12t Compost Diverted",
        tco2e: "18.2 tCO2e",
        timeAgo: "4 days ago",
        statusBadge: {
            label: "Verified",
            className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        },
    },
    {
        id: "s3-act-8",
        icon: "package_2",
        iconBgClassName: "bg-pink-500/10 text-pink-600",
        iconColorClassName: "text-pink-600",
        categoryCode: "Cat 9",
        title: "Downstream Distribution Ledger • Western & Northern Hubs",
        subtitle: "Blue Dart Express Logistics • 1,200 Delivery Dispatches",
        tco2e: "88.0 tCO2e",
        timeAgo: "5 days ago",
        statusBadge: {
            label: "Verified",
            className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        },
    },
];
