"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    HiHome,
    HiArrowLeft,
    HiSquares2X2,
    HiShieldCheck,
    HiGlobeAlt,
    HiArrowRightOnRectangle,
} from "react-icons/hi2";
import earth404Img from "@/assets/404-Earth.png";
import greenLedgerLogo from "@/assets/GLLogo.png";

export default function NotFoundUI() {
    const router = useRouter();

    const handleGoBack = () => {
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
        } else {
            router.push("/");
        }
    };

    return (
        <main className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-[#031610] px-4 py-8 text-white sm:px-6 lg:px-8 font-[var(--font-hanken),Inter,system-ui,sans-serif]">
            {/* Background Ambient Glowing Orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-600/20 blur-[120px] gl-drift" />
                <div className="absolute -bottom-40 -right-40 h-[550px] w-[550px] rounded-full bg-teal-500/15 blur-[130px] gl-drift-2" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[150px]" />

                {/* Subtle Grid Pattern Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
                        backgroundSize: "32px 32px",
                    }}
                />

                {/* Star / Telemetry Particles */}
                <div className="absolute top-1/4 left-1/5 h-1.5 w-1.5 rounded-full bg-emerald-300 opacity-60 animate-pulse" />
                <div className="absolute top-1/3 right-1/4 h-1 w-1 rounded-full bg-teal-200 opacity-40 animate-pulse" />
                <div className="absolute bottom-1/3 left-1/3 h-2 w-2 rounded-full bg-emerald-400 opacity-30 animate-ping" />
                <div className="absolute bottom-1/4 right-1/5 h-1.5 w-1.5 rounded-full bg-white opacity-50 animate-pulse" />
            </div>

            {/* Central Main Hero Content Card */}
            <div className="relative z-10 my-auto flex w-full max-w-4xl flex-col items-center justify-center text-center py-6">

                {/* Floating 404-Earth Image Art */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="relative my-2 flex justify-center items-center"
                >
                    {/* Glowing Backdrop Radial Ring */}
                    <div className="absolute inset-0 -m-6 animate-pulse" />

                    <motion.div
                        animate={{ y: [-8, 8, -8] }}
                        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
                        className="relative z-10"
                    >
                        <Image
                            src={earth404Img}
                            alt="404 Earth Illustration"
                            priority
                            width={200}
                            className=" object-contain drop-shadow-[0_12px_28px_rgba(16,185,129,0.3)] transition-transform duration-300 hover:scale-[1.02]"
                        />
                    </motion.div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
                >
                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-md py-2 px-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:border-emerald-400/40 hover:text-white hover:scale-[1.03] active:scale-[0.97]"
                    >
                        <HiHome className="h-4 w-4 shrink-0 text-emerald-100" />
                        <span>Go Back to Home</span>
                    </Link>

                    <button
                        type="button"
                        onClick={handleGoBack}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md py-2 px-4 text-sm font-medium text-emerald-100 backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-emerald-400/40 hover:text-white hover:scale-[1.03] active:scale-[0.97]"
                    >
                        <HiArrowLeft className="h-4 w-4 shrink-0" />
                        <span>Previous Page</span>
                    </button>
                </motion.div>

                {/* Quick Directory Links Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-12 w-full max-w-xl border-t border-emerald-900/50 pt-6 flex flex-col items-center"
                >
                    <p className="text-[11px] font-mono uppercase tracking-widest text-emerald-400/60 mb-3">
                        Or jump directly to key platform areas:
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                        <Link
                            href="/#pillars"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-800/40 bg-emerald-950/40 px-3 py-1.5 text-xs font-mono text-emerald-300/80 transition-colors hover:border-emerald-500/40 hover:bg-emerald-900/60 hover:text-emerald-200"
                        >
                            <HiGlobeAlt className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Platform</span>
                        </Link>
                        <Link
                            href="/cbam"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-800/40 bg-emerald-950/40 px-3 py-1.5 text-xs font-mono text-emerald-300/80 transition-colors hover:border-emerald-500/40 hover:bg-emerald-900/60 hover:text-emerald-200"
                        >
                            <HiShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                            <span>CBAM</span>
                        </Link>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-800/40 bg-emerald-950/40 px-3 py-1.5 text-xs font-mono text-emerald-300/80 transition-colors hover:border-emerald-500/40 hover:bg-emerald-900/60 hover:text-emerald-200"
                        >
                            <HiSquares2X2 className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-800/40 bg-emerald-950/40 px-3 py-1.5 text-xs font-mono text-emerald-300/80 transition-colors hover:border-emerald-500/40 hover:bg-emerald-900/60 hover:text-emerald-200"
                        >
                            <HiArrowRightOnRectangle className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Client Login</span>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Footer Signature */}
            <footer className="relative z-10 w-full max-w-7xl text-center text-xs font-mono text-emerald-500/40 pb-2">
                © {new Date().getFullYear()} GreenLedger ESG Reporting & Carbon Accounting. All rights reserved.
            </footer>
        </main>
    );
}
