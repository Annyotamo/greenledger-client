import Image from "next/image";

import startupIndia from "@/assets/startupIndia.png";
import IMKKolkata from "@/assets/IMIKolkata.jpg";
import entrepreneurCafe from "@/assets/entrepreneurCafe.jpg";
import isoCertifaction from "@/assets/isoCertifaction.png";
import greenLedgerLogo from "@/assets/GLLogo.png";
import esgAccountingImg from "@/assets/landing-images/14841_esgaccounting_572996_crop.jpg";
import esgReportingImg from "@/assets/landing-images/esg-reporting.jpg";
import sustainableFinanceImg from "@/assets/landing-images/ESG-Courses-Sustainable-Finance-1600x900-1.jpg";
import sasbImg from "@/assets/landing-images/Navigating-SASB.webp";
import sepcKolkata from "@/assets/sepc.png";

export default function HeroSection() {
    return (
        <section className="full-bleed relative min-h-[min(90vh,820px)] overflow-hidden rounded-none shadow-[0_24px_80px_-30px_rgba(0,40,25,0.55)]">
            <Image src="/GreenLedger_Background.jpg" alt="" fill priority className="object-cover object-center" />
            <div
                className="absolute inset-0 bg-linear-to-br from-emerald-950/92 via-emerald-900/78 to-teal-950/88"
                aria-hidden
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/15 to-emerald-950/35" aria-hidden />
            <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_110%_70%_at_50%_-10%,rgba(255,255,255,0.16),transparent_52%)]"
                aria-hidden
            />
            <div className="gl-grain" aria-hidden />

            <div className="relative z-10 mx-auto flex w-full max-w-none flex-col gap-10 px-4 py-14 sm:px-5 md:flex-row md:items-center md:justify-between md:px-6 md:py-16 lg:px-12 lg:py-20">
                <div className="min-w-0 flex-1">
                    <h1 className="text-balance text-3xl font-extrabold leading-[1.08] tracking-tight text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.35)] sm:text-4xl lg:text-5xl xl:text-6xl">
                        GHG accounting and ESG reporting built for Indian businesses
                    </h1>
                    <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-emerald-50/95 sm:text-lg">
                        GreenLedger helps organizations collect environmental and social data, auto-generate standards
                        aligned reports (BRSR), run rigorous carbon accounting across Scopes 1 to 3, and prove product
                        stories with supply chain traceability from factory floor to QR code in a shopper’s hand.
                    </p>
                    <div className="mt-9 flex flex-wrap gap-3">
                        <a
                            href="#pillars"
                            className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-black/20 transition hover:bg-emerald-300">
                            Explore the platform
                        </a>
                        <a
                            href="#deep-dive"
                            className="rounded-xl border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur-md transition hover:bg-white/20">
                            Read how it works
                        </a>
                    </div>
                    <div className="mt-7 flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center gap-3 rounded-2xl border border-white/25 bg-white/10 px-4 py-2 shadow-sm backdrop-blur-md transition hover:bg-white/15">
                            <span className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-emerald-50/85">
                                Supported by
                            </span>
                            <span className="h-5 w-px bg-white/20" aria-hidden />
                            <a href="https://www.startupindia.gov.in/" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={startupIndia}
                                    alt="Startup India"
                                    className="h-7 w-auto object-contain opacity-95"
                                />
                            </a>
                            <span className="h-5 w-px bg-white/20" aria-hidden />
                            <a href="https://www.entrepreneurcafe.org/" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={entrepreneurCafe}
                                    alt="Entrepreneur Cafe"
                                    className="h-7 w-auto object-contain opacity-95"
                                />
                            </a>
                            <span className="h-5 w-px bg-white/20" aria-hidden />
                            <a href="https://imik.edu.in" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={IMKKolkata}
                                    alt="IMI Kolkata"
                                    className="h-7 w-auto object-contain opacity-95"
                                />
                            </a>
                        </div>
                        <div className="inline-flex items-center gap-3 rounded-2xl border border-white/25 bg-white/10 px-4 py-2 shadow-sm backdrop-blur-md h-12">
                            <span className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-emerald-50/85">
                                Certifications
                            </span>
                            <span className="h-5 w-px bg-white/20" aria-hidden />
                            <a href="https://www.servicesepc.org/" target="_blank" rel="noopener noreferrer">
                                <Image src={sepcKolkata} alt="SEPC" className="h-7 w-auto object-contain opacity-95" />
                            </a>
                            <span className="h-5 w-px bg-white/20" aria-hidden />
                            <a href="https://www.iso.org/standard/27001" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={isoCertifaction}
                                    alt="ISO 27001 certification"
                                    className="h-7 w-auto object-contain opacity-95"
                                />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 flex-col items-center gap-5 md:items-end">
                    <div className="rounded-3xl border border-white/40 bg-white/60 shadow-2xl shadow-black/30 ring-1 ring-white/60 backdrop-blur-sm gl-shimmer-border">
                        <Image
                            src={greenLedgerLogo}
                            alt="GreenLedger"
                            width={220}
                            height={220}
                            className="h-auto w-[min(100%,200px)] object-contain sm:w-[220px]"
                            priority
                        />
                    </div>
                    <div className="hidden w-88 max-w-full grid-cols-2 gap-3 md:grid">
                        {[
                            { src: esgAccountingImg, label: "ESG accounting" },
                            { src: sasbImg, label: "Framework-ready" },
                            { src: esgReportingImg, label: "Disclosure workflows" },
                            { src: sustainableFinanceImg, label: "Finance-grade" },
                        ].map((tile) => (
                            <div
                                key={tile.label}
                                className="card-hover relative overflow-hidden rounded-2xl border border-white/40 bg-white/20 shadow-lg backdrop-blur-md">
                                <Image
                                    src={tile.src}
                                    alt=""
                                    className="h-28 w-full object-cover"
                                    sizes="(min-width: 768px) 180px, 45vw"
                                />
                                <div
                                    className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent"
                                    aria-hidden
                                />
                                <div className="absolute bottom-2 left-2 right-2">
                                    <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide text-white backdrop-blur-md">
                                        {tile.label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="max-w-xs text-center text-xs leading-relaxed text-emerald-100/85 md:text-right">
                        Built for enterprises that need audit-ready numbers and consumer-trusted product stories not
                        slide-deck estimates.
                    </p>
                </div>
            </div>
        </section>
    );
}
