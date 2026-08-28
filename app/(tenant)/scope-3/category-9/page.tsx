import type { Metadata } from "next";
import { Category9View } from "@/components/scope3/category9/Category9View";

export const metadata: Metadata = {
    title: "Scope 3 Cat 9: Downstream Transportation | GreenLedger ESG",
    description: "DEFRA distance weight-based Scope 3 Category 9 accounting for Downstream Transportation and Distribution.",
};

export default function Scope3Category9Page() {
    return <Category9View />;
}
