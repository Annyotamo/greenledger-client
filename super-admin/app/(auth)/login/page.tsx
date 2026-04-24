"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type LoginState = "idle" | "loading" | "error";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<LoginState>("idle");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length > 0 && state !== "loading";
  }, [email, password, state]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setState("loading");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message || "Login failed.");
      }

      router.replace("/");
      router.refresh();
    } catch (err: unknown) {
      setState("error");
      setError(err instanceof Error ? err.message : "Login failed.");
      return;
    }

    setState("idle");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="gl-card w-full max-w-md p-6 sm:p-8">
        <div className="mb-6">
          <div className="text-sm tracking-wide text-(--muted)">GreenLedger</div>
          <h1 className="mt-1 text-xl font-semibold">Super Admin Login</h1>
          <p className="mt-2 text-sm text-(--muted)">Sign in with your email and password.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <div className="mb-1 text-sm text-(--muted)">Email</div>
            <input
              className="gl-input w-full px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
            />
          </label>

          <label className="block">
            <div className="mb-1 text-sm text-(--muted)">Password</div>
            <input
              className="gl-input w-full px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </label>

          {error ? (
            <div className="text-sm text-(--danger)">{error}</div>
          ) : (
            <div className="text-sm text-transparent select-none">.</div>
          )}

          <button
            className="gl-btn w-full px-3 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={!canSubmit}
          >
            {state === "loading" ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

