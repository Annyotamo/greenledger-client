"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
    const [p, setP] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const scrollable = el.scrollHeight - el.clientHeight;
            setP(scrollable > 0 ? (el.scrollTop / scrollable) * 100 : 0);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    return (
        <div
            className="pointer-events-none fixed left-0 right-0 top-14 z-40 h-[3px] bg-emerald-950/10 sm:top-[3.75rem]"
            aria-hidden
            role="presentation">
            <div
                className="h-full origin-left bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 transition-[transform] duration-150 ease-out"
                style={{ transform: `scaleX(${p / 100})` }}
            />
        </div>
    );
}
