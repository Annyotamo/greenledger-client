// app/(tenant)/lwg/audit-simulation/page.tsx
"use client";

import { LwgMasterHeader } from "@/components/lwg/LwgMasterHeader";
import { LwgProfileGuard } from "@/components/lwg/LwgProfileGuard";
import { LwgMedalSimulatorView } from "@/components/lwg/simulation/LwgMedalSimulatorView";

export default function LwgAuditSimulationPage() {
    return (
        <LwgProfileGuard mode="operational">
            <div className="space-y-6 animate-fade-up pb-8">
                <LwgMasterHeader activeTab="audit-simulation" />
                <LwgMedalSimulatorView />
            </div>
        </LwgProfileGuard>
    );
}
