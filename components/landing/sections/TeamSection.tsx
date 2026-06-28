"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import team1 from "@/assets/team/Carousel Sample SM1.png";
import team2 from "@/assets/team/team-2.jpg";

interface TeamMember {
    name: string;
    role: string;
    description: string;
    image: any;
    linkedin?: string;
    email?: string;
}

const teamMembers: TeamMember[] = [
    {
        name: "Sayan Maitra",
        role: "Founder & CEO, GreenLedger, CEO",
        description:
            "Sayan Maitra is a sustainability and business intelligence leader with over a decade of experience helping organizations transform ESG reporting through technology and data-driven decision making. Recognized as Global Sustainability Leader 2026 by The CEO Magazine and Top Icon of India 2024 by Business Talkz, he has collaborated with organizations including PwC, CII, and Fujisoft to deliver ESG, sustainability, and digital transformation initiatives across India and the GCC. His expertise spans ESG intelligence, predictive analytics, carbon accounting, and scalable enterprise solutions.",
        image: team1,
        linkedin: "https://linkedin.com/in/sayanmaitra",
        email: "sayan@redswitch.co",
    },
    {
        name: "Subhash Kumar Das",
        role: "Senior Sustainability Expert, Sustainability Strategy Advisor",
        description:
            "Subhash Kumar Das is the former Executive Director (Logistics & Infrastructure) at SAIL with over 35 years of leadership in steel manufacturing, sustainability, logistics, and industrial operations. A B.E. (BIT Mesra) and M.Tech (NIT Durgapur) graduate, he led SAIL's BRSR implementation, CO₂ reduction roadmap, and Green Steel initiatives under the Ministry of Steel. He is a recipient of the Kalinga Best Environment Engineer Award, Golden Peacock Sustainability Award, and serves as a Research Council Member at CSIR–NEERI.",
        image: team2,
        linkedin: "https://linkedin.com/in/subhashkumardas",
        email: "subhash@redswitch.co",
    },
];

// Precompute DNA/Helix wave path parameters (asymmetric and modulated)
const width = 1800;
const height = 180;

const amplitude1 = 38;
const wavelength1 = 450;
const amplitude2 = 24;
const wavelength2 = 300;
const phaseShift = 1.5;

const points1: string[] = [];
const points2: string[] = [];
const rungs: Array<{ x: number; y1: number; y2: number }> = [];

for (let x = 0; x <= width; x += 10) {
    const radians1 = (x / wavelength1) * Math.PI * 2;
    const modulation1 = Math.cos((x / width) * Math.PI * 2);
    const y1 = height / 2 - 10 + amplitude1 * Math.sin(radians1) * (0.6 + 0.4 * modulation1);

    const radians2 = (x / wavelength2) * Math.PI * 2 + phaseShift;
    const modulation2 = Math.cos((x / width) * Math.PI * 4);
    const y2 = height / 2 + 10 + amplitude2 * Math.sin(radians2) * (0.7 + 0.3 * modulation2);

    const y1Fixed = Number(y1.toFixed(3));
    const y2Fixed = Number(y2.toFixed(3));

    points1.push(`${x},${y1Fixed}`);
    points2.push(`${x},${y2Fixed}`);

    // Create connector rungs every 40 units
    if (x % 40 === 0 && x > 0 && x < width) {
        rungs.push({ x, y1: y1Fixed, y2: y2Fixed });
    }
}

const path1 = `M ${points1.join(" L ")}`;
const path2 = `M ${points2.join(" L ")}`;

export default function TeamSection() {
    const [isAnyHovered, setIsAnyHovered] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Dynamic styles for the offset particles using generated paths (apply client-side only to avoid browser style normalization mismatch during hydration)
    const particleStyles = mounted ? {
        p1a: { offsetPath: `path('${path1}')`, animationDelay: '0s' },
        p1b: { offsetPath: `path('${path1}')`, animationDelay: '-10s' },
        p2a: { offsetPath: `path('${path2}')`, animationDelay: '-4s' },
        p2b: { offsetPath: `path('${path2}')`, animationDelay: '-14s' },
    } : {
        p1a: {},
        p1b: {},
        p2a: {},
        p2b: {},
    };

    return (
        <section id="team" className="scroll-mt-24 mb-20 relative w-full">
            {/* Ambient background blur elements matching rest of landing page */}
            <div className="absolute -left-12 -top-6 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
            <div className="absolute -right-12 bottom-6 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

            {/* Helix Background Abstract Design */}
            <div className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-screen h-80 pointer-events-none -z-10 overflow-hidden transition-all duration-700 ${isAnyHovered ? "opacity-65 scale-y-105" : "opacity-35"}`}>
                <div className={`w-[200%] h-full flex flex-row helix-track ${isAnyHovered ? "helix-hovered" : ""}`}>

                    {/* Render two identical wave groups side by side for a seamless marquee loop */}
                    {[1, 2].map((groupNum) => (
                        <div key={groupNum} className="w-1/2 h-full flex-none relative helix-container">
                            <svg
                                viewBox="0 0 1800 180"
                                preserveAspectRatio="none"
                                className="w-full h-full text-emerald-600/30"
                            >
                                <defs>
                                    <linearGradient id="wave1-grad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="rgba(16, 185, 129, 0.3)" />
                                        <stop offset="50%" stopColor="rgba(52, 211, 153, 0.7)" />
                                        <stop offset="100%" stopColor="rgba(5, 150, 105, 0.3)" />
                                    </linearGradient>
                                    <linearGradient id="wave2-grad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="rgba(6, 182, 212, 0.3)" />
                                        <stop offset="50%" stopColor="rgba(34, 211, 238, 0.7)" />
                                        <stop offset="100%" stopColor="rgba(8, 145, 178, 0.3)" />
                                    </linearGradient>
                                    <linearGradient id="rung-grad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.35" />
                                    </linearGradient>
                                    <filter id="helix-glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                                        <feMerge>
                                            <feMergeNode in="blur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>

                                {/* Connector Rungs */}
                                {rungs.map((rung, i) => (
                                    <line
                                        key={i}
                                        x1={rung.x}
                                        y1={rung.y1}
                                        x2={rung.x}
                                        y2={rung.y2}
                                        stroke="url(#rung-grad)"
                                        strokeWidth={1.5}
                                        strokeDasharray="3,3"
                                    />
                                ))}

                                {/* Wave 1 Path */}
                                <path
                                    d={path1}
                                    fill="none"
                                    stroke="url(#wave1-grad)"
                                    strokeWidth={3}
                                    strokeLinecap="round"
                                    filter="url(#helix-glow)"
                                />

                                {/* Wave 2 Path */}
                                <path
                                    d={path2}
                                    fill="none"
                                    stroke="url(#wave2-grad)"
                                    strokeWidth={3}
                                    strokeLinecap="round"
                                    filter="url(#helix-glow)"
                                />

                                {/* Glowing particle sparkles tracing the asymmetrical paths */}
                                <circle
                                    r="4"
                                    fill="#34d399"
                                    className="helix-particle text-emerald-400"
                                    style={particleStyles.p1a}
                                />
                                <circle
                                    r="3"
                                    fill="#6ee7b7"
                                    className="helix-particle text-emerald-300"
                                    style={particleStyles.p1b}
                                />
                                <circle
                                    r="4"
                                    fill="#22d3ee"
                                    className="helix-particle text-cyan-400"
                                    style={particleStyles.p2a}
                                />
                                <circle
                                    r="3"
                                    fill="#67e8f9"
                                    className="helix-particle text-cyan-300"
                                    style={particleStyles.p2b}
                                />
                            </svg>
                        </div>
                    ))}
                </div>
            </div>

            {/* Header Content */}
            <div className="mb-12 text-center md:text-left max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-emerald-800 border border-emerald-200/50 mb-3 font-mono">
                    GreenLedger Team
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl font-headline-lg">
                    Led by Sustainability &amp; Technology Visionaries
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base font-body-lg">
                    Meet the pioneers building the next generation of audit ready carbon accounting, regulatory compliance, and supply chain traceability systems.
                </p>
            </div>

            {/* Grid of Team Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto py-4">
                {teamMembers.map((member) => (
                    <div
                        key={member.name}
                        className="card-flip-container w-full h-[520px] group cursor-pointer"
                        onMouseEnter={() => setIsAnyHovered(true)}
                        onMouseLeave={() => setIsAnyHovered(false)}
                    >
                        <div className="card-flip-inner preserve-3d w-full h-full duration-700 relative">

                            {/* Front Side */}
                            <div className="card-flip-front backface-hidden absolute inset-0 w-full h-full border border-emerald-950/10 bg-white/75 shadow-lg backdrop-blur-md p-6 flex flex-col justify-between items-center text-center">
                                {/* Elegant border shimmer */}
                                <div className="gl-shimmer-border absolute inset-0 rounded-lg pointer-events-none" />
                                <div className="gl-grain" />

                                {/* Avatar Container */}
                                <div className="w-56 h-56 rounded-xl overflow-hidden relative group-hover:border-emerald-400/40 transition-colors duration-500 mt-6 z-10">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        sizes="224px"
                                        className="object-contain scale-90 rounded-xl transition-transform duration-700 ease-out group-hover:scale-95"
                                        priority
                                    />
                                </div>

                                {/* Typography / Details */}
                                <div className="flex-1 flex flex-col justify-center px-2 z-10">
                                    <h3 className="text-xl md:text-2xl font-bold text-emerald-950 font-headline-md tracking-tight">
                                        {member.name}
                                    </h3>
                                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50/80 border border-emerald-200/50 px-3 py-1 rounded-full uppercase tracking-wider font-mono inline-block mt-3 max-w-xs mx-auto text-center">
                                        {member.role.split(",")[0]}
                                    </span>
                                    <p className="text-[10px] text-emerald-600/70 font-mono tracking-wider mt-1.5 uppercase">
                                        {member.role.split(",").slice(1).join(",") || ""}
                                    </p>
                                </div>

                                {/* Bottom flip prompt */}
                                <div className="mb-4 flex items-center justify-center gap-1.5 text-[10px] tracking-widest text-emerald-700/60 font-mono uppercase z-10">
                                    <span>Hover to read profile</span>
                                    <svg
                                        className="h-3.5 w-3.5 fill-current animate-pulse text-emerald-600"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Back Side */}
                            <div className="card-flip-back backface-hidden rotate-y-180 absolute inset-0 w-full h-full bg-gradient-to-br from-[#021f18] via-[#053226] to-[#0a4837] border border-emerald-500/25 shadow-2xl p-7 flex flex-col justify-between text-white">
                                <div className="gl-grain" />

                                {/* Upper Section Info */}
                                <div className="flex items-center justify-between pb-3 border-b border-emerald-800/40 z-10">
                                    <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
                                        Leadership Profile
                                    </span>
                                    <span className="text-[10px] font-mono font-bold text-emerald-300">
                                        GL / MEMBERS
                                    </span>
                                </div>

                                {/* Bio Scroll Pane */}
                                <div className="flex-1 py-4 overflow-y-auto scrollbar-hide z-10 text-left">
                                    <p className="text-xs sm:text-sm leading-relaxed text-emerald-100/90 font-sans font-normal antialiased">
                                        {member.description}
                                    </p>
                                </div>

                                {/* Bottom Info / Links */}
                                <div className="pt-4 border-t border-emerald-800/40 z-10 flex items-center justify-between">
                                    <div className="min-w-0">
                                        <h4 className="text-lg font-bold font-headline-md text-white truncate">
                                            {member.name}
                                        </h4>
                                        <p className="text-[10px] text-emerald-300 font-mono tracking-wide mt-0.5 truncate uppercase">
                                            {member.role}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <a
                                            href={member.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="h-8 w-8 rounded-full bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-300 hover:bg-emerald-800 hover:text-white transition-all duration-200"
                                            title="LinkedIn Profile"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
