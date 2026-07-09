"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingLoader() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleLoad = () => {
            // Buffer to allow soft WebGL drawings and initial rendering to stabilize
            setTimeout(() => {
                setIsVisible(false);
            }, 600);
        };

        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.addEventListener("load", handleLoad);
            return () => window.removeEventListener("load", handleLoad);
        }
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white"
                >
                    <div className="relative flex flex-col items-center">
                        {/* Subtle pulsing green glow background */}
                        <div className="absolute -inset-4 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />

                        {/* Minimalist modern loader spinner */}
                        <div className="relative h-12 w-12">
                            <div className="h-full w-full rounded-full border-[3px] border-emerald-100" />
                            <div className="absolute top-0 left-0 h-full w-full rounded-full border-[3px] border-emerald-600 border-t-transparent animate-spin" />
                        </div>

                        {/* Logo Text */}
                        <span className="mt-4 font-sans text-xs font-semibold tracking-[0.2em] text-emerald-800 uppercase animate-pulse">
                            GreenLedger
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
