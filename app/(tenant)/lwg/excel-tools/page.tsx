// app/(tenant)/lwg/excel-tools/page.tsx
"use client";

import { LwgExcelToolsView } from "@/components/lwg/excel/LwgExcelToolsView";
import { LwgMasterHeader } from "@/components/lwg/LwgMasterHeader";
import { LwgProfileGuard } from "@/components/lwg/LwgProfileGuard";

export default function LwgExcelToolsPage() {
    return (
        <LwgProfileGuard mode="operational">
            <div className="space-y-6 animate-fade-up pb-8">
                <LwgMasterHeader activeTab="excel-tools" />
                <LwgExcelToolsView />
            </div>
        </LwgProfileGuard>
    );
}
