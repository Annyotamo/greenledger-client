import type { Metadata } from "next";
import GhgAccounting from "@/components/landing/ghg/GhgAccounting";

export const metadata: Metadata = {
    title: "GHG Accounting: Scope 1, 2 and 3 | GreenLedger",
    description:
        "Audit-ready greenhouse gas accounting under the GHG Protocol: direct and process emissions, purchased energy, and all fifteen Scope 3 value-chain categories.",
};

export default function GhgAccountingPage() {
    return <GhgAccounting />;
}
