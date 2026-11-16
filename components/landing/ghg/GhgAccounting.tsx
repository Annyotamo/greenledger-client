"use client";

/* eslint-disable @next/next/no-img-element -- the ledger's CSS sizes these images directly; sources are already resized via assets.ts */
import { useLayoutEffect, useRef, useState } from "react";
import { SiteNav, SiteFooter, fraunces, cssVars } from "../watercolor/SiteChrome";
import { SCOPE_PHOTO } from "../watercolor/assets";
import { SCOPE3_CATEGORIES } from "@/lib/scope3/data";
import { SCOPES, SCOPE_ICON, SCOPE_PHOTO_ALT, SCOPE3_ICON, type ScopeId } from "./ghgData";
import "./ghg.css";

/** A 100×100 line icon from ghgData (static, authored in this repo). */
function LineIcon({ name, className }: { name: string; className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: SCOPE_ICON[name] }}
        />
    );
}

/** The scope ledger from the landing's former Solutions section: a switcher, the scope's photograph and its activity streams. */
function ScopeLedger() {
    const [active, setActive] = useState<ScopeId>(1);
    const [ready, setReady] = useState(false);
    const tabs = useRef<HTMLDivElement>(null);
    const thumb = useRef<HTMLElement>(null);
    const scope = SCOPES.find((s) => s.id === active)!;

    // the sliding pill sits under the selected tab; it only animates after the first placement
    useLayoutEffect(() => {
        const place = () => {
            const b = tabs.current?.querySelector<HTMLElement>(`[data-s="${active}"]`);
            if (!b || !thumb.current) return;
            thumb.current.style.width = `${b.offsetWidth}px`;
            thumb.current.style.transform = `translateX(${b.offsetLeft}px)`;
        };
        place();
        document.fonts.ready.then(() => {
            place();
            setReady(true);
        });
        addEventListener("resize", place);
        return () => removeEventListener("resize", place);
    }, [active]);

    const select = (id: ScopeId, focus = false) => {
        setActive(id);
        if (focus) tabs.current?.querySelector<HTMLElement>(`[data-s="${id}"]`)?.focus();
    };

    return (
        <div className="sb">
            <div className="sb-bar">
                <div
                    ref={tabs}
                    className={ready ? "sb-switch ready" : "sb-switch"}
                    role="tablist"
                    aria-label="Emission scopes"
                    onKeyDown={(e) => {
                        const d = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key];
                        if (!d) return;
                        e.preventDefault();
                        select((((active - 1 + d + 3) % 3) + 1) as ScopeId, true);
                    }}>
                    <i ref={thumb} className="sb-thumb" aria-hidden="true"></i>
                    {SCOPES.map((s) => (
                        <button
                            key={s.id}
                            role="tab"
                            id={`sbt${s.id}`}
                            aria-controls="sbPanel"
                            aria-selected={s.id === active}
                            tabIndex={s.id === active ? 0 : -1}
                            data-s={s.id}
                            style={cssVars({ "--c": s.color })}
                            onClick={() => select(s.id)}>
                            <i></i>Scope {s.id}
                            <span>· {s.name}</span>
                        </button>
                    ))}
                </div>
                <a className="ghg-jump" href="#scope3">
                    All 15 Scope 3 categories
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M8 3v10M4 9l4 4 4-4" />
                    </svg>
                </a>
            </div>
            <div className="sb-grid" id="sbPanel" role="tabpanel" aria-labelledby={`sbt${active}`}>
                <div className="sb-glow" aria-hidden="true">
                    {SCOPES.map((s) => (
                        <img key={s.id} src={SCOPE_PHOTO[s.id]} alt="" className={s.id === active ? "on" : undefined} loading="lazy" decoding="async" />
                    ))}
                </div>
                <div className="sb-shell sb-hero">
                    <div className="sb-core">
                        {SCOPES.map((s) => (
                            <img
                                key={s.id}
                                src={SCOPE_PHOTO[s.id]}
                                alt={SCOPE_PHOTO_ALT[s.id]}
                                className={s.id === active ? "on" : undefined}
                                loading={s.id === 1 ? "eager" : "lazy"}
                                decoding="async"
                            />
                        ))}
                        <div className="scrim"></div>
                        <div className="sb-cap" aria-live="polite">
                            <div className="sb-in" key={active}>
                                <b>{scope.id}</b>
                                <h3>{scope.cat}</h3>
                                <p>
                                    {scope.banner} · {scope.id === 3 ? "15 categories" : `${scope.acts.length} activity streams`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sb-acts">
                    {scope.acts.map(([icon, title, text], i) => (
                        <div
                            key={`${active}-${icon}`}
                            className="sb-shell sb-a sb-in"
                            style={cssVars({ "--c": scope.color, animationDelay: `${90 + i * 70}ms` })}>
                            <div className="sb-core">
                                <span className="sb-ico">
                                    <LineIcon name={icon} />
                                </span>
                                <h4>{title}</h4>
                                <p>{text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function CategoryList({ title, range, type }: { title: string; range: string; type: "upstream" | "downstream" }) {
    // the app's list puts its implemented categories first; the page reads them in category order
    const cats = SCOPE3_CATEGORIES.filter((c) => c.type === type).sort((a, b) => a.id - b.id);
    return (
        <div className="s3-col">
            <h3>
                {title}
                <span>{range}</span>
            </h3>
            <ol>
                {cats.map((c) => (
                    <li className="s3-row" key={c.id} value={c.id}>
                        <span className="s3-n" aria-hidden="true">
                            {c.id}
                        </span>
                        <span className="s3-ic">
                            <LineIcon name={SCOPE3_ICON[c.id]} />
                        </span>
                        <div className="s3-t">
                            <h4>
                                <span className="sr-only">Category {c.id}: </span>
                                {c.name}
                            </h4>
                            <p>{c.description}</p>
                            {c.isImplemented && (
                                <span className="s3-tag">
                                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="m3.5 8.5 3 3 6-7" />
                                    </svg>
                                    Built-in calculator
                                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default function GhgAccounting() {
    return (
        <div className={`wl ghg ${fraunces.variable}`}>
            <SiteNav />
            <main>
                <section className="ghg-head" aria-labelledby="ghgTitle">
                    <div className="ghg-wash" aria-hidden="true"></div>
                    <div className="wrap">
                        <h1 id="ghgTitle">
                            Greenhouse Gas Scopes <em>Ledger</em>
                        </h1>
                        <p>
                            Audit-ready accounting under the GHG Protocol Corporate and Scope 3 Standards: direct combustion and process emissions, purchased electricity, heat and
                            steam, and the full value chain. Select a scope to see its activity streams and how each one is measured.
                        </p>
                    </div>
                    <div className="wrap ghg-ledger">
                        <ScopeLedger />
                    </div>
                </section>

                <section id="scope3" className="s3" aria-labelledby="s3Title">
                    <div className="wrap">
                        <div className="s3-head">
                            <h2 id="s3Title">
                                Scope 3, all fifteen <em>categories</em>
                            </h2>
                            <p>
                                The value chain as the GHG Protocol divides it: eight upstream categories for what you buy and how it reaches you, seven downstream for what happens
                                after your products leave the gate. Categories marked “Built-in calculator” have a dedicated calculator in GreenLedger.
                            </p>
                        </div>
                        <div className="s3-cols">
                            <CategoryList title="Upstream" range="Categories 1–8" type="upstream" />
                            <CategoryList title="Downstream" range="Categories 9–15" type="downstream" />
                        </div>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
