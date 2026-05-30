/** Shared Recharts styling aligned with Clarity ESG tokens */
export const CHART = {
    actual: "var(--gl-data-blue)",
    target: "var(--gl-data-green)",
    /** Scope comparison bars — light reference */
    scope1: "var(--gl-primary-container)",
    scope2: "var(--gl-chart-esg-teal)",
    grid: "var(--gl-chart-grid)",
    axis: "var(--gl-on-surface-variant)",
    tooltipBg: "var(--gl-surface-container-lowest)",
    tooltipBorder: "var(--gl-outline-variant)",
} as const;

export const CHART_ANIMATION = {
    begin: 200,
    duration: 800,
    easing: "ease-out" as const,
};
