import Link from "next/link";
import DecorativeVideo from "@/components/landing/DecorativeVideo";

export default function CBAMHero() {
    return (
        <section className="full-bleed relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden rounded-none">
            {/* Go Back to Home Button (Top-Left) */}
            <Link
                href="/"
                className="absolute top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a1f19]/70 text-white text-xs font-semibold backdrop-blur-md hover:bg-[#0d2a22]/90 hover:border-emerald-400/55 transition-all shadow-lg shadow-black/10">
                <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
                Back to Home
            </Link>

            {/* Video Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#01140f] via-[#02281d] to-[#043325] z-0">
                <DecorativeVideo
                    src="/api/media/cbam"
                    poster="/GreenLedger_Background.jpg"
                    className="absolute inset-0 h-full w-full object-cover bg-gradient-to-br from-[#01140f] via-[#02281d] to-[#043325]"
                    startTime={0}
                />
            </div>

            {/* Dark vignette left-to-right & top-to-bottom for high legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-10" aria-hidden />

            {/* Hero Content */}
            <div className="relative z-35 w-full max-w-8xl md:ml-30 flex flex-col text-left">
                <div className="max-w-2xl">

                    {/* Main Title */}
                    <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] mb-6 [text-shadow:0_2px_20px_rgba(0,0,0,0.4)]">
                        Mastering CBAM <br />
                        <span className="bg-gradient-to-r from-[#59ecc1] to-[#2bbd8e] bg-clip-text text-transparent">
                            Complexity
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl leading-relaxed [text-shadow:0_1px_8px_rgba(0,0,0,0.3)]">
                        Navigate the Carbon Border Adjustment Mechanism with precision. Automate emissions tracking, ensure EU-compliance, and mitigate financial liability for high-stakes industrial reporting.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="#governance"
                            className="bg-[#006c49] hover:bg-[#005237] text-white px-8 py-4 font-bold rounded-lg transition-all flex items-center gap-2 group shadow-lg shadow-black/20">
                            Start Technical Audit
                            <span className="material-symbols-outlined text-sm font-bold group-hover:translate-x-1 transition-transform">
                                arrow_forward
                            </span>
                        </Link>
                        <Link
                            href="#regulations"
                            className="bg-white/5 border border-white/20 text-white px-8 py-4 font-bold rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                            View Documentation
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
