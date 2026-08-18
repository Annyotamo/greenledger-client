import type { Metadata } from "next";
import { Category1View } from "@/components/scope3/category1/Category1View";

export const metadata: Metadata = {
    title: "Scope 3 Cat 1: Purchased Goods & Services | GreenLedger ESG",
    description: "Scope 3 Category 1 Spend-Based accounting powered by US EPA USEEIO factors.",
};

export default function Scope3Category1Page() {
    return <Category1View />;
}
