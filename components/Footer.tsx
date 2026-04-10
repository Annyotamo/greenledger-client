import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "./landing/ScrollReveal";
import startupIndia from "@/assets/startupIndia.png";
import entrepreneurCafe from "@/assets/entrepreneurCafe.jpg";
import isoCertifaction from "@/assets/isoCertifaction.png";
import IMKKolkata from "@/assets/IMIKolkata.jpg";

export default function Footer() {
    return (
        <ScrollReveal threshold={0.05}>
            <footer className="mt-14 rounded-2xl border border-white/70 bg-white/80 p-6 text-sm text-slate-600 section-bg backdrop-blur-sm sm:p-7">
                <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                    <div className="max-w-md">
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900">GreenLedger</p>
                        <p className="mt-2 text-xs leading-relaxed">
                            ESG reporting, carbon accounting, and supply chain traceability on one platform—designed for
                            audit-ready enterprises and consumer-trusted brands.
                        </p>
                    </div>
                    <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                        <a href="#" className="hover:text-emerald-700">
                            Privacy
                        </a>
                        <a href="#" className="hover:text-emerald-700">
                            Terms
                        </a>
                        <a href="#" className="hover:text-emerald-700">
                            Security
                        </a>
                        <Link href="/get-started" className="hover:text-emerald-700">
                            Contact
                        </Link>
                    </nav>
                    <div
                        className="group w-full rounded-none sm:rounded-2xl bg-white/75 p-4 text-slate-700 shadow-none sm:shadow-sm transition hover:bg-white/90 hover:shadow-md sm:p-5"
                        aria-label="Supported by Startup India (opens in new tab)">
                        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-emerald-900/65">
                                    Supported by
                                </p>
                                <p className="mt-1 text-base font-bold tracking-tight hidden sm:block text-emerald-950 sm:text-lg">
                                    <a
                                        href="https://www.startupindia.gov.in/"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        Startup India
                                    </a>{" "}
                                    |{" "}
                                    <a
                                        href="https://www.entrepreneurcafe.org/"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        Entrepreneur Cafe
                                    </a>{" "}
                                    |{" "}
                                    <a href="https://imik.edu.in" target="_blank" rel="noopener noreferrer">
                                        IMI Kolkata
                                    </a>
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
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
                    <div className="group w-full rounded-none sm:rounded-2xl shadow-none bg-white/75 p-4 text-slate-700 sm:shadow-sm transition hover:bg-white/90 hover:shadow-md sm:p-5">
                        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <a href="https://www.iso.org/standard/27001" target="_blank" rel="noopener noreferrer">
                                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-emerald-900/65">
                                    Certification
                                </p>
                                <p className="mt-1 text-base font-bold tracking-tight hidden sm:block text-emerald-950 sm:text-lg">
                                    ISO 27001
                                </p>
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
                    <p className="text-xs text-slate-500 sm:w-full sm:text-center">
                        © {new Date().getFullYear()} GreenLedger. All rights reserved.
                    </p>
                </div>
            </footer>
        </ScrollReveal>
    );
}
