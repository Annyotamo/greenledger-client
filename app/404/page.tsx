import type { Metadata } from "next";
import NotFoundUI from "@/components/ui/NotFoundUI";

export const metadata: Metadata = {
    title: "404 - Page Not Found | GreenLedger",
    description: "The page or ESG sustainability resource you requested could not be found.",
};

export default function Explicit404Page() {
    return <NotFoundUI />;
}
