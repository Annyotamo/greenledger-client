import type { Metadata } from "next";
import { CBAMInstallationView } from "@/components/cbam/CBAMInstallationView";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";

export const metadata: Metadata = {
    title: "Installation Setup (Sheet A_InstData) | EU CBAM | GreenLedger ESG",
    description: "Industrial installation profile, geographic location, verifier details, and declared produced goods G1..G10.",
};

export default function CBAMInstallationPage() {
    return (
        <ProtectedRoute feature="cbam" requiredLevel="read" featureTitle="EU CBAM Installation">
            <CBAMInstallationView />
        </ProtectedRoute>
    );
}
