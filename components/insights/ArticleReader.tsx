"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Article } from "@/lib/insightsData";

interface ArticleReaderProps {
    article: Article;
}

export default function ArticleReader({ article }: ArticleReaderProps) {
    const [activeId, setActiveId] = useState<string>("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const sections = article.sections;
        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -60% 0px",
            threshold: 0,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach((sec) => {
            const el = document.getElementById(sec.id);
            if (el) observer.observe(el);
        });

        return () => {
            sections.forEach((sec) => {
                const el = document.getElementById(sec.id);
                if (el) observer.unobserve(el);
            });
        };
    }, [article.sections]);

    const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // navbar / offset spacing
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });

            setActiveId(id);
            // Update hash in URL quietly without jump
            window.history.pushState(null, "", `#${id}`);
        }
    };

    const copyLinkToClipboard = () => {
        if (typeof window === "undefined") return;
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full">
            {/* Top Navigation / Breadcrumbs */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-900 group transition-colors"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform group-hover:-translate-x-0.5"
                    >
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    <span>Back to landing page</span>
                </Link>

                <div className="flex items-center gap-3">
                    <button
                        onClick={copyLinkToClipboard}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition text-slate-600 cursor-pointer"
                    >
                        {copied ? (
                            <>
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    className="text-emerald-600 animate-pulse"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span className="text-emerald-600 font-mono">Copied!</span>
                            </>
                        ) : (
                            <>
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                </svg>
                                <span>Copy share link</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
                
                {/* Left Side: Article Body (8 cols on desktop) */}
                <article className="col-span-12 lg:col-span-8 min-w-0">
                    
                    {/* Cover Banner */}
                    <div className="w-full overflow-hidden rounded-3xl border border-slate-100 shadow-md bg-emerald-50 mb-10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-auto block object-contain"
                        />
                    </div>

                    {/* Content Section Loop */}
                    <div className="space-y-12">
                        {article.sections.map((section) => (
                            <section
                                key={section.id}
                                id={section.id}
                                className="scroll-mt-28 border-b border-slate-100 pb-10 last:border-0 last:pb-0"
                            >
                                {/* Section Header */}
                                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-emerald-950 mb-6 flex items-start gap-3">
                                    <span className="h-7 w-1 rounded-full bg-emerald-600 shrink-0 mt-0.5" />
                                    <span>{section.heading}</span>
                                </h2>

                                {/* Blocks Loop */}
                                <div className="space-y-5">
                                    {section.blocks.map((block, idx) => {
                                        switch (block.type) {
                                            case "paragraph":
                                                return (
                                                    <p
                                                        key={idx}
                                                        className="text-base md:text-[1.05rem] leading-relaxed text-slate-800 font-normal"
                                                    >
                                                        {block.text}
                                                    </p>
                                                );

                                            case "bullets":
                                                return (
                                                    <ul key={idx} className="space-y-3.5 my-5 pl-1">
                                                        {block.items?.map((bullet, bulletIdx) => (
                                                            <li
                                                                key={bulletIdx}
                                                                className="flex items-start gap-3 text-base text-slate-700"
                                                            >
                                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/50 mt-0.5">
                                                                    <svg
                                                                        width="12"
                                                                        height="12"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth="3.5"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    >
                                                                        <polyline points="20 6 9 17 4 12" />
                                                                    </svg>
                                                                </span>
                                                                <span className="leading-snug">{bullet}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                );

                                            case "quote":
                                                return (
                                                    <blockquote
                                                        key={idx}
                                                        className="border-l-4 border-emerald-600 bg-emerald-50/30 px-5 py-4 my-6 rounded-r-2xl italic text-base md:text-lg text-emerald-950 font-medium leading-relaxed"
                                                    >
                                                        “{block.text}”
                                                    </blockquote>
                                                );

                                            case "callout":
                                                return (
                                                    <div
                                                        key={idx}
                                                        className="border border-emerald-200/50 bg-emerald-50/20 p-5 my-6 rounded-2xl"
                                                    >
                                                        {block.title && (
                                                            <div className="flex items-center gap-2 mb-2 text-xs font-bold font-mono tracking-wider text-emerald-900 uppercase">
                                                                <svg
                                                                    width="14"
                                                                    height="14"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2.5"
                                                                >
                                                                    <circle cx="12" cy="12" r="10" />
                                                                    <line x1="12" y1="16" x2="12" y2="12" />
                                                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                                                </svg>
                                                                <span>{block.title}</span>
                                                            </div>
                                                        )}
                                                        <p className="text-base text-emerald-950 leading-relaxed font-semibold">
                                                            {block.text}
                                                        </p>
                                                    </div>
                                                );

                                            case "image":
                                                return (
                                                    <figure key={idx} className="my-8">
                                                        <div className="w-full overflow-hidden rounded-2xl border border-slate-100 shadow-md bg-slate-50">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={block.src || ""}
                                                                alt={block.caption || "Illustration"}
                                                                className="w-full h-auto block object-contain"
                                                            />
                                                        </div>
                                                        {block.caption && (
                                                            <figcaption className="text-xs font-semibold text-slate-500 font-mono mt-2.5 text-center leading-normal">
                                                                {block.caption}
                                                            </figcaption>
                                                        )}
                                                    </figure>
                                                );

                                            default:
                                                return null;
                                        }
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                </article>

                {/* Right Side: Sticky Table of Contents Navigation (4 cols on desktop) */}
                <aside className="hidden lg:block lg:col-span-4 sticky top-28 self-start">
                    <div className="rounded-2xl border border-slate-100 bg-white/70 p-5 shadow-sm backdrop-blur-md">
                        <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase mb-4">
                            On This Page
                        </h3>
                        <nav className="space-y-1 max-h-[60vh] overflow-y-auto scrollbar-thin pr-1">
                            {article.sections.map((section) => {
                                const active = activeId === section.id;
                                return (
                                    <a
                                        key={section.id}
                                        href={`#${section.id}`}
                                        onClick={(e) => handleTocClick(e, section.id)}
                                        className={`block text-[13px] leading-snug py-2 px-3 rounded-lg border-l-2 transition-all font-medium ${
                                            active
                                                ? "border-emerald-600 bg-emerald-50/50 text-emerald-950 pl-4 font-semibold"
                                                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 pl-3"
                                        }`}
                                    >
                                        {section.heading}
                                    </a>
                                );
                            })}
                        </nav>

                        {/* CTA card in sidebar */}
                        <div className="mt-6 pt-5 border-t border-slate-100">
                            <div className="rounded-xl bg-linear-to-br from-emerald-900 to-emerald-950 p-4 text-white shadow-md relative overflow-hidden">
                                <div className="absolute right-0 bottom-0 translate-y-3 translate-x-3 opacity-10">
                                    <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />
                                    </svg>
                                </div>
                                <h4 className="text-sm font-bold tracking-tight">Need defensible data?</h4>
                                <p className="text-xs text-emerald-100/90 mt-1 leading-normal">
                                    See how GreenLedger handles compliance-grade ESG reporting.
                                </p>
                                <Link
                                    href="/#cta"
                                    className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-white py-2 text-center text-xs font-bold text-emerald-900 hover:bg-emerald-50 transition"
                                >
                                    Book a free demo
                                </Link>
                            </div>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
}
