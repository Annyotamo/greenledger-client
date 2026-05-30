"use client";

import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { LuEye, LuEyeOff, LuLock, LuMail, LuShieldCheck } from "react-icons/lu";
import { publicApi } from "@/lib/http/client";
import { setAuthToken } from "@/lib/auth/token";

type ApiError = { response?: string; message?: string };

function CredentialsStep({ onSuccess }: { onSuccess: () => void }) {
    const formId = useId();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const trimmed = email.trim();
        if (!trimmed || !password) {
            setError("Please enter your email and password.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = { email: trimmed, password };
            const res = await publicApi.post("/user/auth/login", payload);

            const body = res.data as any;
            if (!body || body.success !== true || !body.data || !body.data.access_token) {
                const msg = body?.message ?? "Login failed. Please try again.";
                throw new Error(msg);
            }

            setAuthToken(String(body.data.access_token));

            // temporary: bypass MFA flow and continue
            onSuccess();
        } catch (err) {
            if (err instanceof AxiosError) {
                const body = err.response?.data as ApiError | undefined;
                setError(body?.message ?? body?.response ?? "Login failed. Please try again.");
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Login failed. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <header className="mb-8">
                <p className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-emerald-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-emerald-800">
                    <LuShieldCheck className="h-3 w-3" />
                    Secure Sign-in
                </p>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-emerald-950">Welcome back</h2>
                <p className="mt-1.5 text-sm text-slate-600">Enter your credentials to sign in directly.</p>
            </header>

            <form className="grid gap-5" onSubmit={handleSubmit} aria-labelledby={`${formId}-title`}>
                <span id={`${formId}-title`} className="sr-only">
                    Sign-in form
                </span>

                <div className="grid gap-2">
                    <label htmlFor={`${formId}-email`} className="text-xs font-semibold text-emerald-950">
                        Email address
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-900/40">
                            <LuMail className="h-4 w-4" />
                        </div>
                        <input
                            id={`${formId}-email`}
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            placeholder="name@company.com"
                            disabled={isSubmitting}
                            className="h-12 w-full rounded-2xl border border-emerald-900/12 bg-white/90 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-100 disabled:opacity-60"
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <label htmlFor={`${formId}-password`} className="text-xs font-semibold text-emerald-950">
                        Password
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-900/40">
                            <LuLock className="h-4 w-4" />
                        </div>
                        <input
                            id={`${formId}-password`}
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            disabled={isSubmitting}
                            className="h-12 w-full rounded-2xl border border-emerald-900/12 bg-white/90 pl-10 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-100 disabled:opacity-60"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            disabled={isSubmitting}
                            className="absolute right-2 top-1/2 inline-flex h-9 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-emerald-900/50 transition hover:bg-emerald-50 hover:text-emerald-950"
                            aria-label={showPassword ? "Hide password" : "Show password"}>
                            {showPassword ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {error && (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-md shadow-emerald-900/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200/60 disabled:cursor-not-allowed disabled:opacity-70">
                    {isSubmitting ? (
                        <span className="inline-flex items-center gap-2">
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>
                            Signing in…
                        </span>
                    ) : (
                        "Sign in"
                    )}
                </button>
            </form>
        </>
    );
}

export default function LoginForm() {
    const router = useRouter();

    function handleCredentialsSuccess() {
        router.push("/dashboard");
    }

    return (
        <div className="animate-fade-up">
            <CredentialsStep onSuccess={handleCredentialsSuccess} />

            <p className="mt-8 text-center text-xs text-slate-500">
                By signing in you agree to our <span className="font-semibold text-emerald-800">Terms of Service</span>{" "}
                and <span className="font-semibold text-emerald-800">Privacy Policy</span>.
            </p>
        </div>
    );
}
