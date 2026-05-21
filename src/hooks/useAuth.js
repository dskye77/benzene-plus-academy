"use client";

import { useEffect, useState, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

/**
 * @typedef {Object} AuthUser
 * @property {string} uid
 * @property {string|null} email
 * @property {string|null} displayName
 * @property {string|null} photoURL
 */

/**
 * @typedef {Object} UseAuthReturn
 * @property {AuthUser|null} user        - The current Firebase user (null if signed out)
 * @property {boolean}       loading     - True while the initial auth state is resolving
 * @property {string|null}   error       - Last error message, if any
 * @property {boolean}       isAdmin     - Whether the current user has an active admin session cookie
 * @property {Function}      signIn      - (email, password) => Promise<void>
 * @property {Function}      signOut     - () => Promise<void>
 * @property {Function}      clearError  - () => void
 */

/**
 * useAuth
 *
 * Subscribes to Firebase Auth state and exposes signIn / signOut helpers
 * that also manage the httpOnly admin session cookie via the API.
 *
 * @returns {UseAuthReturn}
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Subscribe to Firebase auth state once on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * Sign in with email + password.
   * On success, exchanges the Firebase ID token for an httpOnly session cookie
   * and marks the user as an admin if the server confirms it.
   */
  const signIn = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const idToken = await credential.user.getIdToken();

      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Session creation failed");
      }

      setIsAdmin(true);
    } catch (err) {
      setError(friendlyError(err.message));
      // If session creation failed, sign out of Firebase too so state stays consistent
      await firebaseSignOut(auth).catch(() => {});
      throw err; // re-throw so the caller (e.g. login form) can react
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Sign out: clears the server session cookie then signs out of Firebase.
   */
  const signOut = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await fetch("/api/admin/session", { method: "DELETE" });
      await firebaseSignOut(auth);
      setIsAdmin(false);
    } catch (err) {
      setError(err.message || "Sign-out failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { user, loading, error, isAdmin, signIn, signOut, clearError };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
