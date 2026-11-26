import type { Metadata } from "next";
import { AssessmentListView } from "@/components/climateRisk/AssessmentListView";

export const metadata: Metadata = {
    title: "Climate Risk Assessment | GreenLedger ESG",
    description: "Physical and transition climate risk screen per facility and for the company.",
};

export default function RiskAssessmentPage() {
    return <AssessmentListView />;
}
