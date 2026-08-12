export type PillarId = "accuracy" | "compliance" | "governance";

export interface PillarConfig {
    id: PillarId;
    label: string;
    shortLabel: string;
    badgeText: string;
    description: string;
    iconName: string;
}

export interface BeforeAfterItem {
    id: string;
    pillarId: PillarId;
    title: string;
    iconName: string;
    metricBadge: string;
    before: {
        tag: string;
        headline: string;
        description: string;
    };
    after: {
        tag: string;
        headline: string;
        description: string;
    };
    benefit: {
        tag: string;
        headline: string;
        description: string;
        quantifiableImpact?: string;
    };
}

export const PILLARS: PillarConfig[] = [
    {
        id: "accuracy",
        label: "Emissions & Calculation Accuracy",
        shortLabel: "Calculations",
        badgeText: "DECISION-GRADE DATA",
        description: "Replace generic spreadsheets and static conversion factors with built-in DEFRA/IPCC datasets and laboratory fuel ingestion.",
        iconName: "TargetIcon",
    },
    {
        id: "compliance",
        label: "Regulatory Compliance & Carbon Markets",
        shortLabel: "CBAM & Markets",
        badgeText: "FINANCIAL PROTECTION",
        description: "Transform regulatory filings for CBAM, CCTS, and BRSR from stressful scrambles into automated, audit-proof competitive advantages.",
        iconName: "ShieldCheckIcon",
    },
    {
        id: "governance",
        label: "Governance, Audit & Enterprise Scaling",
        shortLabel: "Governance",
        badgeText: "ENTERPRISE CONTROL",
        description: "Scale from a single facility to enterprise-wide operations with append-only audit trails, role-based access, and branded reporting.",
        iconName: "LayersIcon",
    },
];

export const BEFORE_AFTER_ITEMS: BeforeAfterItem[] = [
    // --- PILLAR 1: ACCURACY ---
    {
        id: "scope1-accuracy",
        pillarId: "accuracy",
        title: "Scope 1 Factor Precision",
        iconName: "FlameIcon",
        metricBadge: "DEFRA & IPCC Native",
        before: {
            tag: "FRAGMENTED SPREADSHEETS",
            headline: "Rough, static conversion estimates",
            description: "Fuel emissions calculated with generic conversion numbers or outdated consultant spreadsheets that are rarely updated.",
        },
        after: {
            tag: "GREENLEDGER SPINE",
            headline: "Built-in IPCC & DEFRA factors",
            description: "Calculations automatically draw from recognized global reference datasets updated dynamically across all plants.",
        },
        benefit: {
            tag: "ECONOMIC BENEFIT",
            headline: "Zero recurring consultant recalculation fees",
            description: "Eliminates annual retainer costs for external consultants to manually recalculate standard emission factors.",
            quantifiableImpact: "Save $15K–$40K / year",
        },
    },
    {
        id: "fuel-specific",
        pillarId: "accuracy",
        title: "Fuel Lab-Report Integration",
        iconName: "TestTubeIcon",
        metricBadge: "Direct Lab Ingestion",
        before: {
            tag: "ASSUMED AVERAGES",
            headline: "Generic defaults mask real fuel quality",
            description: "Every fuel batch uses standard generic factors even when lab reports prove higher calorific efficiency.",
        },
        after: {
            tag: "REAL-TIME FACTORING",
            headline: "Custom factors from fuel lab certificates",
            description: "Directly ingest laboratory assays to compute accurate, plant-specific net calorific values and carbon contents.",
        },
        benefit: {
            tag: "ECONOMIC BENEFIT",
            headline: "Eliminates conservative default penalty taxes",
            description: "Accurate, lower emissions figures directly reduce tax exposure under regulatory schemes that punish assumed defaults.",
            quantifiableImpact: "Avoid 8–14% Over-Taxation",
        },
    },
    {
        id: "scope2-electricity",
        pillarId: "accuracy",
        title: "Scope 2 Dual Accounting",
        iconName: "ZapIcon",
        metricBadge: "Location + Market Dual",
        before: {
            tag: "LOCATION-ONLY",
            headline: "Clean energy investments invisible",
            description: "Electricity reported strictly via grid averages, giving zero credit for solar installations, RECs, or green PPAs.",
        },
        after: {
            tag: "DUAL-METHODOLOGY",
            headline: "Market-based & location-based tracking",
            description: "Supports both location-based and market-based accounting, including purchased steam, heating, and cooling.",
        },
        benefit: {
            tag: "ECONOMIC BENEFIT",
            headline: "Monetizes renewable power & PPA investments",
            description: "Visibly reduces reported carbon balance on financial balance sheets, unlocking green-linked credit facilities.",
            quantifiableImpact: "100% PPA Recognition",
        },
    },
    {
        id: "scope3-value-chain",
        pillarId: "accuracy",
        title: "Scope 3 Full Value Chain",
        iconName: "GitBranchIcon",
        metricBadge: "All 15 Scope 3 Categories",
        before: {
            tag: "PARTIAL ESTIMATES",
            headline: "Skipped or guessed value chain data",
            description: "Scope 3 is omitted entirely or roughly guessed for 2–3 categories, leaving massive blind spots in ratings.",
        },
        after: {
            tag: "COMPLETE COVERAGE",
            headline: "Full 15 Scope 3 categories covered",
            description: "Hybrid spend-based and activity-based models map emissions across raw materials, logistics, waste, and travel.",
        },
        benefit: {
            tag: "ECONOMIC BENEFIT",
            headline: "Protects preferred vendor status with buyers",
            description: "Meets strict procurement standards of global buyers and ratings agencies (CDP, EcoVadis) without rating downgrades.",
            quantifiableImpact: "15/15 Categories Mapped",
        },
    },

    // --- PILLAR 2: COMPLIANCE & MARKETS ---
    {
        id: "cbam-exposure",
        pillarId: "compliance",
        title: "EU CBAM Exposure Protection",
        iconName: "GlobeIcon",
        metricBadge: "€75/t Penalty Avoided",
        before: {
            tag: "DEFAULT EU BENCHMARKS",
            headline: "Punitive default rate charges",
            description: "Exporters without verified plant data are charged EU default benchmark rates (~€75+/tonne CO2e penalty).",
        },
        after: {
            tag: "VERIFIED ACTUALS",
            headline: "Plant-level installation declarations",
            description: "Verified Scope 1–3 data enables exact carbon intensity declarations per shipment consignment.",
        },
        benefit: {
            tag: "ECONOMIC BENEFIT",
            headline: "Cuts certificate bill on every EU consignment",
            description: "Verified actual values replace high EU default penalty rates, keeping exported industrial goods competitive.",
            quantifiableImpact: "Up to €75/t Savings",
        },
    },
    {
        id: "ccts-baseline",
        pillarId: "compliance",
        title: "CCTS Carbon Credit Baseline",
        iconName: "TrendingUpIcon",
        metricBadge: "₹600–1,200/t Credit Yield",
        before: {
            tag: "STANDING START",
            headline: "Unorganized data risks compliance gap",
            description: "Plants lack organized Scope 1–3 baselines needed to prove eligibility when carbon trading schemes take effect.",
        },
        after: {
            tag: "AUDIT-READY BASELINE",
            headline: "Instant defensible carbon baseline",
            description: "Daily reporting data creates an audit-ready baseline that supports carbon trading compliance and project registration.",
        },
        benefit: {
            tag: "ECONOMIC BENEFIT",
            headline: "Unlocks tradeable carbon credit revenue",
            description: "Prepares facility to earn tradeable carbon credit certificates priced early at ₹600–₹1,200 per tonne CO2e.",
            quantifiableImpact: "Monetize Carbon Credits",
        },
    },
    {
        id: "brsr-reporting",
        pillarId: "compliance",
        title: "BRSR Principle 6 Automation",
        iconName: "FileCheckIcon",
        metricBadge: "Same-Day Filing Ready",
        before: {
            tag: "MANUAL SCRAMBLE",
            headline: "3-week crunch per filing cycle",
            description: "Energy, water, waste, and air data gathered in disconnected files and manually reformatted under deadline pressure.",
        },
        after: {
            tag: "NATIVE COMPLIANCE",
            headline: "Continuous BRSR Principle 6 engine",
            description: "Environmental figures automatically aggregate into BRSR Principle 6 templates ready when filing opens.",
        },
        benefit: {
            tag: "ECONOMIC BENEFIT",
            headline: "Reduces filing scramble from weeks to hours",
            description: "Reclaims hundreds of executive and engineering staff hours every reporting season while eliminating penalty risks.",
            quantifiableImpact: "Save 120+ Hours / Cycle",
        },
    },
    {
        id: "air-emissions",
        pillarId: "compliance",
        title: "Unified Air Emissions",
        iconName: "WindIcon",
        metricBadge: "Single Unified Engine",
        before: {
            tag: "SILOED EFFORT",
            headline: "Air emissions handled separately",
            description: "NOx, SOx, and particulate matter tracked outside carbon inventory on separate spreadsheets with duplicate effort.",
        },
        after: {
            tag: "UNIFIED INVENTORY",
            headline: "Air emissions co-located with GHG data",
            description: "Reports air emissions alongside Scope 1–3 environmental datasets in one unified operational workflow.",
        },
        benefit: {
            tag: "ECONOMIC BENEFIT",
            headline: "Eliminates duplicate system & filing overhead",
            description: "Single filing workflow lowers administrative cost and removes the risk of missed environmental deadlines.",
            quantifiableImpact: "Single Reporting Track",
        },
    },

    // --- PILLAR 3: GOVERNANCE & SCALING ---
    {
        id: "audit-trail",
        pillarId: "governance",
        title: "Tamper-Evident Audit Trail",
        iconName: "LockIcon",
        metricBadge: "100% Traceable Logs",
        before: {
            tag: "UNRECORDED EDITS",
            headline: "No record of data overrides or source",
            description: "Cell overwrites occur without history. Verifiers and auditors question numbers, stalling assurance sign-offs.",
        },
        after: {
            tag: "IMMUTABLE LOGGING",
            headline: "Automated append-only audit trail",
            description: "Every user edit, timestamp, conversion factor, and evidence attachment is permanently logged with complete lineage.",
        },
        benefit: {
            tag: "ECONOMIC BENEFIT",
            headline: "Accelerates verifications & protects deal timelines",
            description: "Clean verifier-ready evidence package prevents costly assurance delays when buyers or lenders request proof.",
            quantifiableImpact: "Instant Sign-Off Ready",
        },
    },
    {
        id: "facility-scaling",
        pillarId: "governance",
        title: "Dynamic Facility Hierarchy",
        iconName: "Building2Icon",
        metricBadge: "Zero Rebuild Cost",
        before: {
            tag: "MANUAL REBUILDS",
            headline: "Rebuilding sheets for every plant added",
            description: "Adding new factories, sheds, or subsidiaries forces teams to manually rebuild formulas and workbook links.",
        },
        after: {
            tag: "SCALABLE ARCHITECTURE",
            headline: "Native multi-site org structure",
            description: "Add plants and subsidiaries into the organizational boundary instantly; inventory scales automatically.",
        },
        benefit: {
            tag: "ECONOMIC BENEFIT",
            headline: "Flat software cost as organization expands",
            description: "Prevents escalating consultant fees and setup costs every time a facility is acquired or constructed.",
            quantifiableImpact: "Flat Scale Cost",
        },
    },
    {
        id: "team-access",
        pillarId: "governance",
        title: "Role-Based Access Control",
        iconName: "UserCheckIcon",
        metricBadge: "Scoped RBAC Controls",
        before: {
            tag: "RISKY & BOTTLENECKED",
            headline: "Single-person dependency or open access",
            description: "Either one person holds all numbers as a bottleneck, or everyone has edit access risking accidental corruption.",
        },
        after: {
            tag: "GOVERNED WORKFLOW",
            headline: "Scoped permissions by role & facility",
            description: "Site operators enter activity metrics, sustainability leads review, and executive approvers sign off.",
        },
        benefit: {
            tag: "ECONOMIC BENEFIT",
            headline: "Eliminates data entry corruption & rework",
            description: "Removes single-point-of-failure operational risks while maintaining strict segregation of duties.",
            quantifiableImpact: "Zero Data Corruption",
        },
    },
    {
        id: "multi-site-visibility",
        pillarId: "governance",
        title: "Multi-Site Visibility Command",
        iconName: "LayoutDashboardIcon",
        metricBadge: "Central Site Command",
        before: {
            tag: "SCATTERED FILES",
            headline: "Chasing numbers across emails & plants",
            description: "Facility metrics scattered across regional spreadsheets with zero real-time status or ownership clarity.",
        },
        after: {
            tag: "REAL-TIME COMMAND",
            headline: "Unified site profiles & status command",
            description: "Detailed dashboard for every facility showing activity status, ownership, submission history, and pending reviews.",
        },
        benefit: {
            tag: "ECONOMIC BENEFIT",
            headline: "Reclaims management hours across operational sites",
            description: "Eliminates endless email follow-ups and data reconciliation calls between central ESG teams and plant engineers.",
            quantifiableImpact: "100% Site Status Clarity",
        },
    },
];
