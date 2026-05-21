"use client";
// app/admin/login/page.jsx

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  const { signIn, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    clearError();
    try {
      await signIn(email, password);
      router.replace(redirect);
    } catch {
      // useAuth sets error state
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <span className="grid h-14 w-14 place-items-center rounded-2xl gradient-hero text-primary-foreground mb-4">
            <GraduationCap className="h-7 w-7" />
          </span>
          <h1 className="font-display font-bold text-2xl">Benzene Plus</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Admin access only
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-5">Sign in</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                placeholder="admin@example.com"
                onFocus={clearError}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                placeholder="••••••••"
                onFocus={clearError}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-medium py-2.5 text-sm hover:opacity-90 disabled:opacity-60 transition"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
