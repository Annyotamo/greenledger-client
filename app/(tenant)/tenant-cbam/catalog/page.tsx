import type { Metadata } from "next";
import { CBAMCatalogView } from "@/components/cbam/CBAMCatalogView";

export const metadata: Metadata = {
    title: "Master Catalog & Guided CN Code Resolver | EU CBAM | GreenLedger ESG",
    description: "Official Combined Nomenclature 8-digit codes, cascading tariff selectors, and standard IPCC default fuels.",
};

export default function CBAMCatalogPage() {
    return <CBAMCatalogView />;
}
