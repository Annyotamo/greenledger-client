import { create } from "zustand";

type SectionKey =
    | "dashboard"
    | "esg-accounting"
    | "ghg-accounting"
    | "traceability"
    | "finance-esg-reporting"
    | "audit-compliance"
    | "scope-1"
    | "scope-2"
    | "company"
    | "facility"
    | "settings";

type SidebarState = {
    isOpen: boolean;
    activeSection: SectionKey | null;
    ghgExpanded: boolean;
    toggle: () => void;
    setOpen: (open: boolean) => void;
    setActiveSection: (section: SectionKey) => void;
    toggleGhg: () => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
    isOpen: true,
    activeSection: "esg-accounting",
    ghgExpanded: true,
    toggle: () =>
        set((state) => ({
            isOpen: !state.isOpen,
        })),
    setOpen: (open) =>
        set(() => ({
            isOpen: open,
        })),
    setActiveSection: (section) =>
        set(() => ({
            activeSection: section,
        })),
    toggleGhg: () =>
        set((state) => ({
            ghgExpanded: !state.ghgExpanded,
        })),
}));
