import { create } from "zustand";

type SectionKey =
  | "esg-accounting"
  | "ghg-accounting"
  | "finance-esg-reporting"
  | "audit-compliance"
  | "scope-1";

type SidebarState = {
  isOpen: boolean;
  activeSection: SectionKey | null;
  ghgExpanded: boolean;
  toggle: () => void;
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
  setActiveSection: (section) =>
    set(() => ({
      activeSection: section,
    })),
  toggleGhg: () =>
    set((state) => ({
      ghgExpanded: !state.ghgExpanded,
    })),
}));

