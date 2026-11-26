"use client";

import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { LuArrowLeft, LuCheck, LuEye, LuEyeOff, LuLock, LuMail, LuRefreshCw, LuShieldAlert, LuShieldCheck } from "react-icons/lu";
import { loginUser, resendMfa, verifyMfa } from "@/lib/auth/api";
import { setAuthToken } from "@/lib/auth/token";

type ApiError = {
    message?: string;
    error?: {
        error_code?: string;
        detail?: string;
    };
    response?: string;
};

function extractErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof AxiosError) {
        const body = err.response?.data as ApiError | undefined;
        return body?.error?.detail || body?.message || body?.response || fallback;
    }
    if (err instanceof Error) {
        return err.message;
    }
    return fallback;
}

// ----------------------------------------------------------------------------
// Step 1: Credentials Form
// ----------------------------------------------------------------------------
function CredentialsStep({
    onSuccess,
    onRequireMfa,
}: {
    onSuccess: () => void;
    onRequireMfa: (sessionIdentifier: string, email: string) => void;
}) {
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
            const data = await loginUser({ email: trimmed, password });

            // If MFA is required on this account, transition to MFA challenge
            if (data.mfa_required && data.session_identifier) {
                onRequireMfa(data.session_identifier, trimmed);
                return;
            }

            // Normal login (MFA not enabled) - proceed directly
            if (data.access_token) {
                setAuthToken(String(data.access_token));
                onSuccess();
            } else {
                throw new Error("Authentication response was invalid.");
            }
        } catch (err) {
            setError(extractErrorMessage(err, "Login failed. Please check your credentials."));
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
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-emerald-950 font-display">Welcome back</h2>
                <p className="mt-1.5 text-sm text-slate-600 font-sans">Enter your credentials to access your GreenLedger account.</p>
            </header>

            <form className="grid gap-5" onSubmit={handleSubmit} aria-labelledby={`${formId}-title`}>
                <span id={`${formId}-title`} className="sr-only">
                    Sign-in form
                </span>

                <div className="grid gap-2">
                    <label htmlFor={`${formId}-email`} className="text-xs font-semibold text-emerald-950 font-sans">
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
                    <label htmlFor={`${formId}-password`} className="text-xs font-semibold text-emerald-950 font-sans">
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
                            className="absolute right-2 top-1/2 inline-flex h-9 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-emerald-900/50 transition hover:bg-emerald-50 hover:text-emerald-950 cursor-pointer"
                            aria-label={showPassword ? "Hide password" : "Show password"}>
                            {showPassword ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700">
                        <LuShieldAlert className="h-4 w-4 shrink-0 text-red-600" />
                        <span>{error}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-md shadow-emerald-900/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200/60 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer">
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
                            Authenticating…
                        </span>
                    ) : (
                        "Sign in"
                    )}
                </button>
            </form>
        </>
    );
}

// ----------------------------------------------------------------------------
// Step 2: Multi-Factor Authentication Challenge Form
// ----------------------------------------------------------------------------
function MfaStep({
    sessionIdentifier,
    userEmail,
    onSuccess,
    onBackToLogin,
}: {
    sessionIdentifier: string;
    userEmail: string;
    onSuccess: () => void;
    onBackToLogin: () => void;
}) {
    const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
    const [currentSessionId, setCurrentSessionId] = useState(sessionIdentifier);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(60);
    const [error, setError] = useState<string | null>(null);
    const [resendSuccessMessage, setResendSuccessMessage] = useState<string | null>(null);

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    // 60-second countdown timer for Resend Code
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const interval = setInterval(() => {
            setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [resendCooldown]);

    // Focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Handle single digit input and auto-advance
    function handleDigitChange(index: number, val: string) {
        setError(null);
        setResendSuccessMessage(null);

        // Allow only numeric digits
        const cleanVal = val.replace(/\D/g, "");
        if (!cleanVal) {
            const next = [...digits];
            next[index] = "";
            setDigits(next);
            return;
        }

        const digit = cleanVal.slice(-1);
        const next = [...digits];
        next[index] = digit;
        setDigits(next);

        // Auto-advance cursor to next input box
        if (index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all 6 digits are filled
        if (next.every((d) => d.length === 1)) {
            submitCode(next.join(""));
        }
    }

    // Handle backspace key navigation
    function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    // Handle paste event (e.g. user copies full 6-digit code)
    function handlePaste(e: React.ClipboardEvent) {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pasted) return;

        const next = ["", "", "", "", "", ""];
        for (let i = 0; i < pasted.length; i++) {
            next[i] = pasted[i];
        }
        setDigits(next);

        const focusIndex = Math.min(pasted.length, 5);
        inputRefs.current[focusIndex]?.focus();

        if (pasted.length === 6) {
            submitCode(pasted);
        }
    }

    async function submitCode(code: string) {
        if (isVerifying) return;
        setIsVerifying(true);
        setError(null);
        setResendSuccessMessage(null);

        try {
            const data = await verifyMfa({
                session_identifier: currentSessionId,
                code,
            });

            if (data.access_token) {
                setAuthToken(String(data.access_token));
                onSuccess();
            } else {
                throw new Error("Verification succeeded but no auth token was issued.");
            }
        } catch (err) {
            setError(extractErrorMessage(err, "Invalid verification code. Please check your email and try again."));
            // Focus back to first box for correction
            inputRefs.current[0]?.focus();
        } finally {
            setIsVerifying(false);
        }
    }

    async function handleResendCode() {
        if (resendCooldown > 0 || isResending) return;
        setIsResending(true);
        setError(null);
        try {
            const res = await resendMfa({ session_identifier: currentSessionId });
            if (res.session_identifier) {
                setCurrentSessionId(res.session_identifier);
            }
            setResendCooldown(60);
            setResendSuccessMessage("A fresh 6-digit code has been sent to your email.");
            setDigits(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } catch (err) {
            setError(extractErrorMessage(err, "Failed to resend code. Please try again or re-login."));
        } finally {
            setIsResending(false);
        }
    }

    const isCodeComplete = digits.every((d) => d.length === 1);

    return (
        <>
            <header className="mb-6">
                <button
                    type="button"
                    onClick={onBackToLogin}
                    className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 transition hover:text-emerald-950 cursor-pointer">
                    <LuArrowLeft className="h-3.5 w-3.5" />
                    Back to credentials
                </button>

                <p className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-emerald-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-emerald-800">
                    <LuShieldCheck className="h-3 w-3" />
                    Two-Factor Authentication
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-emerald-950 font-display">Enter verification code</h2>
                <p className="mt-1 text-sm text-slate-600 font-sans">
                    We sent a 6-digit one-time code to <strong className="text-slate-900 font-medium">{userEmail}</strong>. Enter it below to complete sign-in.
                </p>
            </header>

            <div className="grid gap-6">
                {/* 6-Digit Individual Input Grid */}
                <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
                    {digits.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={(el) => {
                                inputRefs.current[idx] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleDigitChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            disabled={isVerifying}
                            aria-label={`Digit ${idx + 1}`}
                            className="h-14 w-12 sm:h-14 sm:w-14 text-center font-mono text-2xl font-bold text-slate-900 rounded-xl border border-emerald-900/15 bg-white/90 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:opacity-60"
                        />
                    ))}
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700">
                        <LuShieldAlert className="h-4 w-4 shrink-0 text-red-600" />
                        <span>{error}</span>
                    </div>
                )}

                {resendSuccessMessage && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800">
                        <LuCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{resendSuccessMessage}</span>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => submitCode(digits.join(""))}
                    disabled={isVerifying || !isCodeComplete}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-md shadow-emerald-900/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200/60 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer">
                    {isVerifying ? (
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
                            Verifying code…
                        </span>
                    ) : (
                        "Verify & Continue"
                    )}
                </button>

                {/* Resend OTP with cooldown timer */}
                <div className="flex items-center justify-center text-xs font-sans text-slate-500">
                    {resendCooldown > 0 ? (
                        <span className="text-slate-500">
                            Resend code in <strong className="font-mono font-semibold text-slate-700">{resendCooldown}s</strong>
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={isResending}
                            className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 hover:text-emerald-900 transition underline underline-offset-4 cursor-pointer disabled:opacity-60">
                            <LuRefreshCw className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`} />
                            {isResending ? "Resending…" : "Resend 6-digit code"}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

// ----------------------------------------------------------------------------
// Main Exported Component
// ----------------------------------------------------------------------------
export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect");

    const [step, setStep] = useState<"credentials" | "mfa">("credentials");
    const [mfaSessionId, setMfaSessionId] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");

    function handleSuccess() {
        if (redirect && redirect.startsWith("/")) {
            router.push(`/initializing?redirect=${encodeURIComponent(redirect)}`);
        } else {
            router.push("/initializing");
        }
    }

    function handleRequireMfa(sessionId: string, email: string) {
        setMfaSessionId(sessionId);
        setUserEmail(email);
        setStep("mfa");
    }

    return (
        <div className="animate-fade-up">
            {step === "credentials" ? (
                <CredentialsStep
                    onSuccess={handleSuccess}
                    onRequireMfa={handleRequireMfa}
                />
            ) : (
                <MfaStep
                    sessionIdentifier={mfaSessionId}
                    userEmail={userEmail}
                    onSuccess={handleSuccess}
                    onBackToLogin={() => setStep("credentials")}
                />
            )}

            <p className="mt-8 text-center text-xs text-slate-500 font-sans">
                By signing in you agree to our <span className="font-semibold text-emerald-800">Terms of Service</span>{" "}
                and <span className="font-semibold text-emerald-800">Privacy Policy</span>.
            </p>
        </div>
    );
}
