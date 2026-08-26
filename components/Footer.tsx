"use client";

import Image from "next/image";
import Link from "next/link";
import startupIndia from "@/assets/startupIndia.png";
import entrepreneurCafe from "@/assets/entrepreneurCafe.jpg";
import isoCertifaction from "@/assets/isoCertifaction.png";
import IMKKolkata from "@/assets/IMIKolkata.jpg";
import sepcKolkata from "@/assets/sepc.png";
import rpsgLogo from "@/assets/rpsgLogo3.jpg";
import { useCookieConsentStore } from "@/stores/cookie-consent-store";

export default function Footer() {
    const setOpen = useCookieConsentStore((s) => s.setOpen);

    return (
        <footer className="mt-14 rounded-2xl border border-white/70 bg-white/80 p-6 text-sm text-slate-600 section-bg backdrop-blur-sm sm:p-7 mb-6 font-(--font-hanken)">
            <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                <div className="max-w-md">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900">GreenLedger</p>
                    <p className="mt-2 text-xs leading-relaxed">
                        ESG reporting, carbon accounting, and supply chain traceability on one platform designed for
                        audit ready enterprises and consumer-trusted brands.
                    </p>
                </div>
                <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                    <Link href="/cbam" className="hover:text-emerald-700">
                        CBAM Compliance
                    </Link>
                    <a href="#" className="hover:text-emerald-700">
                        Privacy
                    </a>
                    <a href="#" className="hover:text-emerald-700">
                        Terms
                    </a>
                    <a href="#" className="hover:text-emerald-700">
                        Security
                    </a>
                    <button
                        onClick={() => setOpen(true)}
                        className="hover:text-emerald-700 cursor-pointer bg-transparent border-none p-0 text-xs font-inherit text-slate-600 focus:outline-none">
                        Cookie Preferences
                    </button>
                    <Link href="/#cta" className="hover:text-emerald-700">
                        Contact
                    </Link>
                </nav>
                <div
                    className="group w-full text-slate-700 transition hover:bg-white/90"
                    aria-label="Supported by Startup India (opens in new tab)">
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-emerald-900/65">
                                Supported by
                            </p>
                            <p className="mt-1 text-base font-bold tracking-tight hidden sm:block text-emerald-950 sm:text-lg">
                                <a href="https://www.startupindia.gov.in/" target="_blank" rel="noopener noreferrer">
                                    Startup India
                                </a>{" "}
                                |{" "}
                                <a href="https://www.entrepreneurcafe.org/" target="_blank" rel="noopener noreferrer">
                                    Entrepreneur Cafe
                                </a>{" "}
                                |{" "}
                                <a href="https://www.rpsg.in" target="_blank" rel="noopener noreferrer">
                                    RP-Sanjiv Goenka Group (IMI Kolkata)
                                </a>
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="https://www.startupindia.gov.in/" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={startupIndia}
                                    alt="Startup India"
                                    className="h-12 w-auto object-contain opacity-95 sm:h-14"
                                />
                            </a>
                            <a href="https://www.entrepreneurcafe.org/" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={entrepreneurCafe}
                                    alt="Entrepreneur Cafe"
                                    className="h-12 w-auto object-contain opacity-95 sm:h-14"
                                />
                            </a>
                            <a href="https://www.rpsg.in" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={rpsgLogo}
                                    alt="RP-Sanjiv Goenka Group (IMI Kolkata)"
                                    className="h-12 w-auto object-contain opacity-95 sm:h-14"
                                />
                            </a>
                            <a href="https://imik.edu.in" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={IMKKolkata}
                                    alt="IMI Kolkata"
                                    className="h-12 w-auto object-contain opacity-95 sm:h-14"
                                />
                            </a>
                        </div>
                    </div>
                </div>
                <hr className="my-2 border-gray-300 w-full" />
                <div className="group w-full text-slate-700 transition hover:bg-white/90" aria-label="Certifications">
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-emerald-900/65">
                                Certifications
                            </p>
                            <p className="mt-1 text-base font-bold tracking-tight hidden sm:block text-emerald-950 sm:text-lg">
                                <a href="https://www.servicesepc.org/" target="_blank" rel="noopener noreferrer">
                                    Service Export Promotion Council (SEPC) India
                                </a>{" "}
                                |{" "}
                                <a href="https://www.iso.org/standard/27001" target="_blank" rel="noopener noreferrer">
                                    ISO 27001
                                </a>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <a href="https://www.servicesepc.org/" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={sepcKolkata}
                                    alt="SEPC certification"
                                    className="h-20 w-auto object-contain opacity-95 sm:h-12"
                                />
                            </a>
                            <a href="https://www.iso.org/standard/27001" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={isoCertifaction}
                                    alt="ISO 27001 certification"
                                    className="h-20 w-auto object-contain opacity-95 sm:h-12"
                                />
                            </a>
                        </div>
                    </div>
                </div>
                <hr className="my-2 border-gray-300 w-full" />
                <div className="w-full rounded-xl bg-emerald-950/[0.03] border border-emerald-950/5 px-4 py-3 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-emerald-900/65">
                            Connect &amp; Inquiries
                        </p>
                        <p className="text-xs text-slate-600">
                            Have questions or need enterprise onboarding? Reach out to our advisory team directly.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-700">
                        <a
                            href="mailto:sayan@redswitchglobal.com"
                            className="inline-flex items-center gap-1.5 hover:text-emerald-700 transition-colors">
                            <svg className="w-3.5 h-3.5 text-emerald-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>sayan@redswitchglobal.com</span>
                        </a>
                        <a
                            href="tel:+919831076943"
                            className="inline-flex items-center gap-1.5 hover:text-emerald-700 transition-colors">
                            <svg className="w-3.5 h-3.5 text-emerald-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>+91 98310 76943</span>
                        </a>
                    </div>
                </div>
                <p className="text-xs text-slate-500 sm:w-full sm:text-center">
                    © {new Date().getFullYear()} GreenLedger. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
