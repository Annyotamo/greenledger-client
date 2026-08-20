import type { Metadata } from "next";
import { Category7View } from "@/components/scope3/category7/Category7View";

export const metadata: Metadata = {
    title: "Scope 3 Cat 7: Employee Commuting | GreenLedger ESG",
    description: "Scope 3 Category 7 multi-modal GHG accounting for employee commuting.",
};

export default function Scope3Category7Page() {
    return <Category7View />;
}
