import type { Metadata } from "next";
import { Scope3CategoryView } from "@/components/scope3/Scope3CategoryView";

export const metadata: Metadata = {
    title: "Scope 3 Category Details | GreenLedger ESG",
    description: "GHG Protocol Scope 3 category details and activity breakdown.",
};

export default async function Scope3CategoryPage({
    params,
}: {
    params: Promise<{ categorySlug: string }>;
}) {
    const resolvedParams = await params;
    return <Scope3CategoryView slug={resolvedParams.categorySlug} />;
}
