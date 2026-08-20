import type { Metadata } from "next";
import { Category6View } from "@/components/scope3/category6/Category6View";

export const metadata: Metadata = {
    title: "Scope 3 Cat 6: Business Travel | GreenLedger ESG",
    description: "Scope 3 Category 6 multi-modal GHG accounting for employee business travel.",
};

export default function Scope3Category6Page() {
    return <Category6View />;
}
