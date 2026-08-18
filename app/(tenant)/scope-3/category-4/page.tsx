import type { Metadata } from "next";
import { Category4View } from "@/components/scope3/category4/Category4View";

export const metadata: Metadata = {
    title: "Scope 3 Cat 4: Upstream Transportation | GreenLedger ESG",
    description: "Spend-based Scope 3 Category 4 accounting for Upstream Transportation and Distribution.",
};

export default function Scope3Category4Page() {
    return <Category4View />;
}
