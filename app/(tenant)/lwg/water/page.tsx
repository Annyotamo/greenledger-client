// app/(tenant)/lwg/water/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LwgMasterHeader } from "@/components/lwg/LwgMasterHeader";
import { LwgProfileGuard } from "@/components/lwg/LwgProfileGuard";
import { LwgWaterTable } from "@/components/lwg/water/LwgWaterTable";

export default function LwgWaterPage() {
    return (
        <LwgProfileGuard mode="operational">
            <Suspense fallback={<div className="h-96 rounded-2xl bg-surface-container-high animate-pulse" />}>
                <LwgWaterPageContent />
            </Suspense>
        </LwgProfileGuard>
    );
}

function LwgWaterPageContent() {
    const searchParams = useSearchParams();
    const initialMonth = searchParams.get("month") || undefined;

    return (
        <div className="space-y-6 animate-fade-up pb-8">
            <LwgMasterHeader activeTab="water" />
            <LwgWaterTable initialMonth={initialMonth} />
        </div>
    );
}
