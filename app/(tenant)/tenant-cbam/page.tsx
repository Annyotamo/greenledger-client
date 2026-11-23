"use client";

import { CBAMExecutiveView } from "@/components/cbam/CBAMExecutiveView";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";

export default function CBAMExecutivePage() {
    return (
        <ProtectedRoute feature="cbam" requiredLevel="read" featureTitle="EU CBAM Reporting">
            <CBAMExecutiveView />
        </ProtectedRoute>
    );
}
