"use client";

/**
 * Public BRSR page (/brsr-reporting; /brsr is the tenant app), in the watercolour paper system of the landing, CBAM and GHG pages.
 * Copy is the landing's BRSR section and the two BRSR-related before/after entries from the landing's CBAM walkthrough.
 */
import { useState } from "react";
import { SiteNav, SiteFooter, fraunces, cssVars, navIcon } from "../watercolor/SiteChrome";
import { BRSR } from "./brsrData";
import "./brsr.css";

const SHIFTS = [
    {
        title: "BRSR Principle 6 Automation",
        before: ["3-week crunch per filing cycle", "Energy, water, waste, and air data gathered in disconnected files and manually reformatted under deadline pressure."],
        after: ["Continuous BRSR Principle 6 engine", "Environmental figures automatically aggregate into BRSR Principle 6 templates ready when filing opens."],
        impact: "Save 120+ Hours / Cycle",
        benefit: "Reduces filing scramble from weeks to hours",
    },
    {
        title: "Unified Air Emissions",
        before: ["Air emissions handled separately", "NOx, SOx, and particulate matter tracked outside carbon inventory on separate spreadsheets with duplicate effort."],
        after: ["Air emissions co-located with GHG data", "Reports air emissions alongside Scope 1–3 environmental datasets in one unified operational workflow."],
        impact: "Single Reporting Track",
        benefit: "Eliminates duplicate system & filing overhead",
    },
];

/** Module switcher: the landing's BRSR tabs and Principle 6 sheet, driven by React here instead of runtime.js. */
function Modules() {
    const [active, setActive] = useState(0);
    const select = (i: number, focus = false) => {
        setActive(i);
        if (focus) document.getElementById(`brt-${BRSR[i].id}`)?.focus();
    };
    const m = BRSR[active];
    return (
        <div className="wrap br">
            <div
                className="br-tabs"
                role="tablist"
                aria-label="BRSR environmental modules"
                onKeyDown={(e) => {
                    const d = ({ ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 } as Record<string, number>)[e.key];
                    if (!d) return;
                    e.preventDefault();
                    select((active + d + BRSR.length) % BRSR.length, true);
                }}>
                {BRSR.map((t, i) => (
                    <button
                        key={t.id}
                        className="br-tab"
                        role="tab"
                        id={`brt-${t.id}`}
                        aria-controls="brp"
                        aria-selected={i === active}
                        tabIndex={i === active ? 0 : -1}
                        style={cssVars({ "--c": t.color })}
                        onClick={() => select(i)}>
                        <span className="ic">{navIcon(t.icon)}</span>
                        <b>{t.title}</b>
                        <small>{t.summary}</small>
                    </button>
                ))}
            </div>
            <article key={m.id} className="br-sheet" role="tabpanel" id="brp" aria-labelledby={`brt-${m.id}`} style={cssVars({ "--c": m.color })}>
                <div className="br-sh">
                    <h3>{m.title}</h3>
                    <span>Principle 6 · Environment</span>
                </div>
                {m.groups.map(([label, rows]) => (
                    <div className="br-g" key={label}>
                        <h4>{label}</h4>
                        {rows.map(([name, unit]) => (
                            <div className="br-row" key={name}>
                                {name}
                                <span className="u">{unit}</span>
                            </div>
                        ))}
                    </div>
                ))}
                <p className="br-foot">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 11.5 12.5 19a5 5 0 0 1-7-7l7.5-7.5a3.3 3.3 0 0 1 4.7 4.7l-7.4 7.4a1.7 1.7 0 0 1-2.4-2.4L14.5 7.5" />
                    </svg>
                    Supporting documents travel with every figure into the report.
                </p>
            </article>
        </div>
    );
}

export default function BrsrPage() {
    return (
        <div className={`wl brsr ${fraunces.variable}`}>
            <SiteNav />
            <main>
                <section className="brsr-head" aria-labelledby="brsrTitle">
                    <div className="brsr-wash" aria-hidden="true"></div>
                    <div className="wrap">
                        <h1 id="brsrTitle">
                            BRSR reporting, ready from the <em>plant floor</em>
                        </h1>
                        <p>
                            Pre-configured Principle 6 matrices for SEBI&apos;s Business Responsibility and Sustainability Report. Energy, water, waste and air are compiled from the
                            activity data your teams already record, with the supporting documents attached.
                        </p>
                    </div>
                    <div className="brsr-modules">
                        <Modules />
                    </div>
                </section>

                <section className="brsr-shift" aria-labelledby="shiftTitle">
                    <div className="wrap">
                        <h2 id="shiftTitle">
                            From filing scramble to <em>filing ready</em>
                        </h2>
                        {SHIFTS.map((s) => (
                            <article className="bs-row" key={s.title}>
                                <h3>{s.title}</h3>
                                <div className="bs-col b">
                                    <small>Before GreenLedger</small>
                                    <h4>{s.before[0]}</h4>
                                    <p>{s.before[1]}</p>
                                </div>
                                <div className="bs-col a">
                                    <small>After GreenLedger</small>
                                    <h4>{s.after[0]}</h4>
                                    <p>{s.after[1]}</p>
                                </div>
                                <p className="bs-out">
                                    <b>{s.impact}</b>
                                    {s.benefit}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="brsr-cta" aria-labelledby="brsrCta">
                    <div className="wrap">
                        <h2 id="brsrCta">
                            Ready when <em>filing opens</em>
                        </h2>
                        <a className="btn" href="#contact">
                            Book demo
                        </a>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
