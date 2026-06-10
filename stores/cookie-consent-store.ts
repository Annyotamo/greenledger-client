import { create } from "zustand";

export interface CookiePreferences {
    essentials: boolean;
    ga: boolean;
}

interface CookieConsentState {
    isOpen: boolean;
    preferences: CookiePreferences;
    setOpen: (open: boolean) => void;
    setPreferences: (preferences: CookiePreferences) => void;
}

export const useCookieConsentStore = create<CookieConsentState>((set) => ({
    isOpen: false,
    preferences: {
        essentials: true,
        ga: false,
    },
    setOpen: (isOpen) => set({ isOpen }),
    setPreferences: (preferences) => set({ preferences }),
}));
