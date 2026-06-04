import Image from "next/image";
import DecorativeVideo from "@/components/landing/DecorativeVideo";
import startupIndia from "@/assets/startupIndia.png";
import IMKKolkata from "@/assets/IMIKolkata.jpg";
import entrepreneurCafe from "@/assets/entrepreneurCafe.jpg";

export default function HeroSection() {
    return (
        <section className="full-bleed relative min-h-[min(90vh,820px)] overflow-hidden rounded-none shadow-[0_24px_80px_-30px_rgba(0,40,25,0.55)]">
            {/* Video background with responsive sizing and intelligent playback */}
            <div className="bg-gradient-to-br from-[#011E16] via-[#033A2E] to-[#0B5242]">
                <DecorativeVideo
                    src="/api/media/green-earth"
                    poster="/GreenLedger_Background.jpg"
                    className="absolute inset-0 h-full w-full object-cover bg-gradient-to-br from-[#011E16] via-[#033A2E] to-[#0B5242]"
                    startTime={2}
                />
            </div>

            {/* Overlay gradients for text readability and aesthetic depth */}
            <div
                className="absolute inset-0 bg-linear-to-br from-emerald-950/92 via-emerald-900/78 to-teal-950/88"
                aria-hidden
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/15 to-emerald-950/35" aria-hidden />
            <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_110%_70%_at_50%_-10%,rgba(255,255,255,0.16),transparent_52%)]"
                aria-hidden
            />

            {/* Grain texture for visual refinement */}
            <div className="gl-grain" aria-hidden />

            <div className="relative z-10 mx-auto flex w-full max-w-none flex-col gap-10 px-4 py-14 sm:px-5 md:flex-row md:items-center md:justify-between md:px-6 md:py-16 lg:px-12 lg:py-20 lg:my-28">
                <div className="min-w-0 flex-1">
                    <h1 className="text-balance text-3xl font-extrabold leading-[1.08] tracking-tight text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.35)] sm:text-4xl lg:text-5xl xl:text-5xl">
                        GHG accounting and ESG reporting audit ready operations and role based controls
                    </h1>
                    <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-emerald-50/95 sm:text-lg ">
                        GreenLedger centralizes ESG reporting and GHG accounting, producing audit ready outputs with
                        immutable logging. Manage role based access and approval queues for activity submissions, and
                        capture fuel, electricity and energy activities with meter and invoice grade fidelity.
                    </p>
                    <div className="mt-22 flex flex-wrap gap-3">
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
                    <div className="mt-7 flex flex-col">
                        <div className="inline-flex items-center gap-3 rounded-2xl px-1 py-2">
                            <span className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-emerald-50/85">
                                Supported by
                            </span>
                            <a href="https://www.startupindia.gov.in/" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={startupIndia}
                                    alt="Startup India"
                                    className="h-7 rounded-sm w-auto object-contain opacity-95"
                                />
                            </a>
                            <a href="https://www.entrepreneurcafe.org/" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={entrepreneurCafe}
                                    alt="Entrepreneur Cafe"
                                    className="h-7 w-auto object-contain opacity-95 rounded-sm"
                                />
                            </a>
                            <a href="https://imik.edu.in" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={IMKKolkata}
                                    alt="IMI Kolkata"
                                    className="h-7 w-auto object-contain opacity-95 rounded-sm"
                                />
                            </a>
                        </div>
                        {/* <div className="inline-flex items-center gap-3 rounded-2xl px-1 py-2 h-auto">
                            <span className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-emerald-50/85">
                                Certifications
                            </span>
                            <a href="https://www.servicesepc.org/" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={sepcKolkata}
                                    alt="SEPC"
                                    className="h-7 w-auto object-contain opacity-95 rounded-sm"
                                />
                            </a>
                            <a href="https://www.iso.org/standard/27001" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={isoCertifaction}
                                    alt="ISO 27001 certification"
                                    className="h-7 w-auto object-contain opacity-95 rounded-sm"
                                />
                            </a>
                        </div> */}
                    </div>
                </div>
            </div>
        </section>
    );
}
