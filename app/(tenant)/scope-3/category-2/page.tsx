import type { Metadata } from "next";
import { Category2View } from "@/components/scope3/category2/Category2View";

export const metadata: Metadata = {
    title: "Scope 3 Cat 2: Capital Goods | GreenLedger ESG",
    description: "Scope 3 Category 2 Spend-Based accounting for capital equipment and infrastructure.",
};

export default function Scope3Category2Page() {
    return <Category2View />;
}
