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
const defaultTheme: Theme = "light";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): Theme {
    return "light";
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
    const [resolvedTheme, setResolvedTheme] = useState<Theme>("light");

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("dark");
    }, []);

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
