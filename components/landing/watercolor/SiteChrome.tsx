"use client";

/* eslint-disable @next/next/no-img-element -- the design's CSS sizes these images directly; sources are already resized via assets.ts */
/**
 * Navbar and footer shared by the public pages (landing, GHG Accounting, CBAM).
 * On the landing (`home`), runtime.js drives them, exactly as the design file does, so no React behaviour is attached.
 * On other pages, small effects here do the same jobs: contract on scroll, the Solutions dropdown, the footer reveal.
 */
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Fraunces } from "next/font/google";
import { useCookieConsentStore } from "@/stores/cookie-consent-store";
import { IMG } from "./assets";
import "./watercolor.css";

export const fraunces = Fraunces({
    subsets: ["latin"],
    variable: "--font-fraunces",
    style: ["normal", "italic"],
    axes: ["opsz"],
    display: "swap",
});

export const cssVars = (v: Record<string, string | number>) => v as CSSProperties;

export const navIcon = (d: ReactNode) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {d}
    </svg>
);

/** Solutions dropdown: each solution has its own page. */
const SOLUTIONS = [
    {
        href: "/cbam",
        title: "CBAM",
        note: "EU carbon border reporting",
        color: "var(--indigo)",
        icon: navIcon(
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
            </>,
        ),
    },
    {
        href: "/brsr-reporting",
        title: "BRSR",
        note: "SEBI sustainability disclosures",
        color: "var(--ochre)",
        icon: navIcon(
            <>
                <rect x="5" y="4" width="14" height="17" rx="2" />
                <path d="M9 3h6v3H9zM9 13l2 2 4-4" />
            </>,
        ),
    },
    {
        href: "/ghg-accounting",
        title: "GHG Accounting",
        note: "Scope 1, 2 and 3 inventory",
        color: "var(--moss)",
        icon: navIcon(<path d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 9.1 4.5 4.5 0 0 0 7 18z" />),
    },
];

const LINKS = [
    ["value", "Platform"],
    ["industries", "Industries"],
    ["solutions"],
    ["insights", "Insights"],
    ["team", "Team"],
    ["pricing", "Pricing"],
];

export function SiteNav({ home = false }: { home?: boolean }) {
    const nav = useRef<HTMLElement>(null);
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const at = (id: string) => (home ? `#${id}` : `/#${id}`);

    useEffect(() => {
        if (home) return;
        const el = nav.current!,
            box = el.querySelector<HTMLElement>(".links")!,
            ind = box.querySelector<HTMLElement>(".ind")!,
            trigger = box.querySelector<HTMLElement>(".dd-t")!;
        // on its own pages the Solutions trigger carries the active pill, measured from the pill's own box
        const place = () => {
            const r = trigger.getBoundingClientRect(),
                b = box.getBoundingClientRect();
            ind.style.left = `${r.left - b.left - box.clientLeft}px`;
            ind.style.width = `${r.width}px`;
            ind.classList.add("on");
        };
        const onScroll = () => setScrolled(scrollY > 24);
        onScroll();
        place();
        addEventListener("scroll", onScroll, { passive: true });
        addEventListener("resize", place);
        el.addEventListener("transitionend", place);
        return () => {
            removeEventListener("scroll", onScroll);
            removeEventListener("resize", place);
            el.removeEventListener("transitionend", place);
        };
    }, [home]);

    const menu = (
        <div className="dd-menu" id="ddSol">
            {SOLUTIONS.map((s) => {
                const inner = (
                    <>
                        <span className="ic">{s.icon}</span>
                        <b>{s.title}</b>
                        <small>{s.note}</small>
                    </>
                );
                return (
                    <Link key={s.href} href={s.href} style={cssVars({ "--c": s.color })} onClick={() => setOpen(false)}>
                        {inner}
                    </Link>
                );
            })}
        </div>
    );

    const trigger = (
        <button
            className={home ? "dd-t" : "dd-t active"}
            type="button"
            aria-expanded={home ? false : open}
            aria-controls="ddSol"
            data-sec="#solutions"
            onClick={home ? undefined : () => setOpen((o) => !o)}>
            Solutions
            <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m2 3.5 3 3 3-3" />
            </svg>
        </button>
    );

    return (
        <nav ref={nav} className={scrolled ? "top scrolled" : "top"} aria-label="Main">
            {home ? (
                <a className="glass logo" href="#">
                    <img src={IMG.logo} alt="" />
                    <span>GreenLedger</span>
                </a>
            ) : (
                <Link className="glass logo" href="/">
                    <img src={IMG.logo} alt="" />
                    <span>GreenLedger</span>
                </Link>
            )}
            <div className="glass links">
                <i className="ind" aria-hidden="true"></i>
                {LINKS.map(([id, label]) =>
                    id === "solutions" ? (
                        <div
                            key={id}
                            className={open ? "dd open" : "dd"}
                            onMouseLeave={home ? undefined : () => setOpen(false)}
                            onKeyDown={home ? undefined : (e) => e.key === "Escape" && setOpen(false)}
                            onBlur={home ? undefined : (e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}>
                            {trigger}
                            {menu}
                        </div>
                    ) : (
                        <a key={id} href={at(id)}>
                            {label}
                        </a>
                    ),
                )}
            </div>
            <div className="glass navbtns">
                <Link className="login" href="/login">
                    Client login
                </Link>
                <a className="btn" href="#contact">
                    Book demo
                </a>
            </div>
        </nav>
    );
}

export function SiteFooter({ home = false }: { home?: boolean }) {
    const foot = useRef<HTMLElement>(null);
    const [shown, setShown] = useState(false);

    // off the landing, reveal the sheet and run the sky video while the footer is on screen (the landing's runtime does this there)
    useEffect(() => {
        if (home) return;
        const f = foot.current!,
            v = f.querySelector("video")!,
            still = matchMedia("(prefers-reduced-motion: reduce)").matches;
        v.muted = true;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setShown(true);
                    if (!still) v.play().catch(() => {});
                } else v.pause();
            },
            { rootMargin: "0px 0px -15% 0px" },
        );
        io.observe(f);
        return () => {
            io.disconnect();
            v.pause();
        };
    }, [home]);

    const openCookiePrefs = (ev: React.MouseEvent) => {
        ev.preventDefault();
        useCookieConsentStore.getState().setOpen(true);
    };

    return (
        <footer id="foot" ref={foot} className={shown ? "in" : undefined}>
            <div className="f-media" aria-hidden="true">
                <video
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260820_010308_b1636845-4c15-4ab6-b0c9-9a29bfb0c6e3.mp4"
                    muted
                    loop
                    playsInline
                    preload="none"></video>
            </div>
            <div className="wrap">
                <div className="f-sheet">
                    <div className="f-head">
                        <Link className="f-brand f-fade" style={cssVars({ "--i": 0 })} href="/">
                            <img src={IMG.logo} alt="" />
                            GreenLedger
                        </Link>
                        <p className="f-lede f-fade" style={cssVars({ "--i": 1 })}>
                            ESG reporting, carbon accounting, and supply chain traceability on one platform designed for audit ready enterprises and consumer-trusted brands.
                        </p>
                    </div>
                    <div className="f-body">
                        <nav className="f-nav f-fade" style={cssVars({ "--i": 2 })} aria-label="Footer">
                            <Link href="/cbam">CBAM Compliance</Link>
                            <Link href="/ghg-accounting">GHG Accounting</Link>
                            <Link href="/brsr-reporting">BRSR Reporting</Link>
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                            <a href="#">Security</a>
                            <a href="#" onClick={openCookiePrefs}>
                                Cookie Preferences
                            </a>
                            <a href="#contact">Contact</a>
                        </nav>
                        <div className="f-right">
                            <div className="f-blk f-fade" id="contact" style={cssVars({ "--i": 3, scrollMarginTop: "110px" })}>
                                <h4>Connect &amp; Inquiries</h4>
                                <p>Have questions or need enterprise onboarding? Reach out to our advisory team directly.</p>
                                <div className="f-reach">
                                    <a href="mailto:sayan@redswitchglobal.com">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <rect x="3" y="5" width="18" height="14" rx="2" />
                                            <path d="m3 7 9 6 9-6" />
                                        </svg>
                                        sayan@redswitchglobal.com
                                    </a>
                                    <a href="tel:+919831076943">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                                        </svg>
                                        +91 98310 76943
                                    </a>
                                </div>
                            </div>
                            <div className="f-blk f-fade" style={cssVars({ "--i": 4 })}>
                                <h4>Certifications</h4>
                                <div className="f-names">
                                    <a href="https://www.servicesepc.org/" target="_blank" rel="noopener">
                                        Service Export Promotion Council (SEPC) India
                                    </a>
                                    <a href="https://www.iso.org/standard/27001" target="_blank" rel="noopener">
                                        ISO 27001
                                    </a>
                                </div>
                                <div className="f-logos">
                                    <a href="https://www.servicesepc.org/" target="_blank" rel="noopener">
                                        <img src={IMG.sepc} alt="SEPC certification" />
                                    </a>
                                    <a href="https://www.iso.org/standard/27001" target="_blank" rel="noopener">
                                        <img src={IMG.iso} alt="ISO 27001 certification" />
                                    </a>
                                </div>
                            </div>
                            <div className="f-blk wide f-fade" style={cssVars({ "--i": 5 })}>
                                <h4>Supported by</h4>
                                <div className="f-names">
                                    <a href="https://www.startupindia.gov.in/" target="_blank" rel="noopener">
                                        Startup India
                                    </a>
                                    <a href="https://www.entrepreneurcafe.org/" target="_blank" rel="noopener">
                                        Entrepreneur Cafe
                                    </a>
                                    <a href="https://www.rpsg.in" target="_blank" rel="noopener">
                                        RP-Sanjiv Goenka Group (IMI Kolkata)
                                    </a>
                                </div>
                                <div className="f-logos">
                                    <a href="https://www.startupindia.gov.in/" target="_blank" rel="noopener">
                                        <img src={IMG.startupIndia} alt="Startup India" />
                                    </a>
                                    <a href="https://www.entrepreneurcafe.org/" target="_blank" rel="noopener">
                                        <img src={IMG.entrepreneurCafe} alt="Entrepreneur Cafe" />
                                    </a>
                                    <a href="https://www.rpsg.in" target="_blank" rel="noopener">
                                        <img src={IMG.rpsg3} alt="RP-Sanjiv Goenka Group (IMI Kolkata)" />
                                    </a>
                                    <a href="https://imik.edu.in" target="_blank" rel="noopener">
                                        <img src={IMG.imi} alt="IMI Kolkata" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="f-word" aria-hidden="true">
                        {"GreenLedger".split("").map((ch, i) => (
                            <span key={i} style={cssVars({ "--i": i })}>
                                {ch}
                            </span>
                        ))}
                    </p>
                </div>
                <div className="copy">
                    <span>© 2026 GreenLedger. All rights reserved.</span>
                    <a href="#">Back to top ↑</a>
                </div>
            </div>
        </footer>
    );
}
