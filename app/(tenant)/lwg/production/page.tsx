// app/(tenant)/lwg/production/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LwgMasterHeader } from "@/components/lwg/LwgMasterHeader";
import { LwgProfileGuard } from "@/components/lwg/LwgProfileGuard";
import { LwgProductionTable } from "@/components/lwg/production/LwgProductionTable";

export default function LwgProductionPage() {
    return (
        <LwgProfileGuard mode="operational">
            <Suspense fallback={<div className="h-96 rounded-2xl bg-surface-container-high animate-pulse" />}>
                <LwgProductionPageContent />
            </Suspense>
        </LwgProfileGuard>
    );
}

function LwgProductionPageContent() {
    const searchParams = useSearchParams();
    const initialMonth = searchParams.get("month") || undefined;

    return (
        <div className="space-y-6 animate-fade-up pb-8">
            <LwgMasterHeader activeTab="production" />
            <LwgProductionTable initialMonth={initialMonth} />
        </div>
    );
}
