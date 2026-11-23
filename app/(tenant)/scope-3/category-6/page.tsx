import type { Metadata } from "next";
import { Category6View } from "@/components/scope3/category6/Category6View";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";

export const metadata: Metadata = {
    title: "Scope 3 Cat 6: Business Travel | GreenLedger ESG",
    description: "Scope 3 Category 6 multi-modal GHG accounting for employee business travel.",
};

export default function Scope3Category6Page() {
    return (
        <ProtectedRoute feature="scope_3_cat6" requiredLevel="read" featureTitle="Scope 3 Cat 6: Business Travel">
            <Category6View />
        </ProtectedRoute>
    );
}
