"use client";

/* eslint-disable @next/next/no-img-element -- the design's CSS sizes these images directly; sources are already resized via assets.ts */
import Link from "next/link";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { SiteNav, SiteFooter, fraunces, cssVars } from "./SiteChrome";
import { IMG, SCOPE_PHOTO, runtimeAsset } from "./assets";
import { createSandbox } from "./sandbox";
import { run } from "./runtime";
import INDIA from "./india.json";
import "./watercolor.css";

// lottie-web reads `document` on import, so it can't load during the server render; fetch it as soon as this module runs in the browser
const lottieReady = typeof window === "undefined" ? null : import("lottie-web").then((m) => m.default);

/** Solutions section: one photo panel per solution, each linking to its own page (mirrors designs/watercolor-landing.html). */
const SOLUTIONS = [
    {
        id: "cbam",
        name: "CBAM",
        note: "EU carbon border reporting",
        color: "var(--indigo)",
        href: "/cbam",
        img: SCOPE_PHOTO[3],
        alt: "A container freight train running through a forested valley",
        lede: "Installation-level embedded-emissions data for your EU buyers, verified and audit-ready, so your shipments aren't priced on punitive default values.",
        points: ["Data ingestion", "Emissions logic", "Third-party audit", "Share with buyers"],
    },
    {
        id: "brsr",
        name: "BRSR",
        note: "SEBI sustainability disclosures",
        color: "var(--ochre)",
        href: "/brsr-reporting",
        img: SCOPE_PHOTO[2],
        alt: "High-voltage transmission pylons carrying power lines across a field",
        lede: "Pre-configured Principle 6 matrices for SEBI's Business Responsibility and Sustainability Report, compiled from the activity data your teams already record.",
        points: ["Energy", "Water", "Waste", "Air"],
    },
    {
        id: "ghg",
        name: "GHG Accounting",
        note: "Scope 1, 2 and 3 inventory",
        color: "var(--moss)",
        href: "/ghg-accounting",
        img: SCOPE_PHOTO[1],
        alt: "A boiler house with two red-and-white chimneys venting steam",
        lede: "Audit-ready accounting under the GHG Protocol Corporate and Scope 3 Standards: direct combustion and process emissions, purchased electricity, heat and steam, and the full value chain.",
        points: ["Scope 1 · Direct", "Scope 2 · Indirect electricity", "Scope 3 · All 15 categories"],
    },
];

const INSIGHT_HREF = "/insights/why-reliable-esg-reporting-requires-systems-not-prompts";


/* React StrictMode (dev) mounts, unmounts and remounts effects on the same DOM. The script can't be re-run on
   markup it has already transformed, so a cleanup is deferred one tick and cancelled if the remount follows.
   Kept on globalThis so a dev hot reload of this module doesn't forget the running script and start a second copy. */
type Mounted = WeakMap<HTMLElement, { dispose: () => void; pending: number }>;
const g = globalThis as { __wlMounted?: Mounted };
const mounted: Mounted = (g.__wlMounted ??= new WeakMap());

function start(root: HTMLElement) {
    const { env, dispose } = createSandbox(root);
    const html = document.documentElement;
    let smooth: Lenis | null = null; // set once Lenis exists, so closing the intro can resume it
    // Intro loader (the design's "Loader" block, which the port leaves out of runtime.js). It runs here at mount rather than inside
    // run(), which waits for lottie, so close / Esc / "Don't show again" work from the first frame and a short video can't end unheard.
    // The page underneath stays locked until it closes.
    const loader = root.querySelector<HTMLElement>("#loader");
    const intro = loader?.querySelector<HTMLVideoElement>("#introVid");
    let introOpen = false;
    if (loader && intro) {
        const KEY = "gl_dont_show_intro_video";
        let skip = false;
        try {
            skip = localStorage.getItem(KEY) === "true";
        } catch {}
        const close = () => {
            if (!introOpen) return;
            introOpen = false;
            intro.pause();
            loader.classList.add("hide");
            html.style.overflow = "";
            smooth?.start();
            env.setTimeout(() => loader.remove(), 420);
        };
        if (location.search.includes("nointro")) loader.remove();
        else {
            introOpen = true;
            html.style.overflow = "hidden";
            if (skip) {
                loader.classList.add("quick");
                env.setTimeout(close, 450);
            } else {
                const box = loader.querySelector<HTMLInputElement>("#dontShow")!;
                const prog = loader.querySelector<HTMLElement>("#introProg")!;
                box.onchange = () => {
                    try {
                        if (box.checked) localStorage.setItem(KEY, "true");
                        else localStorage.removeItem(KEY);
                    } catch {}
                };
                loader.querySelector<HTMLElement>("#closeIntro")!.onclick = close;
                intro.onended = intro.onerror = close;
                intro.querySelector("source:last-of-type")!.addEventListener("error", close);
                intro.ontimeupdate = () => {
                    if (intro.duration) prog.style.width = `${(intro.currentTime / intro.duration) * 100}%`;
                };
                env.addEventListener("keydown", (e: Event) => {
                    const { key } = e as KeyboardEvent;
                    if (introOpen && (key === "Escape" || key === " ")) {
                        e.preventDefault();
                        close();
                    }
                });
                // React doesn't emit the `muted` attribute in server HTML, so autoplay needs it set here; if the browser still
                // refuses to autoplay, skip the intro rather than leave a frozen frame over the page
                intro.muted = true;
                intro.play().catch((e: DOMException) => e.name === "NotAllowedError" && close());
                if (intro.ended || intro.error) close();
            }
        }
    }
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // smooth scrolling for this page only; anchors routes the nav's #section links through it, and nested scroll areas
    // (pricing card backs) keep their own scroll. Reduced-motion visitors keep native scrolling.
    const lenis = reduced ? null : new Lenis({ anchors: true, allowNestedScroll: true });
    smooth = lenis;
    if (lenis && introOpen) lenis.stop();
    if (lenis) {
        // Lenis's autoRaf ticks every frame forever, which kept the page repainting at display rate (~38% main thread when idle).
        // Run frames only from a scroll input (wheel/touch, or a click that may start an anchor scroll) until Lenis settles.
        let ticking = 0;
        const tick = (t: number) => {
            lenis.raf(t);
            ticking = lenis.isScrolling ? env.requestAnimationFrame(tick) : 0;
        };
        const wake = () => {
            if (!ticking) ticking = env.requestAnimationFrame(tick);
        };
        lenis.on("virtual-scroll", wake);
        env.addEventListener("click", wake, { capture: true, passive: true });
    }
    // hero city video: plays only while the hero is on screen, and stays on its first frame for reduced-motion users
    const city = root.querySelector<HTMLVideoElement>(".hero .paperVid");
    if (city && !reduced) {
        city.muted = true;
        new env.IntersectionObserver(([e]) => (e.isIntersecting ? city.play().catch(() => {}) : city.pause())).observe(city);
    }
    const mono = getComputedStyle(root).getPropertyValue("--font-jetbrains").trim() || "monospace";
    let stopped = false;
    let lottie: Awaited<NonNullable<typeof lottieReady>> | null = null;
    lottieReady!.then((l) => {
        if (stopped) return;
        lottie = l;
        run({ ...env, lottie: l, ASSET: runtimeAsset, MONO: `${mono},monospace`, INDIA });
    });
    return () => {
        stopped = true;
        if (introOpen) html.style.overflow = ""; // leaving the page mid-intro must not leave the next page unscrollable
        lenis?.destroy();
        dispose();
        lottie?.destroy();
    };
}

export default function WatercolorLanding() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = ref.current!;
        let entry = mounted.get(root);
        if (entry?.pending) {
            window.clearTimeout(entry.pending);
            entry.pending = 0;
        } else {
            entry = { dispose: start(root), pending: 0 };
            mounted.set(root, entry);
        }
        const e = entry;
        return () => {
            e.pending = window.setTimeout(() => {
                e.dispose();
                mounted.delete(root);
            }, 0);
        };
    }, []);

    return (
        <div ref={ref} className={`wl ${fraunces.variable}`}>
            <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
                <defs>
                    <filter id="watercolor" x="-30%" y="-30%" width="160%" height="160%">
                        <feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves={4} seed={3} result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale={70} xChannelSelector="R" yChannelSelector="G" result="disp" />
                        <feGaussianBlur in="disp" stdDeviation={6} result="blur" />
                        <feTurbulence type="fractalNoise" baseFrequency=".08" numOctaves={2} seed={9} result="grain" />
                        <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 1.25" result="grainA" />
                        <feComposite in="blur" in2="grainA" operator="in" result="textured" />
                        <feMorphology in="disp" operator="erode" radius={3} result="inner" />
                        <feComposite in="disp" in2="inner" operator="out" result="rim" />
                        <feGaussianBlur in="rim" stdDeviation={2} result="rimSoft" />
                        <feMerge>
                            <feMergeNode in="textured" />
                            <feMergeNode in="rimSoft" />
                        </feMerge>
                    </filter>
                    <filter id="watercolor2" x="-30%" y="-30%" width="160%" height="160%">
                        <feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves={3} seed={17} result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale={90} xChannelSelector="G" yChannelSelector="B" result="disp" />
                        <feGaussianBlur in="disp" stdDeviation={10} />
                    </filter>
                    <filter id="watercolor-sm" x="-40%" y="-40%" width="180%" height="180%">
                        <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves={3} seed={5} result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale={10} xChannelSelector="R" yChannelSelector="G" result="d" />
                        <feGaussianBlur in="d" stdDeviation={1.2} />
                    </filter>
                    <filter id="cardSh" x="-20%" y="-30%" width="140%" height="170%">
                        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#2a2f55" floodOpacity=".12" />
                    </filter>
                    <filter id="melt" x="-10%" y="-10%" width="120%" height="120%">
                        <feTurbulence id="meltT" type="fractalNoise" baseFrequency=".011 .028" numOctaves={4} seed={3} result="n" />
                        <feDisplacementMap id="meltD" in="SourceGraphic" in2="n" scale={0} xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                    <filter id="bleed" x="-10%" y="-60%" width="120%" height="220%">
                        <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves={3} seed={2} result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale={6} xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                    <filter id="brush" x="-5%" y="-50%" width="110%" height="200%">
                        <feTurbulence type="fractalNoise" baseFrequency=".04 .4" numOctaves={3} seed={4} result="n" />
                        <feDisplacementMap in="SourceGraphic" in2="n" scale={8} />
                    </filter>
                </defs>
            </svg>

            {/* intro loader: video, "don't show again", Esc/Space to skip, progress strip */}
            <div id="loader" role="dialog" aria-label="Intro video">
                <div className="ctrl">
                    <label>
                        <input type="checkbox" id="dontShow" /> Don&apos;t show again
                    </label>
                    <button className="x" id="closeIntro" aria-label="Close intro">
                        ✕
                    </button>
                </div>
                <div className="frame">
                    <video id="introVid" muted playsInline preload="auto">
                        <source src="/GL%20video%20improved.mp4" type="video/mp4" />
                        <source src="/api/media/landing-intro" type="video/mp4" />
                    </video>
                    <div className="prog">
                        <i id="introProg"></i>
                    </div>
                </div>
                <div className="spin">
                    <div className="ring"></div>
                    <span className="mono" style={{ color: "var(--moss)" }}>
                        GreenLedger
                    </span>
                </div>
            </div>

            <SiteNav home />

            <header className="hero">
                {/* city at dusk, printed on paper: the sky dissolves into the page, towers and water stay as ink */}
                <div className="bgv bgJ">
                    <video className="paperVid" src="/media/hero-city.mp4" muted loop playsInline preload="auto" aria-hidden="true"></video>
                </div>
                <div className="wrap grid">
                    <div className="reveal">
                        <div className="mono">◦ GHG Protocol · EU CBAM · SEBI BRSR · IPCC 2006</div>
                        <h1 style={{ marginTop: 22 }}>
                            The Industrial Carbon &amp;{" "}
                            <span className="stroke">
                                <em>Resource</em>
                                <svg viewBox="0 0 200 20" preserveAspectRatio="none">
                                    <path d="M4 12 C50 4,120 18,196 8" stroke="#d9a441" strokeWidth="14" fill="none" strokeLinecap="round" opacity=".55" filter="url(#brush)" />
                                </svg>
                            </span>{" "}
                            Engine
                        </h1>
                        <p className="sub">Bridging the gap between raw plant operations and enterprise-grade compliance.</p>
                        <p className="lead">
                            GreenLedger is not an abstract corporate reporting tool; it is an engine engineered specifically for the factory floor. Instead of asking your plant
                            teams to change how they work, the platform automatically organizes your existing fuel receipts, power bills, weighbridge slips, and laboratory test
                            reports into a verified, audit-ready data stream.
                        </p>
                        <div className="supported">
                            <div className="sup-head">
                                <span className="mono">Supported by</span>
                                <i></i>
                            </div>
                            <div className="sup-row">
                                <a href="https://www.startupindia.gov.in/" target="_blank" rel="noopener">
                                    <img src={IMG.startupIndia} alt="Startup India" />
                                    <span className="nm" aria-hidden="true">Startup India</span>
                                </a>
                                <a href="https://www.entrepreneurcafe.org/" target="_blank" rel="noopener">
                                    <img src={IMG.entrepreneurCafe} alt="Entrepreneur Cafe" />
                                    <span className="nm" aria-hidden="true">Entrepreneur Cafe</span>
                                </a>
                                <a href="https://www.rpsg.in" target="_blank" rel="noopener">
                                    <img src={IMG.rpsg2} alt="RP-Sanjiv Goenka Group" />
                                    <span className="nm" aria-hidden="true">RP-Sanjiv Goenka Group</span>
                                </a>
                                <a href="https://imik.edu.in" target="_blank" rel="noopener">
                                    <img src={IMG.imi} alt="IMI Kolkata" />
                                    <span className="nm" aria-hidden="true">IMI Kolkata</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="ticker reveal" aria-label="Capabilities">
                        <div className="track" id="ticker"></div>
                    </div>
                </div>
            </header>

            <section className="fw-band" id="fwBand">
                <div className="wrap head center">
                    <span className="mono" style={{ display: "block" }}>Frameworks &amp; Standards We Cover</span>
                    <h2>Engineered for Leading Frameworks</h2>
                    <p>Stay informed with guidance inspired by leading climate, greenhouse gas, and sustainability disclosure frameworks.</p>
                </div>
                <div className="marquee">
                    <div className="track" id="marquee"></div>
                </div>
            </section>

            <section className="band" id="value">
                <div className="band-bg" aria-hidden="true">
                    <div className="lean">
                        <div className="rib r1"></div>
                        <div className="rib r2"></div>
                        <div className="rib r3"></div>
                    </div>
                </div>
                <div className="wrap pf">
                    <div className="reveal">
                        <div className="pf-head">
                            <h2>Our Value Propositions</h2>
                            <div className="mono">Your production grade esg software</div>
                        </div>
                        <div className="pf-list" id="vpTabs"></div>
                    </div>
                    <div className="pf-stage reveal" id="vp"></div>
                </div>
            </section>

            <section id="before-after">
                <div className="ba-bg" aria-hidden="true"></div>
                <div className="wrap">
                    <div className="ba-top reveal">
                        <div className="head" style={{ margin: 0 }}>
                            <div className="mono">Transformation engine / operational impact</div>
                            <h2>
                                Before GreenLedger <em>→</em> After GreenLedger
                            </h2>
                            <p>
                                See how replacing manual spreadsheet workflows with GreenLedger&apos;s financial-grade data engine turns regulatory ESG overhead into direct economic
                                returns for heavy industrial manufacturers.
                            </p>
                        </div>
                    </div>
                    <div className="cx" id="cx"></div>
                </div>
            </section>

            <section id="industries" className="inds">
                <div className="inds-bg" aria-hidden="true">
                    <div className="inds-band">
                        <img src={IMG.steel} alt="" data-k="steel" className="on" style={cssVars({ "--fy": "46%" })} loading="lazy" />
                        <img src={IMG.cement} alt="" data-k="cement" style={cssVars({ "--fy": "55%" })} loading="lazy" />
                        <img src={IMG.finance} alt="" data-k="finance" style={cssVars({ "--fy": "38%" })} loading="lazy" />
                        <img src={IMG.logistics} alt="" data-k="logistics" style={cssVars({ "--fy": "62%" })} loading="lazy" />
                        <i className="tint"></i>
                    </div>
                </div>
                <div className="wrap">
                    <div className="inds-head reveal">
                        <div>
                            <div className="mono">Industries We Serve</div>
                            <h2 style={{ marginTop: 14 }}>
                                Trusted by teams moving from compliance to <em>advantage</em>
                            </h2>
                        </div>
                        <div className="inds-side">
                            <p>
                                GreenLedger streamlines emissions tracking and carbon accounting for key industrial sectors, ensuring defensible audit trails from operations to
                                disclosures.
                            </p>
                        </div>
                    </div>
                    <div className="inds-bar reveal">
                        <button className="lr-play" id="indPlay" type="button" aria-controls="indRow" data-play="Play through industries">
                            <span className="lab">Pause</span>
                            <PlayIcons />
                        </button>
                    </div>
                    <div className="inds-row reveal" id="indRow" role="list"></div>
                </div>
            </section>

            <section id="solutions" aria-labelledby="solTitle">
                <div className="sx-bg" aria-hidden="true"></div>
                <div className="wrap">
                    <div className="sol-head reveal">
                        <h2 id="solTitle">
                            CBAM, BRSR and GHG accounting on <em>one platform</em>
                        </h2>
                        <p>Each is compiled from the activity data your teams already record, with the supporting documents attached.</p>
                    </div>
                    <div className="sb2 reveal">
                        {SOLUTIONS.map((x, i) => (
                            <article key={x.id} className={i ? "sb2-p" : "sb2-p on"} style={cssVars({ "--c": x.color })}>
                                <img src={x.img} alt={x.alt} loading="lazy" />
                                <button className="sb2-open" type="button" aria-expanded={!i} aria-controls={`sb2-${x.id}`}>
                                    <b>{x.name}</b>
                                    <small>{x.note}</small>
                                </button>
                                <div className="sb2-card" id={`sb2-${x.id}`} inert={i > 0}>
                                    <h3>{x.name}</h3>
                                    <small>{x.note}</small>
                                    <p>{x.lede}</p>
                                    <ul className="sol-pts">
                                        {x.points.map((t) => (
                                            <li key={t}>{t}</li>
                                        ))}
                                    </ul>
                                    <Link className="btn sol-go" href={x.href}>
                                        Open {x.name}
                                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M3 8h10M9 4l4 4-4 4" />
                                        </svg>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="insights" aria-labelledby="giTitle">
                <div className="sx-bg" aria-hidden="true"></div>
                <div className="wrap">
                    <div className="gi-mast reveal">
                        <h2 id="giTitle">GreenLedger Insights</h2>
                        <div className="deck">
                            <b>Latest perspective from our research team</b>
                            <p>In-depth analysis, sector-specific reports, and expert guidance on ESG reporting, regulatory carbon accounting, and data governance.</p>
                        </div>
                    </div>
                    <article className="gi reveal">
                        <div className="gi-fig">
                            <Link className="gi-img" href={INSIGHT_HREF} tabIndex={-1} aria-hidden="true">
                                <img src={IMG.insight} alt="" />
                            </Link>
                            <div className="gi-q">
                                <small>
                                    <i className="dot" style={{ background: "var(--sage)" }} aria-hidden="true"></i>Before a single page is written, organizations must answer hundreds
                                    of operational questions:
                                </small>
                                <p className="gi-qt" id="giQ" aria-live="polite">
                                    How much electricity was consumed at each facility?
                                </p>
                                <button type="button" id="giNext">
                                    Next question
                                    <Arrow size={14} />
                                    <span id="giN">1 of 9</span>
                                </button>
                            </div>
                        </div>
                        <div className="gi-body">
                            <div className="gi-meta">ESG Reporting &amp; Carbon Accounting · June 2026 · 18 min read</div>
                            <h3>
                                <Link href={INSIGHT_HREF}>Why Reliable ESG Reporting Requires Systems, Not Prompts</Link>
                            </h3>
                            <p>
                                As ESG reporting transitions to a regulated business function, organizations are discovering that generating words with AI is easy. Generating
                                trusted numbers is the real challenge.
                            </p>
                            <div className="gi-foot">
                                <span>
                                    By <b>GreenLedger Research Team</b>
                                </span>
                                <Link className="btn" href={INSIGHT_HREF}>
                                    Read full article
                                    <Arrow size={16} />
                                </Link>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            <section id="team">
                <div className="sx-bg" aria-hidden="true"></div>
                <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
                    <div className="head center reveal">
                        <div className="mono">GreenLedger Team</div>
                        <h2>
                            Led by Sustainability &amp; Technology <em>Visionaries</em>
                        </h2>
                        <p>
                            Meet the pioneers building the next generation of audit ready carbon accounting, regulatory compliance, and supply chain traceability systems.
                        </p>
                    </div>
                    <div className="team" id="teamGrid"></div>
                </div>
            </section>

            <section id="pricing">
                <div className="pr-field" aria-hidden="true">
                    <canvas></canvas>
                </div>
                <div className="wrap">
                    <div className="head center reveal">
                        <div className="mono">✦ Audit-Ready Platform Editions</div>
                        <h2>
                            Scale GreenLedger to Your <em>Operations</em>
                        </h2>
                        <p>
                            Explore our capability editions designed for every stage of your greenhouse gas accounting and sustainability journey. Find the perfect fit for your
                            organizational complexity.
                        </p>
                    </div>
                    <div className="plans reveal" id="plans"></div>
                </div>
            </section>

            <section id="deep-dive">
                <div className="wrap">
                    <div className="lr-top reveal">
                        <div className="head">
                            <h2>The longer read</h2>
                            <p>
                                How we think about the problem. Pick any topic for plain language context; this is the layer executives share with boards when they need more than a
                                feature list.
                            </p>
                        </div>
                        <button className="lr-play" id="lrPlay" type="button" aria-controls="lrPane" data-play="Play through topics">
                            <PlayIcons />
                            <span className="lab">Play through topics</span>
                        </button>
                    </div>
                    <div className="lr reveal">
                        <div className="lr-list" id="lrList" role="tablist" aria-label="Topics" aria-orientation="vertical"></div>
                        <article className="lr-pane" id="lrPane" role="tabpanel" tabIndex={0}></article>
                    </div>
                </div>
            </section>

            <SiteFooter home />
        </div>
    );
}

function PlayIcons() {
    return (
        <span className="icw">
            <svg className="ring" viewBox="0 0 50 50" aria-hidden="true">
                <circle className="trk" cx="25" cy="25" r="23" />
                <circle className="bar" cx="25" cy="25" r="23" pathLength={1} />
            </svg>
            <svg className="ic i-play" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 2.6v10.8a.8.8 0 0 0 1.2.7l8.6-5.4a.8.8 0 0 0 0-1.4L5.2 1.9a.8.8 0 0 0-1.2.7z" />
            </svg>
            <svg className="ic i-pause" viewBox="0 0 16 16" aria-hidden="true">
                <rect x="3.5" y="2.5" width="3" height="11" rx="1" />
                <rect x="9.5" y="2.5" width="3" height="11" rx="1" />
            </svg>
        </span>
    );
}

function Arrow({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
    );
}
