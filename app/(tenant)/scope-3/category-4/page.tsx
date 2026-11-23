import type { Metadata } from "next";
import { Category4View } from "@/components/scope3/category4/Category4View";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";

export const metadata: Metadata = {
    title: "Scope 3 Cat 4: Upstream Transportation | GreenLedger ESG",
    description: "Spend-based Scope 3 Category 4 accounting for Upstream Transportation and Distribution.",
};

export default function Scope3Category4Page() {
    return (
        <ProtectedRoute feature="scope_3_cat4" requiredLevel="read" featureTitle="Scope 3 Cat 4: Upstream Transportation">
            <Category4View />
        </ProtectedRoute>
    );
}
