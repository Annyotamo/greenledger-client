"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTenantProfile } from "@/lib/tenantProfile/hooks";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { motion, AnimatePresence } from "framer-motion";
import bgImage from "@/assets/GreenLedger_Background.jpg";

const TERMINAL_LOGS = [
    "[SYSTEM] Initiating secure handshake with GreenLedger node...",
    "[HTTP] GET /api/v1/tenant/profile - 200 OK",
    "[DATA] Retrieved company_name: \"{companyName}\"",
    "[DATA] Active tenant_code: \"{tenantCode}\"",
    "[DB] Querying database for active facilities...",
    "[DB] Detected {maxFacilities} active facility nodes.",
    "[HTTP] GET /api/v1/activities/electricity - Fetching Scope 2 logs...",
    "[CALC] Processing electricity grid import: national_grid (0.71 tCO2e/MWh)...",
    "[HTTP] GET /api/v1/activities/fuel - Fetching Scope 1 invoices...",
    "[CALC] WHRB heat recovery efficiency factor: 82.4%...",
    "[CALC] WHRB equivalent emission coeff: 0.0824 tCO2e/t...",
    "[COMPUTE] Aggregating Scope 1 & Scope 2 metrics...",
    "[COMPUTE] Syncing monthly trends for FBC & WHRB boiler assets...",
    "[MATH] Calculated MTD carbon intensity: 4,124.8 tCO2e...",
    "[SYSTEM] Optimizing local query cache database...",
    "[SYSTEM] Security token refresh handshake successful.",
    "[SYSTEM] Active workspace session established.",
    "[SYSTEM] Ready. Handing over to Dashboard view..."
];

const STEPS = [
    "Establishing secure server connection",
    "Fetching facility registry parameters",
    "Retrieving GHG Scope 1 & Scope 2 metrics",
    "Compiling dashboard trends & boiler assets",
    "Synchronizing workspace session"
];

export default function InitializingPage() {
    const router = useRouter();
    const { data: tenant, isLoading } = useTenantProfile();
    const [videoFinished, setVideoFinished] = useState(false);
    const [progress, setProgress] = useState(0);
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [terminalLines, setTerminalLines] = useState<string[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Safety fallback: if video doesn't end within 5 seconds (e.g. autoplay restriction), auto-transition
    useEffect(() => {
        const fallbackTimer = setTimeout(() => {
            setVideoFinished(true);
        }, 5200);

        return () => clearTimeout(fallbackTimer);
    }, []);

    // Preload image assets fully in parallel while the video is playing
    useEffect(() => {
        if (!tenant) return;

        let bgReady = false;
        let bannerReady = false;

        const checkReady = () => {
            if (bgReady && bannerReady) {
                setImagesLoaded(true);
            }
        };

        // 1. Preload Background Image
        const bgImg = new Image();
        bgImg.src = bgImage.src;
        bgImg.onload = () => {
            bgReady = true;
            checkReady();
        };
        bgImg.onerror = () => {
            bgReady = true;
            checkReady();
        };

        // 2. Preload Tenant Banner Image
        if (tenant.bannerImageUrl) {
            const bannerImg = new Image();
            bannerImg.src = tenant.bannerImageUrl;
            bannerImg.onload = () => {
                bannerReady = true;
                checkReady();
            };
            bannerImg.onerror = () => {
                bannerReady = true;
                checkReady();
            };
        } else {
            bannerReady = true;
            checkReady();
        }

        // Preload Tenant Logo in background
        if (tenant.logoUrl) {
            const logoImg = new Image();
            logoImg.src = tenant.logoUrl;
        }
    }, [tenant]);

    // Fast snappy progress (~1.8 seconds total duration) once the card is active
    const isReadyForInitCard = videoFinished && !isLoading && Boolean(tenant) && imagesLoaded;

    useEffect(() => {
        if (!isReadyForInitCard) return;

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                const increment = Math.random() > 0.4 ? 2 : 1;
                const next = Math.min(prev + increment, 100);

                if (next < 25) setActiveStepIndex(0);
                else if (next < 50) setActiveStepIndex(1);
                else if (next < 75) setActiveStepIndex(2);
                else if (next < 90) setActiveStepIndex(3);
                else setActiveStepIndex(4);

                return next;
            });
        }, 25); // Fast smooth tick (~1.8s total duration)

        return () => clearInterval(progressInterval);
    }, [isReadyForInitCard]);

    // Handle terminal lines logs with fast high-tech feed
    useEffect(() => {
        if (!isReadyForInitCard || !tenant) return;

        const logs = TERMINAL_LOGS.map(line =>
            line
                .replace("{companyName}", tenant.companyName || "GreenLedger")
                .replace("{tenantCode}", tenant.tenantCode || "GREE7257")
                .replace("{maxFacilities}", String(tenant.maxFacilities || 2))
        );

        let logIndex = 0;
        const terminalInterval = setInterval(() => {
            if (logIndex < logs.length) {
                setTerminalLines((prev) => {
                    const nextLines = [...prev, logs[logIndex]];
                    if (nextLines.length > 5) {
                        return nextLines.slice(nextLines.length - 5);
                    }
                    return nextLines;
                });
                logIndex++;
            } else {
                logIndex = 0;
            }
        }, 85); // Fast streaming log feed

        return () => clearInterval(terminalInterval);
    }, [isReadyForInitCard, tenant]);

    // Redirect on completion
    useEffect(() => {
        if (progress === 100) {
            const timeout = setTimeout(() => {
                router.push("/dashboard");
            }, 150); // Crisp 150ms handover
            return () => clearTimeout(timeout);
        }
    }, [progress, router]);

    return (
        <AnimatePresence mode="wait">
            {!isReadyForInitCard ? (
                /* Phase 1: High-Aesthetic Video Loading Screen */
                <motion.div
                    key="video-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-[#070c12] text-white">
                    {/* Atmospheric ambient glow */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_0%,rgba(7,12,18,0.98)_70%)]" />

                    {/* Centered Video Player Card */}
                    <div className="relative z-10 flex flex-col items-center max-w-md w-full px-4">
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.18)] bg-black/60 backdrop-blur-xl">
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                preload="auto"
                                onEnded={() => setVideoFinished(true)}
                                onError={() => setVideoFinished(true)}
                                className="w-full h-full object-cover">
                                <source src="/GreenLedger Logo Animation.mp4" type="video/mp4" />
                                <source src="/api/media/logo-animation" type="video/mp4" />
                            </video>
                        </div>

                        {/* Aesthetic Loading Status Indicator */}
                        <div className="mt-8 flex flex-col items-center gap-3">
                            <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/40 backdrop-blur-md shadow-xs">
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                                <span className="font-mono text-xs tracking-wider text-emerald-300 uppercase font-semibold">
                                    Retrieving credentials...
                                </span>
                            </div>
                            <p className="text-[11px] font-mono text-emerald-400/50 tracking-widest uppercase">
                                Initializing GreenLedger Node
                            </p>
                        </div>
                    </div>
                </motion.div>
            ) : (
                /* Phase 2: Initialization & Workspace Cache Card */
                <motion.div
                    key="init-card"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-cover bg-center font-sans p-4"
                    style={{ backgroundImage: `url(${bgImage.src})` }}>
                    {/* Opaque layer to show the background image transparently & soothingly */}
                    <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-[3px]" />

                    <div className="relative z-10 w-full max-w-[820px] rounded-xl border border-outline-variant/40 bg-white/85 shadow-[0_12px_36px_rgba(0,0,0,0.03)] backdrop-blur-md overflow-hidden">
                        {/* Header Banner - Crisp, showing more of the bottom */}
                        <div className="relative h-56 w-full overflow-hidden bg-[#0d161f]">
                            {tenant?.bannerImageUrl ? (
                                <img
                                    src={tenant.bannerImageUrl}
                                    alt="Tenant Banner"
                                    loading="eager"
                                    className="h-full w-full object-cover object-bottom opacity-100"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/30 via-teal-50/50 to-blue-50/30" />
                            )}
                            {/* Crisp fade gradient transition at the bottom edge */}
                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/95 to-transparent" />
                        </div>

                        {/* Profile Information Overlay */}
                        <div className="relative -mt-12 px-6 pb-4 flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:text-left">
                            {/* Logo - rounded-md */}
                            <div className="relative flex h-20 w-20 items-center justify-center rounded-md border border-outline-variant bg-white p-2 shadow-sm ring-4 ring-white/60">
                                {tenant?.logoUrl ? (
                                    <img
                                        src={tenant.logoUrl}
                                        alt={tenant.companyName}
                                        loading="eager"
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <MaterialIcon name="domain" className="text-primary text-2xl" />
                                )}
                            </div>

                            {/* Tenant Info */}
                            <div className="space-y-0.5 pb-0.5">
                                <h1 className="text-2xl font-extrabold text-on-surface tracking-tight leading-none mb-1">
                                    {tenant?.companyName || "GreenLedger"}
                                </h1>
                                <div className="flex items-center justify-center gap-1.5 text-xs text-on-surface-variant font-semibold">
                                    <span className="font-bold text-primary tracking-wide">{tenant?.tenantCode}</span>
                                    <span className="h-1 w-1 rounded-full bg-outline" />
                                    <span>{tenant?.city}, {tenant?.country}</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Layout - Centered Column */}
                        <div className="p-8 pt-4 flex flex-col items-center space-y-6 border-t border-outline-variant/20">
                            {/* Segmented Line Loader */}
                            <div className="space-y-3 w-full max-w-[460px]">
                                <div className="grid grid-cols-4 gap-2">
                                    {/* Part 1: 0 - 25% */}
                                    <div className="h-1.5 rounded-full bg-[#f0f3f2] overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-150"
                                            style={{ width: `${Math.max(0, Math.min(100, (progress - 0) * 4))}%` }}
                                        />
                                    </div>
                                    {/* Part 2: 25 - 50% */}
                                    <div className="h-1.5 rounded-full bg-[#f0f3f2] overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-150"
                                            style={{ width: `${Math.max(0, Math.min(100, (progress - 25) * 4))}%` }}
                                        />
                                    </div>
                                    {/* Part 3: 50 - 75% */}
                                    <div className="h-1.5 rounded-full bg-[#f0f3f2] overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-150"
                                            style={{ width: `${Math.max(0, Math.min(100, (progress - 50) * 4))}%` }}
                                        />
                                    </div>
                                    {/* Part 4: 75 - 100% */}
                                    <div className="h-1.5 rounded-full bg-[#f0f3f2] overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-150"
                                            style={{ width: `${Math.max(0, Math.min(100, (progress - 75) * 4))}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Milestones row */}
                                <div className="grid grid-cols-4 w-full pt-1.5">
                                    {/* Milestone 1 */}
                                    <div className="flex flex-col items-center space-y-1">
                                        <div className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300 ${
                                            progress >= 25
                                                ? "border-emerald-500/20 bg-emerald-50 text-emerald-600"
                                                : "border-outline-variant/60 bg-transparent text-on-surface-variant/40"
                                        }`}>
                                            <MaterialIcon name={progress >= 25 ? "check" : "hub"} size="xs" />
                                        </div>
                                        <span className={`text-[8.5px] font-bold tracking-wider ${progress >= 25 ? "text-emerald-700" : "text-on-surface-variant/40"}`}>
                                            SERVER
                                        </span>
                                    </div>
                                    {/* Milestone 2 */}
                                    <div className="flex flex-col items-center space-y-1">
                                        <div className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300 ${
                                            progress >= 50
                                                ? "border-emerald-500/20 bg-emerald-50 text-emerald-600"
                                                : "border-outline-variant/60 bg-transparent text-on-surface-variant/40"
                                        }`}>
                                            <MaterialIcon name={progress >= 50 ? "check" : "domain"} size="xs" />
                                        </div>
                                        <span className={`text-[8.5px] font-bold tracking-wider ${progress >= 50 ? "text-emerald-700" : "text-on-surface-variant/40"}`}>
                                            REGISTRY
                                        </span>
                                    </div>
                                    {/* Milestone 3 */}
                                    <div className="flex flex-col items-center space-y-1">
                                        <div className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300 ${
                                            progress >= 75
                                                ? "border-emerald-500/20 bg-emerald-50 text-emerald-600"
                                                : "border-outline-variant/60 bg-transparent text-on-surface-variant/40"
                                        }`}>
                                            <MaterialIcon name={progress >= 75 ? "check" : "bar_chart"} size="xs" />
                                        </div>
                                        <span className={`text-[8.5px] font-bold tracking-wider ${progress >= 75 ? "text-emerald-700" : "text-on-surface-variant/40"}`}>
                                            METRICS
                                        </span>
                                    </div>
                                    {/* Milestone 4 */}
                                    <div className="flex flex-col items-center space-y-1">
                                        <div className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300 ${
                                            progress >= 100
                                                ? "border-emerald-500/20 bg-emerald-50 text-emerald-600"
                                                : "border-outline-variant/60 bg-transparent text-on-surface-variant/40"
                                        }`}>
                                            <MaterialIcon name={progress >= 100 ? "check" : "sync"} size="xs" />
                                        </div>
                                        <span className={`text-[8.5px] font-bold tracking-wider ${progress >= 100 ? "text-emerald-700" : "text-on-surface-variant/40"}`}>
                                            SYNCED
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Step Status Text */}
                            <div className="text-center space-y-0.5 max-w-sm">
                                <h3 className="text-xs font-bold text-on-surface tracking-wide animate-pulse">
                                    {STEPS[activeStepIndex]}
                                </h3>
                                <p className="text-[10px] text-on-surface-variant font-mono">
                                    Workspace Cache: {progress}%
                                </p>
                            </div>

                            {/* scrolling terminal console - transparent, borderless, smaller text */}
                            <div className="w-full max-w-[460px] pt-1">
                                <div className="flex items-center gap-1.5 pb-2 text-[9px] tracking-wider text-emerald-800/70 font-bold font-mono">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80 animate-ping" />
                                    <span>CACHE WORKSPACE SYNC FEED</span>
                                </div>

                                <div className="h-24 overflow-hidden font-mono text-[9px] text-[#0a523a] leading-relaxed space-y-1.5">
                                    {terminalLines.map((line, index) => {
                                        const pos = terminalLines.length - 1 - index;
                                        let opacityClass = "opacity-100";
                                        if (pos === 4) opacityClass = "opacity-10";
                                        else if (pos === 3) opacityClass = "opacity-25";
                                        else if (pos === 2) opacityClass = "opacity-45";
                                        else if (pos === 1) opacityClass = "opacity-75";

                                        return (
                                            <div
                                                key={`${index}-${line}`}
                                                className={`transition-opacity duration-300 ${opacityClass} truncate`}
                                            >
                                                <span className="text-emerald-700/25 select-none mr-1.5 font-mono">&gt;</span>
                                                {line}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
