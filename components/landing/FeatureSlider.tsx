"use client";

import Image from "next/image";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { memo, useEffect, useMemo, useState } from "react";

export type SliderCard = {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    bullets: string[];
    accent: string;
    imageSrc?: string;
};

type FeatureSliderProps = {
    cards: SliderCard[];
};

function FeatureSliderInner({ cards }: FeatureSliderProps) {
    const reduceMotion = useReducedMotion();
    const [smallScreen, setSmallScreen] = useState(false);

    useEffect(() => {
        const onResize = () => setSmallScreen(window.innerWidth < 768);
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const extended = useMemo(() => (cards.length > 0 ? [...cards, ...cards] : []), [cards]);

    return (
        <div className="relative z-0 w-screen -ml-7">
            <div className="relative overflow-hidden">
                {smallScreen || reduceMotion ? (
                    <div className="scrollbar-hide isolate flex gap-6 overflow-x-auto overflow-y-clip pl-1 pr-1 [-webkit-overflow-scrolling:touch]">
                        {cards.map((card) => (
                            <article
                                key={card.id}
                                data-slider-card
                                className="relative z-1 flex min-h-[min(52vh,480px)] w-[min(calc(100vw-2.75rem),26rem)] shrink-0 flex-col rounded-[1.35rem] border bg-white/95 p-7 backdrop-blur-md sm:w-[min(calc(100vw-3.5rem),28rem)] sm:min-h-125 sm:p-8 md:w-lg lg:w-136 lg:max-w-xl lg:p-9">
                                {card.imageSrc ? (
                                    <div className="relative -mx-7 -mt-7 mb-6 overflow-hidden rounded-t-[1.35rem] border-b border-emerald-900/10 bg-emerald-950/5 sm:-mx-8 sm:-mt-8 lg:-mx-9 lg:-mt-9">
                                        <div className="relative h-44 w-full sm:h-52">
                                            <Image
                                                src={card.imageSrc}
                                                alt=""
                                                fill
                                                className="object-cover"
                                                sizes="(min-width: 768px) 420px, 85vw"
                                            />
                                        </div>
                                        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-linear-to-b from-black/35 via-black/10 to-transparent sm:h-52" />
                                        <div className="pointer-events-none absolute inset-x-0 top-24 h-24 bg-linear-to-t from-white/90 to-transparent sm:top-28 sm:h-28" />
                                    </div>
                                ) : null}
                                <p
                                    className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.22em]"
                                    style={{ color: card.accent }}>
                                    {card.eyebrow}
                                </p>
                                <h3 className="mb-4 text-balance text-2xl font-bold tracking-tight text-emerald-950 sm:text-[1.65rem] lg:text-3xl">
                                    {card.title}
                                </h3>
                                <p className="mb-5 text-sm leading-relaxed text-slate-700 sm:text-[0.95rem]">
                                    {card.description}
                                </p>
                                <ul className="mt-auto space-y-2.5 border-t border-emerald-900/10 pt-5 text-sm leading-snug text-slate-600">
                                    {card.bullets.map((b) => (
                                        <li key={b} className="flex gap-3">
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>
                ) : (
                    <LazyMotion features={domAnimation} strict>
                        <m.div
                            className="flex w-max gap-6 pl-0.5 pr-1"
                            style={{ willChange: "transform" }}
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ ease: "linear", duration: 48, repeat: Infinity }}>
                            {extended.map((card, i) => {
                                const key = `${card.id}-${i}`;
                                return (
                                    <article
                                        key={key}
                                        data-slider-card
                                        className="relative z-1 flex min-h-[min(52vh,480px)] w-[min(calc(100vw-2.75rem),26rem)] shrink-0 flex-col rounded-[1.35rem] bg-white/95 p-7 sm:w-[min(calc(100vw-3.5rem),28rem)] sm:min-h-125 sm:p-8 md:w-lg lg:w-136 lg:max-w-xl lg:p-9">
                                        {card.imageSrc ? (
                                            <div className="relative -mx-7 -mt-7 mb-6 overflow-hidden rounded-t-[1.35rem] border-b border-emerald-900/10 bg-emerald-950/5 sm:-mx-8 sm:-mt-8 lg:-mx-9 lg:-mt-9">
                                                <div className="relative h-44 w-full sm:h-52">
                                                    <Image
                                                        src={card.imageSrc}
                                                        alt=""
                                                        fill
                                                        className="object-cover"
                                                        sizes="(min-width: 1024px) 520px, 85vw"
                                                    />
                                                </div>
                                                <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-linear-to-b from-black/35 via-black/10 to-transparent sm:h-52" />
                                                <div className="pointer-events-none absolute inset-x-0 top-24 h-24 bg-linear-to-t from-white/90 to-transparent sm:top-28 sm:h-28" />
                                            </div>
                                        ) : null}
                                        <p
                                            className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.22em]"
                                            style={{ color: card.accent }}>
                                            {card.eyebrow}
                                        </p>
                                        <h3 className="mb-4 text-balance text-2xl font-bold tracking-tight text-emerald-950 sm:text-[1.65rem] lg:text-3xl">
                                            {card.title}
                                        </h3>
                                        <p className="mb-5 text-sm leading-relaxed text-slate-700 sm:text-[0.95rem]">
                                            {card.description}
                                        </p>
                                        <ul className="mt-auto space-y-2.5 border-t border-emerald-900/10 pt-5 text-sm leading-snug text-slate-600">
                                            {card.bullets.map((b) => (
                                                <li key={b} className="flex gap-3">
                                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                                                    <span>{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </article>
                                );
                            })}
                        </m.div>
                    </LazyMotion>
                )}
            </div>
        </div>
    );
}

export const FeatureSlider = memo(FeatureSliderInner);
