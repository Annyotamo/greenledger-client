import type { AuditSeverity, AuditStatus } from "./types";

export const MODULE_OPTIONS = [
    { value: "", label: "All Modules" },
    { value: "fuel_activity", label: "Scope 1 • Fuel Activities" },
    { value: "electricity_activity", label: "Scope 2 • Electricity & Steam" },
    { value: "brsr_air", label: "BRSR • Air Emissions" },
    { value: "brsr_energy", label: "BRSR • Energy Consumption" },
    { value: "brsr_water", label: "BRSR • Water Disclosures" },
    { value: "brsr_waste", label: "BRSR • Waste Disclosures" },
    { value: "scope_3_cat1", label: "Scope 3 • Cat 1: Purchased Goods" },
    { value: "scope_3_cat2", label: "Scope 3 • Cat 2: Capital Goods" },
    { value: "scope_3_cat3_fuel", label: "Scope 3 • Cat 3: Fuel WTT" },
    { value: "scope_3_cat3_elec", label: "Scope 3 • Cat 3: Electricity T&D" },
    { value: "scope_3_cat4", label: "Scope 3 • Cat 4: Upstream Transport" },
    { value: "scope_3_cat5", label: "Scope 3 • Cat 5: Operational Waste" },
    { value: "scope_3_travel", label: "Scope 3 • Travel & Commute" },
    { value: "auth", label: "Authentication & Security" },
    { value: "tenant_config", label: "Tenant Configuration" },
    { value: "facility_management", label: "Facility Management" },
];

export const CATEGORY_OPTIONS = [
    { value: "", label: "All Categories" },
    { value: "data_action", label: "Data Action" },
    { value: "auth", label: "Authentication" },
    { value: "system_event", label: "System Event" },
    { value: "compliance", label: "Compliance" },
    { value: "security", label: "Security" },
];

export const SEVERITY_OPTIONS = [
    { value: "", label: "All Severities" },
    { value: "info", label: "Info (Normal)" },
    { value: "warning", label: "Warning" },
    { value: "critical", label: "Critical" },
];

export const STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "success", label: "Success" },
    { value: "failure", label: "Failure" },
    { value: "partial", label: "Partial" },
    { value: "pending", label: "Pending" },
];

export const MODULE_LABEL_MAP: Record<string, { label: string; icon: string; color: string }> = {
    fuel_activity: { label: "Scope 1 Fuel", icon: "local_gas_station", color: "bg-orange-50 text-orange-700 border-orange-200" },
    electricity_activity: { label: "Scope 2 Electricity", icon: "bolt", color: "bg-blue-50 text-blue-700 border-blue-200" },
    brsr_air: { label: "BRSR Air", icon: "air", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
    brsr_energy: { label: "BRSR Energy", icon: "offline_bolt", color: "bg-amber-50 text-amber-700 border-amber-200" },
    brsr_water: { label: "BRSR Water", icon: "water_drop", color: "bg-sky-50 text-sky-700 border-sky-200" },
    brsr_waste: { label: "BRSR Waste", icon: "delete_sweep", color: "bg-stone-50 text-stone-700 border-stone-200" },
    scope_3_cat1: { label: "Scope 3 Cat 1", icon: "shopping_cart", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    scope_3_cat2: { label: "Scope 3 Cat 2", icon: "precision_manufacturing", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    scope_3_cat3_fuel: { label: "Scope 3 Cat 3 Fuel", icon: "local_shipping", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    scope_3_cat3_elec: { label: "Scope 3 Cat 3 Elec", icon: "power_input", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    scope_3_cat4: { label: "Scope 3 Cat 4", icon: "flight_takeoff", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    scope_3_cat5: { label: "Scope 3 Cat 5", icon: "recycling", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    scope_3_travel: { label: "Scope 3 Travel", icon: "commute", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    auth: { label: "Authentication", icon: "key", color: "bg-purple-50 text-purple-700 border-purple-200" },
    tenant_config: { label: "Tenant Config", icon: "settings", color: "bg-slate-50 text-slate-700 border-slate-200" },
    facility_management: { label: "Facility", icon: "domain", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
};

export const CATEGORY_LABEL_MAP: Record<string, string> = {
    data_action: "Data Action",
    auth: "Authentication",
    system_event: "System Event",
    compliance: "Compliance",
    security: "Security",
};

export const SEVERITY_CONFIG: Record<
    AuditSeverity,
    { badge: string; pill: string; icon: string; dot: string }
> = {
    info: {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        pill: "bg-emerald-100/70 text-emerald-800",
        icon: "info",
        dot: "bg-emerald-500",
    },
    warning: {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        pill: "bg-amber-100/70 text-amber-800",
        icon: "warning",
        dot: "bg-amber-500",
    },
    critical: {
        badge: "bg-rose-50 text-rose-700 border-rose-200",
        pill: "bg-rose-100/70 text-rose-800",
        icon: "error",
        dot: "bg-rose-500",
    },
};

export const STATUS_CONFIG: Record<
    AuditStatus,
    { badge: string; icon: string; label: string }
> = {
    success: {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: "check_circle",
        label: "Success",
    },
    failure: {
        badge: "bg-rose-50 text-rose-700 border-rose-200",
        icon: "cancel",
        label: "Failed",
    },
    partial: {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        icon: "incomplete_circle",
        label: "Partial",
    },
    pending: {
        badge: "bg-slate-50 text-slate-700 border-slate-200",
        icon: "hourglass_top",
        label: "Pending",
    },
};

export function getModuleInfo(moduleName?: string | null) {
    if (!moduleName) {
        return { label: "General", icon: "folder", color: "bg-slate-50 text-slate-700 border-slate-200" };
    }
    return (
        MODULE_LABEL_MAP[moduleName] || {
            label: moduleName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            icon: "hub",
            color: "bg-slate-50 text-slate-700 border-slate-200",
        }
    );
}

export function formatDate(isoString: string): string {
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return isoString;
    }
}

export function formatTime(isoString: string): string {
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
    } catch {
        return isoString;
    }
}

export function formatDateTime(isoString: string): string {
    return `${formatDate(isoString)} · ${formatTime(isoString)}`;
}

export function formatEventType(eventType?: string | null): string {
    if (!eventType) return "Event";
    return eventType
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
}
