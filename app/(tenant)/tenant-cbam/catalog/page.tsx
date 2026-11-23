import type { Metadata } from "next";
import { CBAMCatalogView } from "@/components/cbam/CBAMCatalogView";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";

export const metadata: Metadata = {
    title: "Master Catalog & Guided CN Code Resolver | EU CBAM | GreenLedger ESG",
    description: "Official Combined Nomenclature 8-digit codes, cascading tariff selectors, and standard IPCC default fuels.",
};

export default function CBAMCatalogPage() {
    return (
        <ProtectedRoute feature="cbam" requiredLevel="read" featureTitle="EU CBAM Catalog">
            <CBAMCatalogView />
        </ProtectedRoute>
    );
}
