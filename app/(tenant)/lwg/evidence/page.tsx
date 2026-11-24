// app/(tenant)/lwg/evidence/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { LwgEvidenceSectionSidebar } from "@/components/lwg/evidence/LwgEvidenceSectionSidebar";
import { LwgEvidenceTable } from "@/components/lwg/evidence/LwgEvidenceTable";
import { LwgMasterHeader } from "@/components/lwg/LwgMasterHeader";
import { LwgProfileGuard } from "@/components/lwg/LwgProfileGuard";
import { useLwgEvidence } from "@/lib/lwg/hooks";

export default function LwgEvidencePage() {
    return (
        <LwgProfileGuard mode="operational">
            <Suspense fallback={<div className="h-96 rounded-2xl bg-surface-container-high animate-pulse" />}>
                <LwgEvidenceContent />
            </Suspense>
        </LwgProfileGuard>
    );
}

function LwgEvidenceContent() {
    const searchParams = useSearchParams();
    const initialSectionParam = searchParams.get("section");
    const initialSection = initialSectionParam ? parseInt(initialSectionParam, 10) : null;

    const [selectedSection, setSelectedSection] = useState<number | null>(
        !isNaN(Number(initialSection)) ? initialSection : null,
    );

    const { data: evidenceList = [], isLoading, isError, error } = useLwgEvidence();

    return (
        <div className="space-y-6 animate-fade-up pb-8">
            <LwgMasterHeader activeTab="evidence" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* 17-Section Left Sidebar */}
                <div className="lg:col-span-4 xl:col-span-3">
                    <div className="sticky top-4">
                        <LwgEvidenceSectionSidebar
                            selectedSection={selectedSection}
                            onSelectSection={(sec) => setSelectedSection(sec)}
                            evidenceList={evidenceList}
                        />
                    </div>
                </div>

                {/* Master Documents Table */}
                <div className="lg:col-span-8 xl:col-span-9">
                    <LwgEvidenceTable
                        selectedSection={selectedSection}
                        onSelectSection={(sec) => setSelectedSection(sec)}
                        evidenceList={evidenceList}
                        isLoading={isLoading}
                        isError={isError}
                        error={error}
                    />
                </div>
            </div>
        </div>
    );
}
