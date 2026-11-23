"use client";

import { Scope3DashboardView } from "@/components/scope3/Scope3DashboardView";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";

export default function Scope3Page() {
    return (
        <ProtectedRoute feature="scope_3_cat1" requiredLevel="read" featureTitle="Scope 3 Value Chain">
            <Scope3DashboardView />
        </ProtectedRoute>
    );
}
