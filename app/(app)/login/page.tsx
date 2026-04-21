import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";

export default function LoginPage() {
    return (
        <main className="relative flex flex-1 items-stretch justify-center overflow-hidden px-4 py-10 sm:px-6 lg:py-16">
            <div
                className="full-bleed pointer-events-none absolute inset-0 bg-[url('/GreenLedger_Background.jpg')] bg-cover bg-center bg-no-repeat"
                aria-hidden
            />
            <div
                className="full-bleed pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-950/92 via-emerald-900/78 to-teal-950/85"
                aria-hidden
            />
            <div
                className="full-bleed pointer-events-none absolute inset-0 bg-linear-to-t from-black/62 via-black/20 to-emerald-950/22"
                aria-hidden
            />
            <div
                className="full-bleed pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_72%_at_50%_-12%,rgba(255,255,255,0.22),transparent_54%)]"
                aria-hidden
            />
            <div className="full-bleed pointer-events-none absolute inset-0 gl-grain" aria-hidden />

            <div className="relative mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-2 lg:gap-10 lg:items-stretch">
                <section className="relative overflow-hidden rounded-3xl border border-white/25 bg-white/10 p-7 shadow-2xl shadow-black/25 backdrop-blur-md lg:p-10">
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/20 to-transparent" />
                    <div
                        className="gl-orb gl-drift pointer-events-none absolute -left-10 -top-10 h-44 w-44 bg-emerald-400/35"
                        aria-hidden
                    />
                    <div
                        className="gl-orb gl-drift-2 pointer-events-none absolute -bottom-14 -right-16 h-56 w-56 bg-teal-400/25"
                        aria-hidden
                    />
                    <div
                        className="gl-orb gl-spin-slow pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 bg-white/10"
                        aria-hidden
                    />

                    <div className="relative flex h-full flex-col">
                        <div className="animate-fade-up">
                            <p className="inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-50 shadow-sm backdrop-blur-md">
                                Secure access · Audit-ready by design
                            </p>
                            <h1 className="mt-5 text-balance text-3xl font-extrabold leading-[1.08] tracking-tight text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.35)] sm:text-4xl">
                                Sign in to GreenLedger
                            </h1>
                            <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-emerald-50/90 sm:text-base">
                                Your workspace for ESG reporting, carbon accounting, and traceability presented with
                                finance-grade controls and clarity.
                            </p>
                        </div>
                        <div className="mt-8 flex flex-1 items-center justify-center">
                            <Image
                                src="/GLLogo.png"
                                alt="GreenLedger Logo"
                                width={520}
                                height={520}
                                priority
                                className="h-auto w-[min(22rem,90%)] max-w-full object-contain drop-shadow-[0_20px_70px_rgba(0,0,0,0.45)]"
                            />
                        </div>
                    </div>
                </section>

                <section className="relative">
                    <div className="gl-shimmer-border h-full rounded-3xl border border-white/35 bg-white/80 shadow-2xl shadow-black/20 backdrop-blur-md">
                        <div className="flex h-full flex-col rounded-3xl p-6 sm:p-8">
                            <LoginForm />
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
