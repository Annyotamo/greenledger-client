import type { Metadata } from "next";
import { Category5View } from "@/components/scope3/category5/Category5View";

export const metadata: Metadata = {
    title: "Scope 3 Cat 5: Waste in Operations | GreenLedger ESG",
    description: "Scope 3 Category 5 accounting for Waste Generated in Operations across treatment routes.",
};

export default function Scope3Category5Page() {
    return <Category5View />;
}
