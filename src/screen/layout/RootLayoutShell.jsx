"use client";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function RootLayoutShell({ children }) {
  return (
    <div>
      <Navbar />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
