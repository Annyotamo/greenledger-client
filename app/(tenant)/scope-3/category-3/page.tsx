import type { Metadata } from "next";
import { Category3View } from "@/components/scope3/category3/Category3View";

export const metadata: Metadata = {
    title: "Scope 3 Cat 3: Fuel & Energy Activities | GreenLedger ESG",
    description: "Scope 3 Category 3 accounting for Upstream WTT Fuels and Electricity Grid T&D Losses.",
};

export default function Scope3Category3Page() {
    return <Category3View />;
}
