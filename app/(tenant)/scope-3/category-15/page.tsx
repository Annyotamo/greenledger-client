import type { Metadata } from "next";
import { Category15View } from "@/components/scope3/category15/Category15View";

export const metadata: Metadata = {
    title: "Scope 3 Cat 15: Investments | GreenLedger ESG",
    description: "PCAF Standard Scope 3 Category 15 accounting for Investments and Financed Emissions.",
};

export default function Scope3Category15Page() {
    return <Category15View />;
}
