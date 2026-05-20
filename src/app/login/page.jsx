"use client";

import React, { Suspense } from "react";
import Login from "@/screen/login"; // Adjust path as needed

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
}