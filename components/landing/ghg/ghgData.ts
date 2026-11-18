/** Content for the GHG Accounting page. Scope activities and icons come from the landing's former Scopes Ledger section. */

/** Line icons drawn on a 100×100 grid (stroke icons, rendered with stroke-width 4.5). */
export const SCOPE_ICON: Record<string, string> = {
    process:
        '<path d="M35 15h30M42 15v15L25 75a6 6 0 0 0 5 9h40a6 6 0 0 0 5-9L58 30V15"/><path d="M28 66h44" stroke-dasharray="3 3"/><circle cx="45" cy="50" r="3"/><circle cx="55" cy="62" r="2.5"/><circle cx="38" cy="72" r="4"/><circle cx="62" cy="70" r="3"/><path d="M46 10c-2-3 2-3 0-6M54 10c2-3-2-3 0-6"/>',
    vehicles: '<path d="M15 35h50v35H15zM65 45h15l8 10v15H65z"/><circle cx="32" cy="75" r="9"/><circle cx="72" cy="75" r="9"/><path d="M68 50h10v8H68z"/>',
    facility:
        '<path d="M25 85V20a3 3 0 0 1 3-3h44a3 3 0 0 1 3 3v65"/><path d="M35 30h8v8h-8zM57 30h8v8h-8zM35 48h8v8h-8zM57 48h8v8h-8zM35 66h8v8h-8zM57 66h8v8h-8z"/><path d="M46 72h8v13h-8z"/>',
    fugitive:
        '<path d="M15 45h20M65 45h20M35 38v14M65 38v14"/><rect x="39" y="35" width="22" height="20" rx="2"/><circle cx="50" cy="22" r="10"/><path d="M50 22l6-4M30 35c-2-3-5-3-7-3M70 35c2-3 5-3 7-3M48 62c-2 3-1 6-3 9M54 62c2 3 1 6 3 9"/>',
    heating: '<path d="M44 20v45a8 8 0 1 0 12 0V20a6 6 0 0 0-12 0z"/><path d="M50 48v22" stroke-width="4"/><path d="M68 25c2 2 2 5 0 7M74 20c4 3 4 8 0 11M28 25c-2 2-2 5 0 7M22 20c-4 3-4 8 0 11"/>',
    steam: '<path d="M30 65c-4 0-8-3-8-7s4-7 9-6c1-5 6-9 11-8 5 0 9 3 10 7a9 9 0 0 1 12 1c4 3 3 8-1 9s-27 4-33 4z"/><path d="M40 38c-3-5 3-7 0-12M50 34c-3-5 3-7 0-12M60 38c-3-5 3-7 0-12"/>',
    electricity: '<path d="M50 15L25 85M50 15l25 70M33 60h34M38 43h24M44 26h12M18 43h64M23 26h54M22 43v10M78 43v10"/><path d="M50 48l-4 6h8l-4 6"/>',
    goods: '<path d="M50 20L20 33v34l30 13 30-13V33L50 20z"/><path d="M20 33l30 13 30-13M50 46v34"/><circle cx="70" cy="45" r="10"/><path d="M66 45l3 3 5-5"/>',
    travel: '<path d="M20 50l30-8 28-28 6 2 1 12-25 18 18 10 10-6 4 1-2 8-16 6-10 16-4-1 2-8z"/>',
    waste: '<path d="M30 30h40v50a5 5 0 0 1-5 5H35a5 5 0 0 1-5-5V30z"/><path d="M25 30h50M42 30V20a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10"/><path d="M45 46a6 6 0 0 1 10 0l2 4M55 64a6 6 0 0 1-10 0l-2-4"/>',
    commute: '<rect x="25" y="25" width="50" height="42" rx="6"/><path d="M30 32h16v14H30zM54 32h16v14H54z"/><circle cx="38" cy="73" r="6"/><circle cx="62" cy="73" r="6"/>',
    // Scope 3 categories not covered above
    capital: '<path d="M15 85V45l20 12V45l20 12V30h12v-12h10v67z"/><path d="M15 85h70M62 30h20"/><circle cx="45" cy="72" r="5"/>',
    fuel: '<rect x="22" y="22" width="34" height="62" rx="4"/><path d="M28 34h22v16H28zM56 40h10a6 6 0 0 1 6 6v24a5 5 0 0 0 10 0V36l-10-10"/>',
    truck: '<path d="M10 30h48v38H10zM58 44h16l12 13v11H58z"/><circle cx="26" cy="74" r="8"/><circle cx="70" cy="74" r="8"/>',
    leasedUp: '<path d="M20 85V35l30-17 30 17v50z"/><path d="M40 85V60h20v25"/><circle cx="72" cy="30" r="8"/><path d="M78 36l10 10-4 4-3-3-3 3-3-3"/>',
    ship: '<path d="M12 62h76l-10 18H22z"/><path d="M24 62V44h18v18M46 62V36h18v26M68 62V48h12v14"/><path d="M50 36V24"/>',
    process2: '<circle cx="50" cy="50" r="12"/><path d="M50 18v10M50 72v10M18 50h10M72 50h10M27 27l7 7M66 66l7 7M27 73l7-7M66 34l7-7"/>',
    plug: '<path d="M38 15v18M62 15v18M28 33h44v14a22 22 0 0 1-44 0z"/><path d="M50 69v16"/>',
    recycle: '<path d="M38 26l12-12 12 12M50 14v30M80 58l-6 16H50M74 74l-10-10M20 58l6 16h14M26 74l10-10"/><path d="M28 48l-8 10M72 48l8 10"/>',
    leasedDown: '<path d="M15 40h70l-6-20H21z"/><path d="M20 40v45h60V40M40 85V62h20v23"/><path d="M15 40c0 6 6 9 11 9s11-3 11-9c0 6 6 9 11 9s11-3 11-9c0 6 6 9 11 9s11-3 11-9"/>',
    franchise: '<path d="M18 85V42h64v43"/><path d="M12 42l8-20h60l8 20zM42 85V62h16v23"/><path d="M50 22V10h14l-4 5 4 5H50"/>',
    invest: '<path d="M15 85h70"/><path d="M22 85V60h12v25M44 85V45h12v40M66 85V28h12v57"/><path d="M20 40l20-14 16 8 24-18"/><path d="M70 16h10v10"/>',
};

export type ScopeId = 1 | 2 | 3;
export const SCOPES: { id: ScopeId; name: string; color: string; banner: string; cat: string; acts: [string, string, string][] }[] = [
    {
        id: 1,
        name: "Direct",
        color: "var(--s1)",
        banner: "Reporting company",
        cat: "Direct Emissions",
        acts: [
            ["process", "Process Emissions", "Direct greenhouse gas emissions from physical or chemical processing during manufacturing, such as calcination in cement production or chemical reductions in steelmaking. These are inherent to industrial processes and require precise stoichiometric tracking."],
            ["vehicles", "Company Vehicles", "Mobile combustion emissions from vehicles owned or controlled by the reporting organization (e.g., corporate fleets, delivery vans, and heavy machinery). Monitored via fuel card transactions, telematics, and direct invoices."],
            ["facility", "Company Facility", "Stationary combustion emissions from boilers, furnaces, heaters, and generators operating within facilities owned or leased by the company. Calculations are based on natural gas, fuel oil, or coal consumed."],
            ["fugitive", "Fugitive Emissions", "Intentional or unintentional releases of greenhouse gases, such as refrigerant leaks from HVAC systems, methane leaks from pipelines, or wastewater treatment emissions. Monitored through refrigerant top-up logs and pressure tests."],
        ],
    },
    {
        id: 2,
        name: "Indirect",
        color: "var(--s2)",
        banner: "Upstream activities",
        cat: "Indirect Electricity Emissions",
        acts: [
            ["heating", "Heating & Cooling for Own Use", "Emissions from the consumption of purchased heat, steam, or chilled water imported into company facilities. Calculated using supplier-specific utility factors or national grid averages."],
            ["steam", "Steam", "Indirect emissions associated with the production of steam purchased from a third-party district energy system. Essential for chemical processing and heating, calculated based on mass or energy units consumed."],
            ["electricity", "Purchased Electricity", "Indirect emissions from electricity generated by third-party utilities and consumed in company operations. GreenLedger supports both location-based grid averages and market-based contract/REC accounting methods."],
        ],
    },
    {
        id: 3,
        name: "Value chain",
        color: "var(--s3)",
        banner: "Upstream & downstream value chain",
        cat: "Value Chain Emissions",
        acts: [
            ["goods", "Purchased Goods & Services", "Upstream emissions from raw materials, packaging, and outsourced services purchased by the company. GreenLedger calculates these using spend-based models or supplier-specific life-cycle assessments (LCA)."],
            ["travel", "Business Travel", "Emissions from employee transportation for business-related activities in third-party owned vehicles (flights, rail, rental cars, and hotels). Tracked via travel agency integrations and expense records."],
            ["waste", "Waste Generated in Operations", "Emissions from the disposal and treatment of waste generated in the organization’s operations (landfilling, incineration, recycling). Monitored using waste haul manifests and disposal facility reports."],
            ["commute", "Employee Commuting", "Emissions from the transportation of employees between their homes and their worksites. Estimated using annual survey data, transit usage tracking, or default work-from-home adjustment factors."],
        ],
    },
];

export const SCOPE_PHOTO_ALT: Record<ScopeId, string> = {
    1: "A boiler house with two red-and-white chimneys venting steam",
    2: "High-voltage transmission pylons carrying power lines across a field",
    3: "A container freight train running through a forested valley",
};

/**
 * Line icon for each Scope 3 category, keyed by category id. The names, descriptions and which categories have a
 * calculator come from the app's own Scope 3 module (lib/scope3/data.ts), so the website and the product say the same thing.
 */
export const SCOPE3_ICON: Record<number, string> = {
    1: "goods",
    2: "capital",
    3: "fuel",
    4: "truck",
    5: "waste",
    6: "travel",
    7: "commute",
    8: "leasedUp",
    9: "ship",
    10: "process2",
    11: "plug",
    12: "recycle",
    13: "leasedDown",
    14: "franchise",
    15: "invest",
};
