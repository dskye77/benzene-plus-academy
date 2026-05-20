"use client";
// app/admin/login/page.jsx

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { GraduationCap, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Sign in with Firebase client SDK
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // 2. Get the ID token
      const idToken = await userCredential.user.getIdToken();

      // 3. Exchange for a session cookie via your API
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login failed");
      }

      // 4. Redirect to the admin page (or wherever they were going)
      router.replace(redirect);
    } catch (err) {
      setError(friendlyError(err.message));
    } finally {
      setLoading(false);
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

// Map Firebase/API error codes to friendly messages
function friendlyError(msg = "") {
  if (
    msg.includes("invalid-credential") ||
    msg.includes("wrong-password") ||
    msg.includes("user-not-found")
  )
    return "Invalid email or password.";
  if (msg.includes("too-many-requests"))
    return "Too many attempts. Please wait a few minutes and try again.";
  if (msg.includes("not an admin") || msg.includes("Forbidden"))
    return "This account does not have admin access.";
  if (msg.includes("network"))
    return "Network error. Check your connection and try again.";
  return msg || "Something went wrong. Please try again.";
}
