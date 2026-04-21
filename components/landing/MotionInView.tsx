"use client";

import { memo, useMemo } from "react";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";

type MotionInViewProps = {
    children: React.ReactNode;
    className?: string;
    delayMs?: number;
    y?: number;
};

const MotionInViewInner = ({ children, className, delayMs = 0, y = 18 }: MotionInViewProps) => {
    const variants = useMemo<Variants>(
        () => ({
            hidden: { opacity: 0, y },
            visible: {
                opacity: 1,
                y: 0,
                transition: {
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                    delay: delayMs / 1000,
                },
            },
        }),
        [delayMs, y],
    );

    return (
        <LazyMotion features={domAnimation} strict>
            <m.div
                className={className}
                style={{ willChange: "transform, opacity" }}
                variants={variants}
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.15, margin: "0px 0px -12% 0px", once: true }}>
                {children}
            </m.div>
        </LazyMotion>
    );
};

export default memo(MotionInViewInner);
