"use client";

import React, { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { motion, AnimatePresence } from "framer-motion";

const features = [
    {
        title: "Accelerate ESG Reporting",
        short: "Automates data collection, calculations, and report assembly so reporting finishes in days, not months.",
        long: "Think of ESG reporting like filing your company's 'green report card'. GreenLedger automatically collects activity data, performs emissions calculations using approved methodologies, and assembles disclosure-ready reports. What traditionally takes weeks of spreadsheets and manual verification can be completed in a fraction of the time with greater accuracy and consistency.",
        icon: "analytics",
        badge: "Report automation",
    },
    {
        title: "Assurance-Ready by Design",
        short: "Immutable logs and evidence first workflows make audits fast and low-friction.",
        long: "Every activity is backed by a complete audit trail. From data entry and document uploads to approvals and emissions calculations, every action is securely recorded with timestamps and user attribution. This creates transparent, verifiable records that simplify third-party assurance and significantly reduce audit preparation time.",
        icon: "verified",
        badge: "Audit confidence",
    },
    {
        title: "Regulatory-Ready Reporting",
        short: "Built-in rulebooks so reports follow accepted standards automatically.",
        long: "Generate reports that align with globally recognised ESG frameworks and Indian regulatory requirements without manually interpreting complex guidelines. Built-in reporting logic helps ensure disclosures remain accurate, consistent, and ready for evolving compliance expectations.",
        icon: "gavel",
        badge: "Standards aligned",
    },
    {
        title: "Built for Indian Industry",
        short: "Uses India-specific factors, workflows, and compliance paths tailored to local sectors.",
        long: "Purpose-built for Indian businesses, GreenLedger incorporates India-specific emission factors, regulatory requirements, and industry workflows. Whether you're in manufacturing, infrastructure, logistics, or services, the platform adapts to local reporting practices instead of forcing generic global templates.",
        icon: "public",
        badge: "Local intelligence",
    },
];

export default function AuroraCarousel() {
    const [index, setIndex] = useState(0);

    // Auto-advance slides. The timer restarts whenever 'index' updates,
    // which ensures that clicking a tab grants a full 6s viewing window.
    useEffect(() => {
        const id = setInterval(() => {
            setIndex((prev) => (prev + 1) % features.length);
        }, 6000);
        return () => clearInterval(id);
    }, [index]);

    return (
        <div className="w-full max-w-5xl mx-auto py-12 md:py-28 px-4 sm:px-6 mt-10">
            <h1 className="text-balance text-center text-3xl font-extrabold leading-[1.08] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.35)] sm:text-4xl lg:text-5xl mb-16">
                Our Value Propositions
                <span className="text-emerald-400 block text-xs mt-3 font-label-md text-label-md uppercase tracking-[0.2em]">
                    Your production grade esg software
                </span>
            </h1>

            {/* Embedded style tag for high-performance CSS animation of the progress bars */}
            <style>{`
                @keyframes carousel-progress {
                    0% { transform: scaleX(0); }
                    100% { transform: scaleX(1); }
                }
            `}</style>

            <div className="relative z-20 w-full pointer-events-auto">
                {/* Active Slide Display with Framer Motion transitions */}
                <div className="relative flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full text-center"
                        >


                            <div className="flex flex-row justify-center items-center gap-3 mt-10">
                                {/* Flat glowing icon container */}
                            <div className="flex justify-center mb-6">
                                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/5 text-emerald-400 backdrop-blur-xs">
                                    <MaterialIcon name={features[index].icon} size="lg" className="!text-3xl" />
                                </div>
                            </div>

                            {/* Premium display title */}
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-6 [text-shadow:0_2px_12px_rgba(0,0,0,0.2)]">
                                {features[index].title}
                            </h2>
                            </div>

                            {/* Clean, lightweight description */}
                            <p className="text-base sm:text-md text-emerald-100/90 leading-relaxed max-w-3xl mx-auto font-light [text-shadow:0_1px_4px_rgba(0,0,0,0.15)]">
                                {features[index].long}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Minimalist interactive progress tabs */}
                <div className="mt-20 flex flex-col sm:flex-row justify-center gap-6 sm:gap-4 md:gap-28 max-w-screen mx-auto">
                    {features.map((feature, i) => {
                        const isActive = index === i;
                        return (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                className="group relative pb-4 text-left focus:outline-hidden cursor-pointer flex-1"
                            >
                                {/* Slide step count */}
                                <span className={`text-[10px] font-mono tracking-widest block mb-1.5 transition-colors duration-300 ${
                                    isActive ? "text-emerald-400 font-bold" : "text-white/40"
                                }`}>
                                    0{i + 1}
                                </span>

                                {/* Tab text */}
                                <span className={`font-semibold tracking-wide block transition-colors duration-300 ${
                                    isActive ? "text-white" : "text-white/50 group-hover:text-white/80"
                                }`}>
                                    {feature.badge}
                                </span>

                                {/* Bottom progress tracker base line */}
                                <div className="absolute bottom-0 left-0 w-full h-[4px] bg-white/10" />

                                {/* Running progress overlay */}
                                {isActive && (
                                    <div
                                        className="absolute bottom-0 left-0 w-full h-[4px] bg-emerald-400 origin-left"
                                        style={{
                                            animation: `carousel-progress 6000ms linear forwards`,
                                        }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
