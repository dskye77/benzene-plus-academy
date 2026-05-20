"use client";
// components/AdminLogoutButton.jsx
// Drop this wherever you want a logout action (e.g. replace the "Exit admin" link in layout.jsx)

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LogOut } from "lucide-react";
import { useState } from "react";

export default function AdminLogoutButton({ onNavigate }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      // 1. Clear the session cookie on the server
      await fetch("/api/admin/session", { method: "DELETE" });
      // 2. Sign out of Firebase client
      await signOut(auth);
      // 3. Navigate to login
      onNavigate?.();
      router.replace("/login");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary w-full disabled:opacity-50 transition"
    >
      <LogOut className="h-4 w-4" />
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
