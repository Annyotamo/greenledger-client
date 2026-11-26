import type { ReactNode } from "react";

/** The Principle 6 indicators GreenLedger compiles per module (as on the landing's former BRSR section). Used by /brsr-reporting. */
export const BRSR: { id: string; title: string; summary: string; color: string; icon: ReactNode; groups: [string, [string, string][]][] }[] = [
    {
        id: "energy",
        title: "Energy",
        summary: "Renewable split, captive generation, intensity",
        color: "var(--ochre)",
        icon: <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7z" />,
        groups: [
            ["Renewable sources", [["Electricity consumption", "GJ"], ["Fuel consumption", "GJ"], ["Other renewable sources", "GJ"]]],
            ["Non-renewable sources", [["Grid electricity", "GJ"], ["Fuel consumption", "GJ"]]],
            ["Totals", [["Captive generation", "GJ"], ["Total energy consumed", "GJ"], ["Energy intensity per rupee of turnover", "GJ / ₹"]]],
        ],
    },
    {
        id: "water",
        title: "Water",
        summary: "Withdrawal by source, consumption, reuse",
        color: "var(--indigo)",
        icon: <path d="M12 3s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11z" />,
        groups: [
            ["Withdrawal by source", [["Surface water", "kL"], ["Groundwater", "kL"], ["Seawater or desalinated water", "kL"], ["Third-party (municipal) water", "kL"]]],
            ["Use", [["Total water consumption", "kL"], ["Water recycled and reused", "kL"]]],
        ],
    },
    {
        id: "waste",
        title: "Waste",
        summary: "Generated, recovered and disposed",
        color: "var(--clay)",
        icon: <path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13M10 11v6M14 11v6" />,
        groups: [
            ["Generated", [["Hazardous waste", "t"], ["Non-hazardous waste", "t"]]],
            ["Recovered", [["Recycled", "t"], ["Re-used", "t"], ["Other recovery operations", "t"]]],
            ["Disposed", [["Incineration", "t"], ["Landfilling", "t"]]],
        ],
    },
    {
        id: "air",
        title: "Air",
        summary: "PM, SOx, NOx, CO and VOCs",
        color: "var(--moss)",
        icon: <path d="M3 9h11a3 3 0 1 0-3-3M3 15h15a3 3 0 1 1-3 3M3 12h7" />,
        groups: [
            [
                "Emissions other than GHG",
                [
                    ["Particulate matter (PM)", "mg/Nm³"],
                    ["Sulphur oxides (SOx)", "mg/Nm³"],
                    ["Nitrogen oxides (NOx)", "mg/Nm³"],
                    ["Carbon monoxide (CO)", "mg/Nm³"],
                    ["Volatile organic compounds (VOCs)", "mg/Nm³"],
                ],
            ],
        ],
    },
];
