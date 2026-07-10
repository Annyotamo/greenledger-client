"use client";

import Image, { type StaticImageData } from "next/image";
import { m } from "framer-motion";
import griLogo from "@/assets/standards/GRI-removebg-preview.png";
import brsrLogo from "@/assets/standards/BRSR_logo.png";
import epaLogo from "@/assets/standards/epa.png";
import ghgLogo from "@/assets/standards/ghg_protocol3-removebg-preview.png";
import ipccLogo from "@/assets/standards/ipcc.png";
import tfcdLogo from "@/assets/standards/tfcd-removebg-preview.png";

interface Framework {
    name: string;
    src: StaticImageData;
}

const frameworks: Framework[] = [
    { name: "GRI", src: griLogo },
    { name: "BRSR", src: brsrLogo },
    { name: "EPA", src: epaLogo },
    { name: "GHG Protocol", src: ghgLogo },
    { name: "IPCC", src: ipccLogo },
    { name: "TCFD", src: tfcdLogo },
];

/** Shared spring for staggered header reveals */
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 },
    }),
};

function LogoItem({ fw }: { fw: Framework }) {
    return (
        <div className="flex-shrink-0 flex items-center justify-center px-10 sm:px-14">
            <Image
                src={fw.src}
                alt={`${fw.name} compliance standard`}
                className="h-20 sm:h-30 w-auto max-w-[180px] object-contain mix-blend-multiply select-none"
                draggable={false}
                priority={false}
            />
        </div>
    );
}

export default function FrameworksSection() {
    // Duplicate the array so we have two identical runs for seamless looping
    const doubled = [...frameworks, ...frameworks];

    return (
        <section className="w-full py-20 sm:py-40 overflow-hidden">
            {/* Header with scroll-triggered stagger animation */}
            <div className="mx-auto max-w-5xl px-4 text-center mb-14 md:mb-18">
                <m.span
                    className="text-emerald-800/80 font-label-md text-[0.7rem] uppercase tracking-[0.25em] block mb-4"
                    custom={0}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    Frameworks &amp; Standards We Cover
                </m.span>

                <m.h2
                    className="text-balance text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl lg:text-4xl"
                    custom={1}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    Engineered for Leading Frameworks
                </m.h2>

                <m.p
                    className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-slate-500 sm:text-base"
                    custom={2}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    Stay informed with guidance inspired by leading climate, greenhouse gas, and sustainability disclosure frameworks.
                </m.p>
            </div>

            {/* Infinite horizontal marquee with edge fade */}
            <div
                className="relative w-full"
                style={{
                    maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                }}
            >
                <div className="frameworks-marquee-track inline-flex min-w-max items-center">
                    {doubled.map((fw, i) => (
                        <LogoItem key={`${fw.name}-${i}`} fw={fw} />
                    ))}
                </div>
            </div>
        </section>
    );
}
