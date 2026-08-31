"use client";

import React from "react";

interface CardItem {
    id: string;
    num: string;
    text: string;
}

const CARDS: CardItem[] = [
    {
        id: "chem-prec",
        num: "01",
        text: "Lab-Grade Chemical Precision",
    },
    {
        id: "scope-depth",
        num: "02",
        text: "Full-Spectrum Scope 1, 2, and 3 Depth",
    },
    {
        id: "brsr-intel",
        num: "03",
        text: "BRSR Principle 6 Resource Intelligence",
    },
    {
        id: "audit-gov",
        num: "04",
        text: "Enterprise Audit Governance & Data Control",
    },
];

export default function HeroVerticalCarousel() {
    return (
        <div className="relative flex h-full w-full flex-col justify-between select-none">
            {/* Vertical dotted line running through the center connecting all cards */}
            <div
                className="absolute left-1/2 top-3 bottom-3 -translate-x-1/2 w-0 border-2 border-dotted border-emerald-400/30 pointer-events-none z-0"
                aria-hidden
            />

            {CARDS.map((card) => (
                <div
                    key={card.id}
                    className="group relative z-10 flex h-[58px] w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-emerald-950/20 px-3.5 backdrop-blur-[2px] shadow-[0_2px_12px_rgba(0,0,0,0.15)] transition-all duration-200 hover:border-emerald-400/35 hover:bg-emerald-950/35"
                >
                    <span className="shrink-0 font-[var(--font-jetbrains),monospace] text-[11px] font-extrabold text-emerald-400/70 tracking-widest">
                        {card.num}
                    </span>
                    <div className="h-3.5 w-px bg-white/10 shrink-0" aria-hidden />
                    <span className="font-[var(--font-jetbrains),monospace] text-[12px] leading-tight text-white/85 font-bold tracking-wide ">
                        {card.text}
                    </span>
                </div>
            ))}
        </div>
    );
}
