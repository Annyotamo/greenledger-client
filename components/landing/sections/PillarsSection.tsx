import type { SliderCard } from "@/components/landing/FeatureSlider";
import { FeatureSlider } from "@/components/landing/FeatureSlider";

export default function PillarsSection({ cards }: { cards: SliderCard[] }) {
    return (
        <section id="pillars" className="scroll-mt-24">
            <div className="mb-6 max-w-4xl">
                <h2 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                    Three capabilities, one continuous data spine
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                    Slide through how reporting, carbon accounting, and traceability reinforce each other. The same
                    suppliers, sites, and products feed every surface so you are never reconciling three different
                    “versions of the truth.”
                </p>
            </div>
            <FeatureSlider cards={cards} />
        </section>
    );
}

