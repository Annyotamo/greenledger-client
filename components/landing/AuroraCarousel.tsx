"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import esgReportingImg from "@/assets/landing-images/esg-reporting.jpg";
import opsImg from "@/assets/landing-images/746569-848x441.jpg";
import heroMosaic from "@/assets/landing-images/esg_main.960_0_1.jpg";
import sustainableFinanceImg from "@/assets/landing-images/ESG-Courses-Sustainable-Finance-1600x900-1.jpg";

const features = [
    {
        title: "Accelerate ESG Reporting",
        short: "Automates data collection, calculations, and report assembly so reporting finishes in days, not months.",
        long: "Think of ESG reporting like filing your company's 'green report card' this feature gathers the numbers, crunches them, and produces standards aligned outputs with minimal manual work.",
        imageSrc: esgReportingImg,
        icon: "analytics",
        badge: "Report automation",
    },
    {
        title: "Assurance-Ready by Design",
        short: "Immutable logs and evidence first workflows make audits fast and low-friction.",
        long: "Every step is recorded who entered data, when, and how calculations were performed so third party assurance is quick and traceable.",
        imageSrc: opsImg,
        icon: "verified",
        badge: "Audit confidence",
    },
    {
        title: "Regulatory-Ready Reporting",
        short: "Built-in rulebooks so reports follow accepted standards automatically.",
        long: "Reports are constructed following global and local standards so you can be confident outputs meet regulatory expectations without manual rule-mapping.",
        imageSrc: heroMosaic,
        icon: "gavel",
        badge: "Standards aligned",
    },
    {
        title: "Built for Indian Industry",
        short: "Uses India-specific factors, workflows, and compliance paths tailored to local sectors.",
        long: "Customised to Indian businesses local emission factors, compliance requirements and sector workflows are built in so the product feels native to the market.",
        imageSrc: sustainableFinanceImg,
        icon: "public",
        badge: "Local intelligence",
    },
];

export default function AuroraCarousel() {
    const totalSlides = features.length + 1; // 0 = overview + each feature
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setIndex((i) => (i + 1) % totalSlides), 5000);
        return () => clearInterval(id);
    }, [totalSlides]);

    return (
        <div className="w-full mt-20">
            <h1 className="text-balance text-3xl font-extrabold leading-[1.08] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.35)] sm:text-4xl lg:text-6xl mb-42 mx-auto w-screen ">
                Our Value Propositions
                <span className="text-green-200 block text-xl ml-2 mt-4 font-label-md text-label-md uppercase">
                    Your production grade esg software
                </span>
            </h1>

            <div className="w-full flex items-center justify-center pointer-events-auto">
                <div className="relative w-full px-0 lg:px-2">
                    {Array.from({ length: totalSlides }).map((_, s) => {
                        const active = s === index;
                        return (
                            <div
                                key={s}
                                aria-hidden={!active}
                                className={`h-[350px] flex items-center justify-center transition-all duration-700 ease-in-out transform ${
                                    active
                                        ? "relative opacity-100 translate-y-0"
                                        : "absolute inset-0 opacity-0 -translate-y-8 pointer-events-none"
                                }`}>
                                {s === 0 ? (
                                    <div className="grid gap-5 px-4 pb-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 xl:gap-7">
                                        {features.map((feature, index) => (
                                            <article
                                                key={index}
                                                className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-slate-950/50 shadow-[0_32px_90px_rgba(0,0,0,0.35)] transition duration-500 hover:-translate-y-1"
                                                style={{ backdropFilter: "blur(20px)" }}>
                                                <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top_left,rgba(6,182,147,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.11),transparent_35%)]" />
                                                <div className="relative overflow-hidden">
                                                    <div className="relative h-42 w-full overflow-hidden">
                                                        <Image
                                                            src={feature.imageSrc}
                                                            alt={feature.title}
                                                            fill
                                                            className="object-cover transition duration-700 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/30 to-transparent" />
                                                        <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl absolute left-6 bottom-6">
                                                            {feature.title}
                                                        </h3>
                                                    </div>
                                                </div>

                                                <div className="relative flex flex-1 flex-col justify-between gap-4 p-6 sm:p-7">
                                                    <p className="mt-2 text-sm leading-7 text-emerald-100/90 sm:text-base">
                                                        {feature.short}
                                                    </p>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="w-full flex items-center justify-center px-4">
                                        <div
                                            className="w-full max-w-2xl bg-linear-to-t from-slate-950/30 via-slate-950/10 to-transparent backdrop-blur-sm border border-white/10 rounded-xl p-6 text-emerald-50 shadow-[0_18px_60px_rgba(2,6,23,0.6)] sm:p-8"
                                            style={{ backdropFilter: "blur(20px)" }}>
                                            <h3 className="text-2xl font-bold text-white sm:text-3xl">
                                                {features[s - 1].title}
                                            </h3>
                                            <p className="mt-10 text-md leading-relaxed text-emerald-100">
                                                {features[s - 1].long}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {Array.from({ length: totalSlides }).map((_, d) => (
                            <button
                                key={d}
                                onClick={() => setIndex(d)}
                                aria-label={`Go to slide ${d + 1}`}
                                className={`w-2 h-2 rounded-full transition-all ${index === d ? "bg-white" : "bg-white/30"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
