import type { Metadata } from "next";
import { Category3View } from "@/components/scope3/category3/Category3View";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";

export const metadata: Metadata = {
    title: "Scope 3 Cat 3: Fuel & Energy Activities | GreenLedger ESG",
    description: "Scope 3 Category 3 accounting for Upstream WTT Fuels and Electricity Grid T&D Losses.",
};

export default function Scope3Category3Page() {
    return (
        <ProtectedRoute feature="scope_3_cat3" requiredLevel="read" featureTitle="Scope 3 Cat 3: Fuel & Energy Activities">
            <Category3View />
        </ProtectedRoute>
    );
}
