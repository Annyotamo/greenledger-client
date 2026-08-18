"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { cn } from "@/lib/utils/cn";
import { SCOPE3_CATEGORIES, Scope3Category, Scope3ViewMode } from "@/lib/scope3/data";

interface Scope3NavbarProps {
    currentViewMode?: Scope3ViewMode;
    onViewModeChange?: (mode: Scope3ViewMode) => void;
}

export function Scope3Navbar({ currentViewMode = "operational", onViewModeChange }: Scope3NavbarProps) {
    const pathname = usePathname();
    const [viewMode, setViewMode] = useState<Scope3ViewMode>(currentViewMode);
    const [activeFlyout, setActiveFlyout] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    const handleViewChange = (mode: Scope3ViewMode) => {
        setViewMode(mode);
        if (onViewModeChange) onViewModeChange(mode);
        setActiveFlyout(null);
    };

    // Close flyout when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setActiveFlyout(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Group categories for View 1: Operational vs. Product Focus
    const view1Groups = [
        {
            name: "Corporate & Operations",
            icon: "business_center",
            description: "Internal operations, travel, commuting, waste & capital assets",
            categories: SCOPE3_CATEGORIES.filter((c) => c.view1Group === "Corporate & Operations"),
        },
        {
            name: "Supply Chain & Goods",
            icon: "inventory_2",
            description: "Raw materials, purchased services & upstream transport",
            categories: SCOPE3_CATEGORIES.filter((c) => c.view1Group === "Supply Chain & Goods"),
        },
        {
            name: "Product Lifecycle",
            icon: "all_inclusive",
            description: "Processing, downstream transport, product use & disposal",
            categories: SCOPE3_CATEGORIES.filter((c) => c.view1Group === "Product Lifecycle"),
        },
        {
            name: "Business Model",
            icon: "account_tree",
            description: "Leased assets, franchises & investment portfolio",
            categories: SCOPE3_CATEGORIES.filter((c) => c.view1Group === "Business Model"),
        },
    ];

    // Group categories for View 2: Basic Upstream vs. Downstream
    const view2Sections = [
        {
            name: "Upstream (Supply Chain)",
            icon: "arrow_circle_up",
            description: "Tier-1 to Tier-N supply chain emissions before company boundary",
            subgroups: [
                {
                    title: "Procurement & Assets",
                    categories: SCOPE3_CATEGORIES.filter(
                        (c) => c.view2Section === "Upstream (Supply Chain)" && c.view2Subgroup === "Procurement & Assets",
                    ),
                },
                {
                    title: "Logistics & Energy",
                    categories: SCOPE3_CATEGORIES.filter(
                        (c) => c.view2Section === "Upstream (Supply Chain)" && c.view2Subgroup === "Logistics & Energy",
                    ),
                },
                {
                    title: "Workforce & Waste",
                    categories: SCOPE3_CATEGORIES.filter(
                        (c) => c.view2Section === "Upstream (Supply Chain)" && c.view2Subgroup === "Workforce & Waste",
                    ),
                },
            ],
        },
        {
            name: "Downstream (Product & Market)",
            icon: "arrow_circle_down",
            description: "Emissions after product sale across user lifecycle & investments",
            subgroups: [
                {
                    title: "Product Use Phase",
                    categories: SCOPE3_CATEGORIES.filter(
                        (c) => c.view2Section === "Downstream (Product & Market)" && c.view2Subgroup === "Product Use Phase",
                    ),
                },
                {
                    title: "Logistics & Expansion",
                    categories: SCOPE3_CATEGORIES.filter(
                        (c) => c.view2Section === "Downstream (Product & Market)" && c.view2Subgroup === "Logistics & Expansion",
                    ),
                },
                {
                    title: "Finance",
                    categories: SCOPE3_CATEGORIES.filter(
                        (c) => c.view2Section === "Downstream (Product & Market)" && c.view2Subgroup === "Finance",
                    ),
                },
            ],
        },
    ];

    return (
        <div
            ref={navRef}
            className="sticky top-16 z-30 w-[calc(100%+2*var(--spacing-gutter))] -mx-gutter -mt-6 mb-6 border-b border-outline-variant/50 bg-surface-container/70 backdrop-blur-xl shadow-xs transition-all duration-200">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
                {/* Upper Bar: Title & View Switcher */}
                <div className="flex flex-col gap-2 py-2 md:flex-row md:items-center md:justify-between border-b border-outline-variant/30">
                    <div className="flex items-center gap-2.5">
                        <Link href="/scope-3" className="flex items-center gap-2 group">
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary/10 text-secondary transition-transform group-hover:scale-105">
                                <MaterialIcon name="hub" size="sm" className="text-secondary" />
                            </div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xs font-bold text-primary tracking-tight font-mono">Scope 3 Value Chain</h2>
                                <span className="rounded bg-secondary/15 px-1.5 py-0.2 font-mono text-[9px] font-bold text-secondary uppercase tracking-wider">
                                    Cat 1–15
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* View Mode Switcher Pill */}
                    <div className="flex items-center gap-2 self-start md:self-auto">
                        <span className="font-mono text-[10px] font-medium text-on-surface-variant hidden sm:inline-block">
                            View:
                        </span>
                        <div className="relative flex items-center rounded-lg bg-surface-container-high/90 p-0.5 border border-outline-variant/40">
                            <button
                                type="button"
                                onClick={() => handleViewChange("operational")}
                                className={cn(
                                    "relative z-10 flex items-center gap-1 rounded-md px-2.5 py-1 font-mono text-[10px] font-semibold transition-colors duration-150",
                                    viewMode === "operational" ? "text-primary shadow-2xs font-bold" : "text-on-surface-variant hover:text-on-surface",
                                )}>
                                {viewMode === "operational" && (
                                    <motion.div
                                        layoutId="scope3-view-pill-active"
                                        className="absolute inset-0 z-[-1] rounded-md bg-surface-container-lowest"
                                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                                    />
                                )}
                                <MaterialIcon name="grid_view" size="sm" className="!text-[14px] text-secondary" />
                                <span>Operational vs. Product</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleViewChange("upstream_downstream")}
                                className={cn(
                                    "relative z-10 flex items-center gap-1 rounded-md px-2.5 py-1 font-mono text-[10px] font-semibold transition-colors duration-150",
                                    viewMode === "upstream_downstream" ? "text-primary shadow-2xs font-bold" : "text-on-surface-variant hover:text-on-surface",
                                )}>
                                {viewMode === "upstream_downstream" && (
                                    <motion.div
                                        layoutId="scope3-view-pill-active"
                                        className="absolute inset-0 z-[-1] rounded-md bg-surface-container-lowest"
                                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                                    />
                                )}
                                <MaterialIcon name="swap_vert" size="sm" className="!text-[14px] text-tertiary" />
                                <span>Upstream vs. Downstream</span>
                            </button>
                        </div>

                        {/* Mobile Drawer Button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-outline-variant bg-surface-container-low text-on-surface md:hidden">
                            <MaterialIcon name={mobileMenuOpen ? "close" : "menu"} size="sm" />
                        </button>
                    </div>
                </div>

                {/* Sleek Navigation Items Row (No "All Categories Overview" button) */}
                <div className="hidden md:flex items-center gap-1 py-1 relative">
                    {/* View 1 Groups Dropdowns */}
                    {viewMode === "operational" &&
                        view1Groups.map((group) => {
                            const isOpen = activeFlyout === group.name;
                            const isGroupActive = group.categories.some((c) => pathname?.includes(c.slug));

                            return (
                                <div key={group.name} className="relative">
                                    <button
                                        type="button"
                                        onMouseEnter={() => setActiveFlyout(group.name)}
                                        onClick={() => setActiveFlyout(isOpen ? null : group.name)}
                                        className={cn(
                                            "flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold transition-all duration-150",
                                            isGroupActive || isOpen
                                                ? "bg-surface-container-high text-primary shadow-2xs"
                                                : "text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface",
                                        )}>
                                        <MaterialIcon name={group.icon} size="sm" className="!text-[15px] text-secondary" />
                                        <span>{group.name}</span>
                                        <span className="rounded bg-surface-container-highest px-1 py-0.2 font-mono text-[9px] font-bold text-on-surface-variant">
                                            {group.categories.length}
                                        </span>
                                        <MaterialIcon
                                            name="keyboard_arrow_down"
                                            size="sm"
                                            className={cn("!text-[14px] transition-transform duration-200", isOpen && "rotate-180")}
                                        />
                                    </button>

                                    {/* Flyout Panel */}
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 2, scale: 0.98 }}
                                                transition={{ duration: 0.12, ease: "easeOut" }}
                                                onMouseLeave={() => setActiveFlyout(null)}
                                                className="absolute left-0 top-full mt-1 w-[350px] rounded-lg border border-outline-variant/80 bg-surface-container-lowest/98 p-2.5 shadow-xl backdrop-blur-xl z-50">
                                                <div className="mb-2 border-b border-outline-variant/40 pb-1.5 px-1">
                                                    <p className="font-mono text-[11px] font-bold text-primary flex items-center gap-1.5">
                                                        <MaterialIcon name={group.icon} size="sm" className="!text-[15px] text-secondary" />
                                                        {group.name}
                                                    </p>
                                                    <p className="text-[10px] text-on-surface-variant leading-tight">{group.description}</p>
                                                </div>

                                                <div className="space-y-0.5">
                                                    {group.categories.map((cat) => (
                                                        <CategoryFlyoutItem key={cat.id} category={cat} onClick={() => setActiveFlyout(null)} />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}

                    {/* View 2 Sections Dropdowns */}
                    {viewMode === "upstream_downstream" &&
                        view2Sections.map((section) => {
                            const isOpen = activeFlyout === section.name;
                            const isSectionActive = section.subgroups.some((sg) =>
                                sg.categories.some((c) => pathname?.includes(c.slug)),
                            );

                            return (
                                <div key={section.name} className="relative">
                                    <button
                                        type="button"
                                        onMouseEnter={() => setActiveFlyout(section.name)}
                                        onClick={() => setActiveFlyout(isOpen ? null : section.name)}
                                        className={cn(
                                            "flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold transition-all duration-150",
                                            isSectionActive || isOpen
                                                ? "bg-surface-container-high text-primary shadow-2xs"
                                                : "text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface",
                                        )}>
                                        <MaterialIcon name={section.icon} size="sm" className={cn("!text-[15px]", section.name.includes("Upstream") ? "text-secondary" : "text-tertiary")} />
                                        <span>{section.name}</span>
                                        <MaterialIcon
                                            name="keyboard_arrow_down"
                                            size="sm"
                                            className={cn("!text-[14px] transition-transform duration-200", isOpen && "rotate-180")}
                                        />
                                    </button>

                                    {/* Mega Flyout Panel */}
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 2, scale: 0.98 }}
                                                transition={{ duration: 0.12, ease: "easeOut" }}
                                                onMouseLeave={() => setActiveFlyout(null)}
                                                className="absolute left-0 top-full mt-1 w-[480px] rounded-lg border border-outline-variant/80 bg-surface-container-lowest/98 p-3 shadow-2xl backdrop-blur-xl z-50">
                                                <div className="mb-2 border-b border-outline-variant/40 pb-1.5">
                                                    <p className="font-mono text-[11px] font-bold text-primary flex items-center gap-1.5">
                                                        <MaterialIcon name={section.icon} size="sm" className={cn("!text-[15px]", section.name.includes("Upstream") ? "text-secondary" : "text-tertiary")} />
                                                        {section.name}
                                                    </p>
                                                    <p className="text-[10px] text-on-surface-variant leading-tight">{section.description}</p>
                                                </div>

                                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                    {section.subgroups.map((sub) => (
                                                        <div key={sub.title} className="rounded-md bg-surface-container-low/70 p-2 border border-outline-variant/30">
                                                            <p className="font-mono text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">
                                                                {sub.title}
                                                            </p>
                                                            <div className="space-y-0.5">
                                                                {sub.categories.map((cat) => (
                                                                    <CategoryFlyoutItem key={cat.id} category={cat} onClick={() => setActiveFlyout(null)} compact />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                </div>

                {/* Mobile Drawer */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden overflow-hidden border-t border-outline-variant/40 py-2 space-y-2">
                            {viewMode === "operational" ? (
                                <div className="space-y-2">
                                    {view1Groups.map((g) => (
                                        <div key={g.name} className="rounded-md bg-surface-container-low p-2">
                                            <p className="font-mono text-[11px] font-bold text-primary mb-1">{g.name}</p>
                                            <div className="space-y-0.5">
                                                {g.categories.map((c) => (
                                                    <CategoryFlyoutItem key={c.id} category={c} onClick={() => setMobileMenuOpen(false)} compact />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {view2Sections.map((s) => (
                                        <div key={s.name} className="rounded-md bg-surface-container-low p-2">
                                            <p className="font-mono text-[11px] font-bold text-primary mb-1">{s.name}</p>
                                            {s.subgroups.map((sg) => (
                                                <div key={sg.title} className="mb-1.5">
                                                    <p className="font-mono text-[9px] uppercase text-on-surface-variant font-bold">{sg.title}</p>
                                                    <div className="space-y-0.5 mt-0.5">
                                                        {sg.categories.map((c) => (
                                                            <CategoryFlyoutItem key={c.id} category={c} onClick={() => setMobileMenuOpen(false)} compact />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function CategoryFlyoutItem({
    category,
    onClick,
    compact = false,
}: {
    category: Scope3Category;
    onClick: () => void;
    compact?: boolean;
}) {
    const pathname = usePathname();
    const isActive = pathname === `/scope-3/${category.slug}`;

    return (
        <Link
            href={`/scope-3/${category.slug}`}
            onClick={onClick}
            className={cn(
                "flex items-center justify-between rounded-md px-2 py-1 transition-colors duration-150 group",
                isActive
                    ? "bg-secondary-container text-on-secondary-container font-semibold"
                    : "hover:bg-surface-container-high/80 text-on-surface",
            )}>
            <div className="flex items-center gap-2 min-w-0">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-surface-container-highest font-mono text-[9px] font-bold text-primary">
                    {category.id}
                </span>
                <span className={cn("truncate font-mono font-medium text-primary group-hover:text-secondary transition-colors", compact ? "text-[10px]" : "text-[11px]")}>
                    {category.name}
                </span>
            </div>

            <span className="font-mono text-[9px] font-bold text-on-surface-variant shrink-0 ml-2">
                {category.code}
            </span>
        </Link>
    );
}
