import Image from "next/image";
import DecorativeVideo from "@/components/landing/DecorativeVideo";

export default function VideoBandSection() {
    return (
        <section className="full-bleed relative isolate overflow-hidden py-14 md:py-52">
            {/* Mobile: keep this decorative and light (static image instead of video). */}
            <div className="absolute inset-0 md:hidden" aria-hidden>
                <Image
                    src="/GreenLedger_Background.jpg"
                    alt=""
                    fill
                    className="object-cover object-center"
                    priority={false}
                />
            </div>

            {/* Desktop: video only plays when in view. */}
            <DecorativeVideo
                src="/api/media/green-earth"
                className="absolute inset-0 hidden h-full w-full object-cover md:block"
            />

            <div
                className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-950/82 via-emerald-900/70 to-teal-950/82"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_68%_at_50%_15%,rgba(255,255,255,0.22),transparent_58%)]"
                aria-hidden
            />
            <div className="pointer-events-none absolute inset-0 gl-grain" aria-hidden />

            <div className="relative mx-auto grid w-full max-w-none gap-6 px-4 sm:px-5 md:grid-cols-[1.2fr_0.8fr] md:items-center md:px-6 lg:px-7">
                <div>
                    <h2 className="mt-4 max-w-3xl text-balance text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
                        ESG reporting with audit-ready logging and controlled activity approvals
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-emerald-50/90 sm:text-base">
                        Designed for teams that need ESG reporting, GHG accounting, and evidence-aware workflows for
                        fuel, electricity and energy activities.
                    </p>
                </div>
                <div className="grid gap-3">
                    {[
                        "Guide Scope 1–3 activity capture with structured data entry.",
                        "Create audit-ready logs and submission trails for every entry.",
                        "Keep fuel, electricity and energy activities governed in one system.",
                    ].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-md">
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
