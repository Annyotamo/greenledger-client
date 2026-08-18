import type { Metadata } from "next";
import { Scope3DashboardView } from "@/components/scope3/Scope3DashboardView";

export const metadata: Metadata = {
    title: "Scope 3 Value Chain Emissions | GreenLedger ESG",
    description: "GHG Protocol Scope 3 indirect value chain accounting across all 15 categories.",
};

export default function Scope3Page() {
    return <Scope3DashboardView />;
}
