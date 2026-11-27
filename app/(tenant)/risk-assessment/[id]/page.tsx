"use client";

import { use } from "react";
import { AssessmentDetailView } from "@/components/climateRisk/AssessmentDetailView";

export default function RiskAssessmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <AssessmentDetailView id={id} />;
}
