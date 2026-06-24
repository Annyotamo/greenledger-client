"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { INSIGHTS_ARTICLES } from "@/lib/insightsData";
import { LazyMotion, domAnimation, m } from "framer-motion";

export default function InsightsSection() {
    const article = INSIGHTS_ARTICLES[0];
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    if (!article) return null;

    return (
        <section id="insights" className="scroll-mt-24 mb-20 relative w-full">
            {/* Ambient Background Glow */}
            <div className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl" />
            <div className="absolute right-10 bottom-0 h-72 w-72 rounded-full bg-teal-300/10 blur-3xl" />

            <div className="mb-8 max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-emerald-800 border border-emerald-200/50 mb-3 font-mono">
                    GreenLedger Insights
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                    Latest perspective from our research team
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                    In-depth analysis, sector-specific reports, and expert guidance on ESG reporting, regulatory carbon accounting, and data governance.
                </p>
            </div>

            <LazyMotion features={domAnimation} strict>
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Link
                        href={`/insights/${article.slug}`}
                        className="group block relative w-full"
                    >
                        <div
                            ref={cardRef}
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="relative overflow-hidden rounded-3xl border border-emerald-950/10 bg-white/75 p-5 md:p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:border-emerald-500/20"
                        >
                            {/* Interactive Hover Light Gradient */}
                            {isHovered && (
                                <div
                                    className="pointer-events-none absolute -inset-px transition-opacity duration-300"
                                    style={{
                                        background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.15), rgba(9, 77, 61, 0.03) 60%, transparent 100%)`,
                                    }}
                                />
                            )}

                            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
                                {/* Left Side: Article Banner Image */}
                                <div className="relative aspect-video lg:aspect-auto lg:w-[45%] min-h-[220px] md:min-h-[300px] overflow-hidden rounded-2xl bg-emerald-50 border border-emerald-900/5 shadow-inner">
                                    <Image
                                        src={article.coverImage}
                                        alt={article.title}
                                        fill
                                        sizes="(min-width: 1024px) 45vw, 92vw"
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                                        priority
                                    />
                                    {/* Overlay Gradient on Image */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent" />
                                </div>

                                {/* Right Side: Article Details & Teaser */}
                                <div className="flex flex-col justify-between flex-1 py-1">
                                    <div>
                                        {/* Metadata Header */}
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3 font-medium">
                                            <span className="font-mono text-emerald-800 bg-emerald-50 border border-emerald-200/40 px-2 py-0.5 rounded">
                                                {article.category}
                                            </span>
                                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                                            <span>{article.published}</span>
                                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                                            <span className="flex items-center gap-1 font-mono text-slate-600">
                                                <svg
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="inline"
                                                >
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                                {article.readTime}
                                            </span>
                                        </div>

                                        {/* Headline */}
                                        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-emerald-950 group-hover:text-emerald-800 transition-colors duration-250 leading-tight">
                                            {article.title}
                                        </h3>

                                        {/* Teaser text */}
                                        <p className="mt-3.5 text-sm md:text-base leading-relaxed text-slate-600 font-normal">
                                            {article.excerpt}
                                        </p>
                                    </div>

                                    {/* CTA Footer */}
                                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-emerald-800 flex items-center justify-center text-white text-xs font-bold font-mono">
                                                GL
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-900 leading-none">
                                                    {article.author}
                                                </p>
                                                <p className="text-[10px] text-slate-500 mt-0.5 leading-none">
                                                    Author
                                                </p>
                                            </div>
                                        </div>

                                        <div className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 bg-emerald-50/50 hover:bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-900/5 group-hover:border-emerald-500/20 transition-all">
                                            <span>Read full article</span>
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="transition-transform duration-250 group-hover:translate-x-1"
                                            >
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                                <polyline points="12 5 19 12 12 19" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </m.div>
            </LazyMotion>
        </section>
    );
}
