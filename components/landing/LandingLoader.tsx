"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

const STORAGE_KEY = "gl_dont_show_intro_video";

export default function LandingLoader() {
    const [isMounted, setIsMounted] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Read localStorage setting safely on client mount
    useEffect(() => {
        setIsMounted(true);
        const storedPref = localStorage.getItem(STORAGE_KEY);
        const shouldSkipVideo = storedPref === "true";

        if (shouldSkipVideo) {
            setDontShowAgain(true);
            setShowVideo(false);
            // Brief normal loading buffer for WebGL/page assets to stabilize
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 450);
            return () => clearTimeout(timer);
        } else {
            setShowVideo(true);
        }
    }, []);

    // Close handler
    const handleClose = useCallback(() => {
        if (dontShowAgain) {
            localStorage.setItem(STORAGE_KEY, "true");
        }
        setIsVisible(false);
    }, [dontShowAgain]);

    // Checkbox toggle handler
    const handleToggleDontShowAgain = (checked: boolean) => {
        setDontShowAgain(checked);
        if (checked) {
            localStorage.setItem(STORAGE_KEY, "true");
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    // Keyboard ESC listener to skip intro
    useEffect(() => {
        if (!isVisible || !showVideo) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" || e.key === " ") {
                e.preventDefault();
                handleClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isVisible, showVideo, handleClose]);

    // Track video playback progress
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const total = videoRef.current.duration;
            if (total > 0) {
                setVideoProgress((current / total) * 100);
            }
        }
    };

    if (!isMounted || !isVisible) {
        return null;
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/65 backdrop-blur-md text-white overflow-hidden select-none"
                >
                    {showVideo ? (
                        /* Cinematic Video Loader Mode */
                        <div className="relative h-full w-full flex flex-col items-center justify-center p-4 sm:p-8">
                            {/* Floating Top Controls Header */}
                            <div className="absolute top-4 sm:top-6 right-4 sm:right-8 z-30 flex items-center gap-3 pointer-events-auto">
                                {/* Don't show again toggle checkbox */}
                                <label className="flex items-center gap-2 cursor-pointer select-none rounded-full bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 border border-white/10 hover:border-emerald-500/40 transition-colors text-xs font-mono text-slate-300 shadow-md">
                                    <input
                                        type="checkbox"
                                        checked={dontShowAgain}
                                        onChange={(e) => handleToggleDontShowAgain(e.target.checked)}
                                        className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 h-3.5 w-3.5 cursor-pointer accent-emerald-500"
                                    />
                                    <span className="hidden sm:inline">Don&apos;t show again</span>
                                    <span className="sm:hidden">Don&apos;t show</span>
                                </label>

                                {/* Cross / Close Button */}
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    aria-label="Close intro"
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-all shadow-md active:scale-90">
                                    <MaterialIcon name="close" size="sm" />
                                </button>
                            </div>

                            {/* Video Display Card - rounded-md with subtle shadow */}
                            <div className="relative z-10 w-full max-w-5xl max-h-[80vh] aspect-video rounded-md overflow-hidden border border-white/10 shadow-[0_16px_50px_rgba(0,0,0,0.5)] bg-black/90">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    preload="auto"
                                    onTimeUpdate={handleTimeUpdate}
                                    onEnded={handleClose}
                                    onError={handleClose}
                                    className="w-full h-full object-cover">
                                    <source src="/GL video improved.mp4" type="video/mp4" />
                                    <source src="/api/media/landing-intro" type="video/mp4" />
                                </video>

                                {/* Playback Progress Strip */}
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
                                    <div
                                        className="h-full bg-emerald-500 transition-all duration-100"
                                        style={{ width: `${videoProgress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Standard Fast Loading Spinner Mode (when user chose "Don't show again") */
                        <div className="relative flex flex-col items-center">
                            {/* Subtle pulsing green glow background */}
                            <div className="absolute -inset-4 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />

                            {/* Minimalist modern loader spinner */}
                            <div className="relative h-12 w-12">
                                <div className="h-full w-full rounded-full border-[3px] border-emerald-900/20" />
                                <div className="absolute top-0 left-0 h-full w-full rounded-full border-[3px] border-emerald-500 border-t-transparent animate-spin" />
                            </div>

                            {/* Logo Text */}
                            <span className="mt-4 font-sans text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase animate-pulse">
                                GreenLedger
                            </span>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
