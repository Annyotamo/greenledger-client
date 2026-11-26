import type { Metadata } from "next";
import { ConfigView } from "@/components/climateRisk/ConfigView";

export const metadata: Metadata = {
    title: "Risk Ruleset Config | GreenLedger ESG",
};

export default function RiskConfigPage() {
    return <ConfigView />;
}
