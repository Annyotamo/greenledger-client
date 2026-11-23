import { EnergyDashboardView } from "@/components/dashboard/EnergyDashboardView";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";

export default function EnergyDashboardPage() {
    return (
        <ProtectedRoute feature="analytics" requiredLevel="read" featureTitle="Energy Dashboard">
            <EnergyDashboardView />
        </ProtectedRoute>
    );
}
