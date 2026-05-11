"use client";

import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, useEffect, type KeyboardEvent, type ClipboardEvent } from "react";
import { LuArrowLeft, LuEye, LuEyeOff, LuLock, LuMail, LuShieldCheck } from "react-icons/lu";
import { useInitiateLoginMutation, useVerifyOtpMutation } from "@/lib/auth/hooks";

type ApiError = { response?: string; message?: string };

const OTP_LENGTH = 6;

// ─── Step 1: Credentials ─────────────────────────────────────────────────────
function CredentialsStep({
    onSuccess,
}: {
    onSuccess: (email: string) => void;
}) {
    const formId = useId();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const initiateMutation = useInitiateLoginMutation();
    const isSubmitting = initiateMutation.isPending;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const trimmed = email.trim();
        if (!trimmed || !password) {
            setError("Please enter your email and password.");
            return;
        }
        try {
            const usedEmail = await initiateMutation.mutateAsync({ identity: trimmed, password });
            onSuccess(usedEmail);
        } catch (err) {
            if (err instanceof AxiosError) {
                const body = err.response?.data as ApiError | undefined;
                setError(body?.response ?? body?.message ?? "Login failed. Please try again.");
                return;
            }
            setError("Login failed. Please try again.");
        }
    }

    return (
        <>
            <header className="mb-8">
                <p className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-emerald-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-emerald-800">
                    <LuShieldCheck className="h-3 w-3" />
                    Secure Sign-in
                </p>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-emerald-950">
                    Welcome back
                </h2>
                <p className="mt-1.5 text-sm text-slate-600">
                    Enter your credentials to receive a one-time code.
                </p>
            </header>

            <form className="grid gap-5" onSubmit={handleSubmit} aria-labelledby={`${formId}-title`}>
                <span id={`${formId}-title`} className="sr-only">Sign-in form</span>

                {/* Email */}
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

                {/* Password */}
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
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            Sending code…
                        </span>
                    ) : (
                        "Continue"
                    )}
                </button>
            </form>
        </>
    );
}

// ─── Step 2: OTP Verification ─────────────────────────────────────────────────
function OtpStep({
    email,
    onBack,
    onSuccess,
}: {
    email: string;
    onBack: () => void;
    onSuccess: () => void;
}) {
    const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [error, setError] = useState<string | null>(null);
    const [resendCooldown, setResendCooldown] = useState(30);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const verifyMutation = useVerifyOtpMutation();
    const isSubmitting = verifyMutation.isPending;
    const otp = digits.join("");

    // Countdown timer for resend
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setTimeout(() => setResendCooldown((v) => v - 1), 1000);
        return () => clearTimeout(t);
    }, [resendCooldown]);

    function focusAt(index: number) {
        inputRefs.current[index]?.focus();
    }

    function handleChange(index: number, value: string) {
        const char = value.replace(/\D/g, "").slice(-1);
        const next = [...digits];
        next[index] = char;
        setDigits(next);
        setError(null);
        if (char && index < OTP_LENGTH - 1) focusAt(index + 1);
        // Auto-submit when all filled
        if (char && index === OTP_LENGTH - 1) {
            const complete = [...next].join("");
            if (complete.length === OTP_LENGTH) {
                submitOtp(complete);
            }
        }
    }

    function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Backspace") {
            if (digits[index]) {
                const next = [...digits];
                next[index] = "";
                setDigits(next);
            } else if (index > 0) {
                focusAt(index - 1);
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            focusAt(index - 1);
        } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
            focusAt(index + 1);
        }
    }

    function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;
        const next = [...digits];
        for (let i = 0; i < pasted.length; i++) {
            next[i] = pasted[i];
        }
        setDigits(next);
        const nextFocusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
        focusAt(nextFocusIdx);
        if (pasted.length === OTP_LENGTH) {
            submitOtp(pasted);
        }
    }

    async function submitOtp(code?: string) {
        const finalOtp = code ?? otp;
        setError(null);
        if (finalOtp.length !== OTP_LENGTH) {
            setError("Please enter all 6 digits.");
            return;
        }
        try {
            await verifyMutation.mutateAsync({ email, otp: finalOtp });
            onSuccess();
        } catch (err) {
            if (err instanceof AxiosError) {
                const body = err.response?.data as ApiError | undefined;
                setError(body?.response ?? body?.message ?? "Invalid OTP. Please try again.");
                return;
            }
            setError("Invalid OTP. Please try again.");
            // Clear digits on error
            setDigits(Array(OTP_LENGTH).fill(""));
            setTimeout(() => focusAt(0), 50);
        }
    }

    // Mask email for display: "an****@gmail.com"
    function maskEmail(addr: string) {
        const [local, domain] = addr.split("@");
        if (!local || !domain) return addr;
        const visible = local.slice(0, 2);
        return `${visible}${"*".repeat(Math.max(2, local.length - 2))}@${domain}`;
    }

    return (
        <>
            <header className="mb-8">
                <button
                    type="button"
                    onClick={onBack}
                    className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 transition hover:text-emerald-900">
                    <LuArrowLeft className="h-3.5 w-3.5" />
                    Back
                </button>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-200">
                    <LuShieldCheck className="h-7 w-7 text-emerald-700" />
                </div>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-emerald-950">
                    Check your email
                </h2>
                <p className="mt-1.5 text-sm text-slate-600">
                    We sent a 6-digit code to{" "}
                    <span className="font-semibold text-slate-800">{maskEmail(email)}</span>
                </p>
            </header>

            {/* OTP boxes */}
            <div className="flex items-center justify-between gap-2 sm:gap-3">
                {digits.map((digit, i) => (
                    <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={i === 0 ? handlePaste : undefined}
                        onFocus={(e) => e.target.select()}
                        disabled={isSubmitting}
                        aria-label={`OTP digit ${i + 1}`}
                        className={[
                            "h-14 w-full max-w-[3rem] rounded-2xl border text-center text-xl font-bold tabular-nums text-emerald-950 shadow-sm outline-none transition",
                            "focus:ring-4 focus:ring-emerald-100 disabled:opacity-60",
                            digit
                                ? "border-emerald-500/60 bg-emerald-50/60"
                                : "border-emerald-900/12 bg-white/90",
                        ].join(" ")}
                    />
                ))}
            </div>

            {error && (
                <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700">
                    {error}
                </p>
            )}

            <button
                type="button"
                onClick={() => submitOtp()}
                disabled={isSubmitting || otp.length !== OTP_LENGTH}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-md shadow-emerald-900/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200/60 disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Verifying…
                    </span>
                ) : (
                    "Verify & Sign in"
                )}
            </button>

            <p className="mt-5 text-center text-xs text-slate-600">
                Didn't receive it?{" "}
                {resendCooldown > 0 ? (
                    <span className="font-semibold text-slate-400">
                        Resend in {resendCooldown}s
                    </span>
                ) : (
                    <button
                        type="button"
                        onClick={onBack}
                        className="font-semibold text-emerald-700 underline decoration-emerald-300/70 decoration-2 underline-offset-4 transition hover:text-emerald-950">
                        Resend code
                    </button>
                )}
            </p>
        </>
    );
}

// ─── Root component ───────────────────────────────────────────────────────────
export default function LoginForm() {
    const router = useRouter();
    const [step, setStep] = useState<"credentials" | "otp">("credentials");
    const [pendingEmail, setPendingEmail] = useState("");

    function handleCredentialsSuccess(email: string) {
        setPendingEmail(email);
        setStep("otp");
    }

    function handleOtpSuccess() {
        router.push("/dashboard");
    }

    function handleBack() {
        setStep("credentials");
        setPendingEmail("");
    }

    return (
        <div className="animate-fade-up">
            {step === "credentials" ? (
                <CredentialsStep onSuccess={handleCredentialsSuccess} />
            ) : (
                <OtpStep
                    email={pendingEmail}
                    onBack={handleBack}
                    onSuccess={handleOtpSuccess}
                />
            )}

            <p className="mt-8 text-center text-xs text-slate-500">
                By signing in you agree to our{" "}
                <span className="font-semibold text-emerald-800">Terms of Service</span> and{" "}
                <span className="font-semibold text-emerald-800">Privacy Policy</span>.
            </p>
        </div>
    );
}
