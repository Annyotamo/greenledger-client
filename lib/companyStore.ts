import { create } from "zustand";
import type { CompanyDetails } from "@/types/report";

type CompanyStore = {
    companyDetails: CompanyDetails | null;
    setCompanyDetails: (details: CompanyDetails | null) => void;
};

export const useCompanyStore = create<CompanyStore>((set) => ({
    companyDetails: null,
    setCompanyDetails: (details) => set({ companyDetails: details }),
}));
