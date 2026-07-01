import Image from "next/image";
import griLogo from "@/assets/standards/GRI-removebg-preview.png";
import brsrLogo from "@/assets/standards/BRSR_logo.png";
import epaLogo from "@/assets/standards/epa.png";
import ghgLogo from "@/assets/standards/ghg_protocol3-removebg-preview.png";
import ipccLogo from "@/assets/standards/ipcc.png";
import tfcdLogo from "@/assets/standards/tfcd-removebg-preview.png";

export default function FrameworksSection() {
    const frameworks = [
        { name: "GRI", src: griLogo },
        { name: "BRSR", src: brsrLogo },
        { name: "EPA", src: epaLogo },
        { name: "GHG Protocol", src: ghgLogo },
        { name: "IPCC", src: ipccLogo },
        { name: "TCFD", src: tfcdLogo },
    ];

    return (
        <section className="w-full py-16 sm:py-20 md:py-40">
            <div className="mx-auto max-w-5xl px-4 text-center">
                {/* Sleek, minimalist label */}
                <span className="text-emerald-800/80 font-label-md text-[0.7rem] uppercase tracking-[0.25em] block mb-4">
                    Frameworks & Standards We Cover
                </span>

                {/* Modern, premium heading */}
                <h2 className="text-balance text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl lg:text-4xl">
                    Engineered for Leading Frameworks
                </h2>

                {/* Minimalist description */}
                <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-slate-500 sm:text-base">
                    Ensure seamless alignment, continuous validation, and absolute audit readiness across all major climate, greenhouse gas, and sustainability disclosure models.
                </p>

                {/* Sleek, centered logo array */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-10 md:mt-16 md:gap-x-20">
                    {frameworks.map((fw) => (
                        <div
                            key={fw.name}
                            className="flex items-center justify-center transition-all duration-300 hover:scale-[1.04]"
                            title={fw.name}
                        >
                            <Image
                                src={fw.src}
                                alt={`${fw.name} compliance standard`}
                                className="h-30 rounded-md w-auto max-w-[200px] object-contain transition-all duration-300 mix-blend-multiply"
                                priority={false}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
