// app/(tenant)/lwg/energy/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LwgEnergyTable } from "@/components/lwg/energy/LwgEnergyTable";
import { LwgMasterHeader } from "@/components/lwg/LwgMasterHeader";
import { LwgProfileGuard } from "@/components/lwg/LwgProfileGuard";

export default function LwgEnergyPage() {
    return (
        <LwgProfileGuard mode="operational">
            <Suspense fallback={<div className="h-96 rounded-2xl bg-surface-container-high animate-pulse" />}>
                <LwgEnergyPageContent />
            </Suspense>
        </LwgProfileGuard>
    );
}

function LwgEnergyPageContent() {
    const searchParams = useSearchParams();
    const initialMonth = searchParams.get("month") || undefined;

    return (
        <div className="space-y-6 animate-fade-up pb-8">
            <LwgMasterHeader activeTab="energy" />
            <LwgEnergyTable initialMonth={initialMonth} />
        </div>
    );
}
