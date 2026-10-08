import type { Metadata } from "next";
import { CBAMExecutiveView } from "@/components/cbam/CBAMExecutiveView";

export const metadata: Metadata = {
    title: "EU CBAM Declaration & GHG Accounting | GreenLedger ESG",
    description:
        "Official EU Carbon Border Adjustment Mechanism (CBAM) Communication Template reporting across Sheet A_InstData and Sheet B_EmInst.",
};

export default function CBAMExecutivePage() {
    return <CBAMExecutiveView />;
}
