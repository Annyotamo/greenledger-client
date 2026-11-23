import type { Metadata } from "next";
import { Scope3CategoryView } from "@/components/scope3/Scope3CategoryView";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";
import type { FeatureKey } from "@/lib/rbac/types";

export const metadata: Metadata = {
    title: "Scope 3 Category Details | GreenLedger ESG",
    description: "GHG Protocol Scope 3 category details and activity breakdown.",
};

const SLUG_FEATURE_MAP: Record<string, FeatureKey> = {
    "category-1": "scope_3_cat1",
    "category-2": "scope_3_cat2",
    "category-3": "scope_3_cat3",
    "category-4": "scope_3_cat4",
    "category-5": "scope_3_cat5",
    "category-6": "scope_3_cat6",
    "category-7": "scope_3_cat7",
    "category-9": "scope_3_cat9",
    "category-15": "scope_3_cat15",
};

export default async function Scope3CategoryPage({
    params,
}: {
    params: Promise<{ categorySlug: string }>;
}) {
    const resolvedParams = await params;
    const slug = resolvedParams.categorySlug;
    const feature = SLUG_FEATURE_MAP[slug] || "scope_3_cat1";

    return (
        <ProtectedRoute feature={feature} requiredLevel="read" featureTitle={`Scope 3 ${slug}`}>
            <Scope3CategoryView slug={slug} />
        </ProtectedRoute>
    );
}
