"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href) && href !== "/";
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display font-bold"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white ring-1 ring-border overflow-hidden">
            <Image
              src="/logo.svg"
              width={40}
              height={40}
         
              alt="Benzene Plus Academy"
              className="h-full w-full object-contain"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] text-foreground">
              Benzene Plus
            </span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Academy
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className={cn(
                "px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:text-foreground hover:bg-secondary/70 transition-colors",
                isActive(l.to) && "text-foreground bg-secondary/80"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
          >
            Register Now
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-page py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                href={l.to}
                className={cn(
                  "px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-secondary",
                  isActive(l.to) && "bg-secondary text-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              Register Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
