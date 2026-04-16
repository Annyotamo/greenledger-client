"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, type SyntheticEvent } from "react";

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

export function FeatureSlider({ cards }: FeatureSliderProps) {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const loopWidthRef = useRef(0);
    const rafRef = useRef(0);
    const lastTsRef = useRef(0);

    const extended = cards.length > 0 ? [...cards, ...cards] : [];

    const measureLoop = useCallback(() => {
        const el = scrollerRef.current;
        if (!el || cards.length === 0) return;
        loopWidthRef.current = el.scrollWidth / 2;
    }, [cards.length]);

    useLayoutEffect(() => {
        measureLoop();
        const ro = new ResizeObserver(() => measureLoop());
        if (scrollerRef.current) ro.observe(scrollerRef.current);
        window.addEventListener("resize", measureLoop);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", measureLoop);
        };
    }, [measureLoop, extended.length]);

    useEffect(() => {
        const el = scrollerRef.current;
        if (!el || cards.length === 0) return;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (reduced.matches) return;

        // scroll-behavior: smooth (e.g. Tailwind scroll-smooth) breaks tiny programmatic
        // scrollLeft updates in a rAF loop force instant scrolling for the marquee.
        el.style.scrollBehavior = "auto";

        const pxPerMs = 0.05;

        const tick = (now: number) => {
            if (!lastTsRef.current) lastTsRef.current = now;
            const dt = Math.min(48, now - lastTsRef.current);
            lastTsRef.current = now;

            let loopW = loopWidthRef.current;
            if (loopW <= 0) {
                measureLoop();
                loopW = loopWidthRef.current;
            }
            const max = el.scrollWidth - el.clientWidth;
            if (max <= 1) {
                rafRef.current = requestAnimationFrame(tick);
                return;
            }

            el.scrollLeft += pxPerMs * dt;

            if (loopW > 1 && el.scrollLeft >= loopW - 0.5) {
                el.scrollLeft -= loopW;
            }
            if (el.scrollLeft > max) {
                el.scrollLeft = max;
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(rafRef.current);
            lastTsRef.current = 0;
        };
    }, [cards.length, measureLoop]);

    const scrollByDir = useCallback((dir: -1 | 1) => {
        const el = scrollerRef.current;
        if (!el) return;
        const card = el.querySelector<HTMLElement>("[data-slider-card]");
        const styles = getComputedStyle(el);
        const gap = parseFloat(styles.columnGap || styles.gap || "24") || 24;
        const width = (card?.offsetWidth ?? el.clientWidth * 0.88) + gap;
        el.scrollBy({ left: dir * width, behavior: "smooth" });
    }, []);

    const stop = (e: SyntheticEvent) => {
        e.stopPropagation();
    };

    return (
        <div className="relative z-0 w-full overflow-visible py-2">
            <div className="mb-5 flex justify-end gap-2 pr-0.5">
                <button
                    type="button"
                    onMouseDown={stop}
                    onClick={(e) => {
                        stop(e);
                        scrollByDir(-1);
                    }}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-800/20 bg-white/95 text-emerald-900 shadow-sm transition hover:border-emerald-600/40 hover:bg-emerald-50"
                    aria-label="Previous cards">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden>
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <button
                    type="button"
                    onMouseDown={stop}
                    onClick={(e) => {
                        stop(e);
                        scrollByDir(1);
                    }}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-800/20 bg-white/95 text-emerald-900 shadow-sm transition hover:border-emerald-600/40 hover:bg-emerald-50"
                    aria-label="Next cards">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden>
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>
            <div
                ref={scrollerRef}
                className="scrollbar-hide isolate flex gap-6 overflow-x-auto overflow-y-clip pb-6 pl-0.5 pr-1 pt-10 [-webkit-overflow-scrolling:touch]"
                style={{ scrollPaddingInline: "0.75rem", scrollBehavior: "auto" }}>
                {extended.map((card, i) => {
                    const key = `${card.id}-${i}`;

                    return (
                        <article
                            key={key}
                            data-slider-card
                            className="relative z-1 flex min-h-[min(52vh,480px)] w-[min(calc(100vw-2.75rem),26rem)] shrink-0 flex-col rounded-[1.35rem] border border-white/75 bg-white/95 p-7 shadow-[0_20px_50px_-24px_rgba(15,80,40,0.35)] backdrop-blur-md sm:w-[min(calc(100vw-3.5rem),28rem)] sm:min-h-[500px] sm:p-8 md:w-lg lg:w-136 lg:max-w-xl lg:p-9">
                            {card.imageSrc ? (
                                <div className="relative -mx-7 -mt-7 mb-6 overflow-hidden rounded-t-[1.35rem] border-b border-emerald-900/10 bg-emerald-950/5 sm:-mx-8 sm:-mt-8 lg:-mx-9 lg:-mt-9">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={card.imageSrc}
                                        alt=""
                                        className="block h-44 w-full object-cover sm:h-52"
                                        loading="lazy"
                                    />
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
            </div>
        </div>
    );
}
