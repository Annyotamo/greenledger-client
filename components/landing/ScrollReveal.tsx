"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type ScrollRevealProps = {
    children: ReactNode;
    className?: string;
    /** Extra delay after intersect (ms) */
    delay?: number;
    /** Root margin for IntersectionObserver */
    rootMargin?: string;
    /** 0–1, fraction of element visible to trigger */
    threshold?: number;
    /** If true, reveal only once. If false, replays on re-enter. */
    once?: boolean;
};

export function ScrollReveal({
    children,
    className = "",
    delay = 0,
    rootMargin = "0px 0px -8% 0px",
    threshold = 0.12,
    once = false,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mq.matches) {
            setVisible(true);
            return;
        }

        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    if (once) obs.unobserve(el);
                } else if (!once) {
                    setVisible(false);
                }
            },
            { threshold, rootMargin }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold, rootMargin, once]);

    return (
        <div
            ref={ref}
            className={[
                "motion-safe:transition-[opacity,transform] motion-safe:duration-850 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
                visible
                    ? "motion-safe:translate-y-0 motion-safe:opacity-100"
                    : "motion-safe:translate-y-9 motion-safe:opacity-0",
                "motion-reduce:translate-y-0 motion-reduce:opacity-100",
                className,
            ].join(" ")}
            style={visible && delay > 0 ? { transitionDelay: `${delay}ms` } : { transitionDelay: "0ms" }}>
            {children}
        </div>
    );
}

export function useParallaxScroll(factor = 0.06) {
    const [y, setY] = useState(0);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mq.matches) return;

        let raf = 0;
        const tick = () => setY(window.scrollY * factor);
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(tick);
        };
        tick();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("scroll", onScroll);
        };
    }, [factor]);

    return y;
}
