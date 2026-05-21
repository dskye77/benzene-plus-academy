"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Toaster } from "sonner";

// List of routes (as prefixes or exact) that should not display Navbar/Footer
const HIDE_LAYOUT_PATHS = ["/admin", "/register", "/login"];

function shouldHideLayout(pathname) {
  return HIDE_LAYOUT_PATHS.some(
    (p) => p === pathname || pathname.startsWith(`${p}/`),
  );
}

export default function RootLayoutShell({ children }) {
  const pathname = usePathname();

  if (shouldHideLayout(pathname)) {
    return (
      <>
        <Toaster position="top-center" closeButton richColors />
        {children}
      </>
    );
  }

  return (
    <div>
      <Toaster position="top-center" closeButton richColors />
      <Navbar />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
