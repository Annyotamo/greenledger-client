import { DashboardView } from "@/components/dashboard/DashboardView";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";

export default function DashboardPage() {
    return (
        <ProtectedRoute feature="analytics" requiredLevel="read" featureTitle="Emissions Dashboard">
            <DashboardView />
        </ProtectedRoute>
    );
}
