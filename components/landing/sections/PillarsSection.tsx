import type { SliderCard } from "@/components/landing/FeatureSlider";
import { FeatureSlider } from "@/components/landing/FeatureSlider";

export default function PillarsSection({ cards }: { cards: SliderCard[] }) {
    return (
        <section id="pillars" className="scroll-mt-24">
            <div className="mb-6 max-w-4xl">
                <h2 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                    Four capabilities, one continuous data spine
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                    Explore how ESG reporting, audit ready logging, role based approvals, and energy activity capture
                    work from the same governed dataset so you keep numbers aligned across teams.
                </p>
            </div>
            <FeatureSlider cards={cards} />
        </section>
    );
}
