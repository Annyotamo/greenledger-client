// app/(tenant)/lwg/onboarding/page.tsx
"use client";

import { LwgOnboardingWizard } from "@/components/lwg/LwgOnboardingWizard";
import { LwgProfileGuard } from "@/components/lwg/LwgProfileGuard";

export default function LwgOnboardingPage() {
    return (
        <LwgProfileGuard mode="onboarding">
            <div className="py-4 animate-fade-up">
                <LwgOnboardingWizard />
            </div>
        </LwgProfileGuard>
    );
}
