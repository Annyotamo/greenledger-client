import type { Metadata } from "next";
import { CBAMSourceStreamsView } from "@/components/cbam/CBAMSourceStreamsView";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";

export const metadata: Metadata = {
    title: "Source Streams & Emissions (Sheet B_EmInst) | EU CBAM | GreenLedger ESG",
    description: "75-slot deterministic greenhouse gas calculation grid for Combustion and Mass Balance source streams.",
};

export default function CBAMSourceStreamsPage() {
    return (
        <ProtectedRoute feature="cbam" requiredLevel="read" featureTitle="EU CBAM Source Streams">
            <CBAMSourceStreamsView />
        </ProtectedRoute>
    );
}
