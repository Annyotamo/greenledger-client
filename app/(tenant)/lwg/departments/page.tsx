// app/(tenant)/lwg/departments/page.tsx
"use client";

import { LwgDepartmentsTable } from "@/components/lwg/LwgDepartmentsTable";
import { LwgMasterHeader } from "@/components/lwg/LwgMasterHeader";
import { LwgProfileGuard } from "@/components/lwg/LwgProfileGuard";
import { LwgProfileSettingsCard } from "@/components/lwg/LwgProfileSettingsCard";

export default function LwgDepartmentsPage() {
    return (
        <LwgProfileGuard mode="operational">
            <div className="space-y-6 animate-fade-up">
                <LwgMasterHeader activeTab="departments" />
                <LwgProfileSettingsCard />
                <LwgDepartmentsTable />
            </div>
        </LwgProfileGuard>
    );
}
