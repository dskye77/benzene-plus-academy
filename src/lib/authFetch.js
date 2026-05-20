// src/lib/authFetch.ts

import { auth } from "@/lib/firebase";

export default async function authFetch(url, options = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const token = await user.getIdToken();

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}
