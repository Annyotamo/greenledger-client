import type { Metadata } from "next";
import CbamPage from "@/components/landing/cbam/CbamPage";

export const metadata: Metadata = {
    title: "EU CBAM Exporter Compliance & Embedded Emissions | GreenLedger",
    description:
        "Installation-level embedded-emissions data for your EU buyers — verified and audit-ready, so your shipments aren't priced on punitive default values.",
};

export default function PublicCBAMPage() {
    return <CbamPage />;
}
