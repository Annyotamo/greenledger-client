"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

type ThemeProviderProps = {
    children: ReactNode;
};

type ThemeContextValue = {
    resolvedTheme: Theme;
    setTheme: (theme: Theme) => void;
};

const storageKey = "gl-dashboard-theme";
const defaultTheme: Theme = "dark";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): Theme {
    if (typeof window === "undefined") {
        return defaultTheme;
    }

    try {
        const storedTheme = window.localStorage.getItem(storageKey) as Theme | null;
        return storedTheme === "light" || storedTheme === "dark" ? storedTheme : defaultTheme;
    } catch {
        return defaultTheme;
    }
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
    const [resolvedTheme, setResolvedTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;

        if (resolvedTheme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        try {
            window.localStorage.setItem(storageKey, resolvedTheme);
        } catch {
            // Ignore localStorage write failures in private mode or restricted browsers.
        }
    }, [resolvedTheme]);

    const value = useMemo(
        () => ({
            resolvedTheme,
            setTheme: (theme: Theme) => {
                if (theme === "light" || theme === "dark") {
                    setResolvedTheme(theme);
                }
            },
        }),
        [resolvedTheme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }

    return context;
}
