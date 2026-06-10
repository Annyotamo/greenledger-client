"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCookieConsentStore, CookiePreferences } from "@/stores/cookie-consent-store";
import { getCookie, setCookie } from "@/lib/utils/cookies";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

// 90 days in seconds = 90 * 24 * 60 * 60 = 7,776,000
const COOKIE_EXPIRY_SECONDS = 90 * 24 * 60 * 60;
const COOKIE_NAME = "gl_cookie_consent";

export default function CookieConsentOverlay() {
    const { isOpen, preferences, setOpen, setPreferences } = useCookieConsentStore();
    const [mounted, setMounted] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    
    // Local preference states for customization screen
    const [gaConsent, setGaConsent] = useState(false);
    const [showEssentialsInfo, setShowEssentialsInfo] = useState(false);
    const [showGaInfo, setShowGaInfo] = useState(false);

    useEffect(() => {
        setMounted(true);
        const consent = getCookie(COOKIE_NAME);
        if (!consent) {
            setOpen(true);
        } else {
            try {
                const parsed: CookiePreferences = JSON.parse(consent);
                setPreferences(parsed);
                setGaConsent(!!parsed.ga);
            } catch {
                // Fallback for string-based true/false
                const isGa = consent === "true";
                setPreferences({ essentials: true, ga: isGa });
                setGaConsent(isGa);
            }
        }
    }, [setOpen, setPreferences]);

    // Save preferences and close modal
    const saveConsent = (prefs: CookiePreferences) => {
        setPreferences(prefs);
        setCookie(COOKIE_NAME, JSON.stringify(prefs), COOKIE_EXPIRY_SECONDS);
        setOpen(false);
    };

    const handleAcceptAll = () => {
        saveConsent({ essentials: true, ga: true });
    };

    const handleRejectAll = () => {
        saveConsent({ essentials: true, ga: false });
    };

    const handleSavePreferences = () => {
        saveConsent({ essentials: true, ga: gaConsent });
    };

    // Hydration check
    if (!mounted || !isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed bottom-6 right-6 z-[9999] max-w-md w-[calc(100vw-3rem)] rounded-2xl border border-emerald-950/10 bg-white/90 p-5 md:p-6 shadow-[0_20px_50px_rgba(4,38,29,0.15)] backdrop-blur-xl transition-all duration-300 font-[var(--font-hanken)]"
            >
                {/* Header */}
                <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
                        <MaterialIcon name="cookie" size="lg" className="text-emerald-700" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-bold text-emerald-950 flex items-center gap-1.5 leading-tight">
                            Cookie Preferences
                        </h3>
                        <p className="mt-1.5 text-xs md:text-sm leading-relaxed text-slate-600">
                            We use cookies to secure your sessions, verify identity, and analyze our traffic to optimize your GreenLedger experience.
                        </p>
                    </div>
                </div>

                {/* Preferences Expansion */}
                <AnimatePresence>
                    {showPreferences && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="mt-5 border-t border-emerald-950/5 pt-4 overflow-hidden"
                        >
                            <div className="space-y-4">
                                {/* Essentials preference */}
                                <div className="flex flex-col gap-1 rounded-xl bg-slate-50/50 border border-slate-100 p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-slate-800">Essentials</span>
                                            <button 
                                                onClick={() => setShowEssentialsInfo(!showEssentialsInfo)}
                                                className="inline-flex items-center justify-center text-slate-400 hover:text-emerald-700 transition-colors p-0.5 rounded-full hover:bg-slate-100"
                                                type="button"
                                                aria-label="More information about essentials cookies"
                                            >
                                                <MaterialIcon name="info" size="xs" />
                                            </button>
                                        </div>
                                        <div className="relative flex items-center select-none">
                                            <input
                                                type="checkbox"
                                                id="essentials-checkbox"
                                                checked
                                                disabled
                                                className="peer h-4 w-4 rounded border-slate-300 accent-emerald-700 opacity-60 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {(showEssentialsInfo || true) && (
                                            <motion.p 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="text-[11px] leading-relaxed text-slate-500 pr-4 mt-0.5"
                                            >
                                                These cookies are mandatory. They hold active session tokens, security certificates, and store your configuration preferences to ensure basic app function.
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* GA preference */}
                                <div className="flex flex-col gap-1 rounded-xl bg-slate-50/50 border border-slate-100 p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-slate-800">Google Analytics</span>
                                            <button 
                                                onClick={() => setShowGaInfo(!showGaInfo)}
                                                className="inline-flex items-center justify-center text-slate-400 hover:text-emerald-700 transition-colors p-0.5 rounded-full hover:bg-slate-100"
                                                type="button"
                                                aria-label="More information about Google Analytics cookies"
                                            >
                                                <MaterialIcon name="info" size="xs" />
                                            </button>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                id="ga-checkbox"
                                                checked={gaConsent}
                                                onChange={(e) => setGaConsent(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-700"></div>
                                        </label>
                                    </div>
                                    <AnimatePresence>
                                        {(showGaInfo || true) && (
                                            <motion.p 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="text-[11px] leading-relaxed text-slate-500 pr-4 mt-0.5"
                                            >
                                                Allows anonymous analytics to help us measure web page speed, usage patterns, and optimize user flows to make our platform better.
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap gap-2.5 items-center justify-between">
                    <button
                        onClick={() => setShowPreferences(!showPreferences)}
                        className="text-xs font-medium text-slate-500 hover:text-emerald-800 transition-colors cursor-pointer py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-700/30 rounded"
                    >
                        {showPreferences ? "Hide Preferences" : "Manage Preferences"}
                    </button>
                    <div className="flex gap-2 shrink-0">
                        {showPreferences ? (
                            <>
                                <button
                                    onClick={handleRejectAll}
                                    className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                >
                                    Reject All
                                </button>
                                <button
                                    onClick={handleSavePreferences}
                                    className="rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                                >
                                    Save Choice
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleRejectAll}
                                    className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                >
                                    Reject All
                                </button>
                                <button
                                    onClick={handleAcceptAll}
                                    className="rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                                >
                                    Accept All
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
