"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { FaApple, FaFacebook, FaGithub, FaGoogle, FaMicrosoft } from "react-icons/fa";
import { LuEye, LuEyeOff, LuLock, LuMail, LuUser } from "react-icons/lu";

type Mode = "identity" | "email";

export default function LoginForm() {
    const formId = useId();
    const [mode, setMode] = useState<Mode>("identity");
    const [showPassword, setShowPassword] = useState(false);

    const identityLabel = useMemo(() => (mode === "email" ? "Email" : "Username or email"), [mode]);
    const identityPlaceholder = useMemo(
        () => (mode === "email" ? "name@company.com" : "name@company.com or username"),
        [mode]
    );

    return (
        <div className="animate-fade-up">
            <header className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h2 className="text-pretty text-2xl font-bold tracking-tight text-emerald-950">Welcome back</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                        Sign in with your identity, or use an SSO provider below. This is UI-only for now.
                    </p>
                </div>
                <div className="hidden shrink-0 rounded-2xl bg-emerald-50/80 px-3 py-2 text-xs font-semibold text-emerald-900 shadow-sm sm:block">
                    Secure session
                </div>
            </header>

            <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-900/10 bg-white/70 p-2 shadow-sm">
                <button
                    type="button"
                    onClick={() => setMode("identity")}
                    className={[
                        "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition",
                        mode === "identity"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "text-emerald-950/80 hover:bg-emerald-50/70",
                    ].join(" ")}>
                    <LuUser className="h-4 w-4" />
                    Username or email
                </button>
                <button
                    type="button"
                    onClick={() => setMode("email")}
                    className={[
                        "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition",
                        mode === "email"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "text-emerald-950/80 hover:bg-emerald-50/70",
                    ].join(" ")}>
                    <LuMail className="h-4 w-4" />
                    Email only
                </button>
                <span className="ml-auto hidden items-center gap-2 rounded-xl px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-emerald-900/55 sm:inline-flex">
                    SSO ready
                </span>
            </div>

            <form
                className="mt-6 grid gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                }}
                aria-labelledby={`${formId}-title`}>
                <span id={`${formId}-title`} className="sr-only">
                    Sign in form
                </span>

                <div className="grid gap-2">
                    <label htmlFor={`${formId}-identity`} className="text-xs font-semibold text-emerald-950">
                        {identityLabel}
                    </label>
                    <div className="group relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-900/45">
                            {mode === "email" ? <LuMail className="h-4 w-4" /> : <LuUser className="h-4 w-4" />}
                        </div>
                        <input
                            id={`${formId}-identity`}
                            name="identity"
                            autoComplete={mode === "email" ? "email" : "username"}
                            inputMode={mode === "email" ? "email" : "text"}
                            placeholder={identityPlaceholder}
                            className="h-12 w-full rounded-2xl border border-emerald-900/10 bg-white/85 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-200/45"
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <label htmlFor={`${formId}-password`} className="text-xs font-semibold text-emerald-950">
                        Password
                    </label>
                    <div className="group relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-900/45">
                            <LuLock className="h-4 w-4" />
                        </div>
                        <input
                            id={`${formId}-password`}
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className="h-12 w-full rounded-2xl border border-emerald-900/10 bg-white/85 pl-10 pr-12 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-200/45"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-2 top-1/2 inline-flex h-9 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-emerald-900/60 transition hover:bg-emerald-50/70 hover:text-emerald-950"
                            aria-label={showPassword ? "Hide password" : "Show password"}>
                            {showPassword ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-emerald-900/20 text-emerald-600 focus:ring-emerald-200"
                        />
                        Remember me
                    </label>
                    <Link
                        href="#"
                        className="text-xs font-semibold text-emerald-800 underline decoration-emerald-300/70 decoration-2 underline-offset-4 transition hover:text-emerald-950 hover:decoration-emerald-400">
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200/50">
                    Sign in
                </button>

                <div className="mt-2 flex items-center gap-3">
                    <span className="h-px flex-1 bg-emerald-900/10" />
                    <span className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-emerald-900/55">
                        Or continue with
                    </span>
                    <span className="h-px flex-1 bg-emerald-900/10" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: "Google", icon: <FaGoogle className="h-4 w-4" /> },
                        { label: "Microsoft", icon: <FaMicrosoft className="h-4 w-4" /> },
                        { label: "Apple", icon: <FaApple className="h-4 w-4" /> },
                        { label: "GitHub", icon: <FaGithub className="h-4 w-4" /> },
                    ].map((p) => (
                        <button
                            key={p.label}
                            type="button"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-emerald-900/10 bg-white/80 px-3 text-xs font-semibold text-emerald-950 shadow-sm transition hover:bg-white hover:shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-200/45">
                            <span className="text-emerald-900/70">{p.icon}</span>
                            {p.label}
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-emerald-900/10 bg-white/80 px-3 text-xs font-semibold text-emerald-950 shadow-sm transition hover:bg-white hover:shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-200/45">
                    <span className="text-emerald-900/70">
                        <FaFacebook className="h-4 w-4" />
                    </span>
                    Continue with Facebook
                </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-600">
                Don’t have an account?{" "}
                <Link
                    href="#"
                    className="font-semibold text-emerald-800 underline decoration-emerald-300/70 decoration-2 underline-offset-4 transition hover:text-emerald-950 hover:decoration-emerald-400">
                    Request access
                </Link>
            </p>
        </div>
    );
}

