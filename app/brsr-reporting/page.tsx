import type { Metadata } from "next";
import BrsrPage from "@/components/landing/brsr/BrsrPage";

export const metadata: Metadata = {
    title: "BRSR Principle 6 Reporting | GreenLedger",
    description:
        "Pre-configured Principle 6 matrices for SEBI's Business Responsibility and Sustainability Report: energy, water, waste and air compiled from your plant's activity data.",
};

export default function PublicBrsrPage() {
    return <BrsrPage />;
}
