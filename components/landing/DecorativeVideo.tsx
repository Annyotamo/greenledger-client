"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";

type DecorativeVideoProps = {
    className?: string;
    src: string;
    poster?: string;
    startTime?: number;
};

function useInView(ref: React.RefObject<Element>, rootMargin: string) {
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
            rootMargin,
            threshold: 0.12,
        });
        obs.observe(el);
        return () => obs.disconnect();
    }, [ref, rootMargin]);

    return inView;
}

const DecorativeVideoInner = ({ className, src, poster, startTime = 0 }: DecorativeVideoProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const inView = useInView(videoRef as unknown as React.RefObject<Element>, "0px 0px -15% 0px");

    const reducedMotion = useMemo(() => {
        if (typeof window === "undefined") return true;
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (reducedMotion) return;

        let cancelled = false;
        let idleId: number | null = null;
        const schedule = () => {
            const cb = () => {
                if (cancelled) return;
                if (startTime > 0) {
                    video.currentTime = startTime;
                }
                video.play().catch(() => {});
            };

            // Don’t autoplay immediately on page load; wait until in view + idle.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const ric = (window as any).requestIdleCallback as undefined | ((fn: () => void, opts?: any) => number);
            if (ric) idleId = ric(cb, { timeout: 1200 });
            else idleId = window.setTimeout(cb, 900) as unknown as number;
        };

        if (inView) schedule();
        else video.pause();

        return () => {
            cancelled = true;
            if (idleId) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const cic = (window as any).cancelIdleCallback as undefined | ((id: number) => void);
                if (cic) cic(idleId);
                else window.clearTimeout(idleId);
            }
            video.pause();
        };
    }, [inView, reducedMotion, startTime]);

    return (
        <video
            ref={videoRef}
            className={className}
            src={src}
            poster={poster}
            loop
            muted
            playsInline
            preload="metadata"
            controls={false}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            aria-hidden
        />
    );
};

export default memo(DecorativeVideoInner);
