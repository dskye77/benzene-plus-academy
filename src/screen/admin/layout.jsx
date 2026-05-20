"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import {
  LayoutDashboard,
  Trophy,
  BookOpen,
  FileText,
  LogOut,
  GraduationCap,
  Menu as MenuIcon,
  X as CloseIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/scores", label: "Top Scorers", icon: Trophy },
  { href: "/admin/programs", label: "Programs", icon: BookOpen },
  { href: "/admin/blog", label: "Blog", icon: FileText },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Only renders nav links, with optional onNavigate handler.
  const renderNavLinks = (onNavigate) => (
    <>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map((n) => {
          const active =
            n.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <AdminLogoutButton />
      </div>
    </>
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col border-r border-border bg-card">
        {/* Sidebar header */}
        <Link
          href="/"
          className="flex items-center gap-2.5 px-6 h-16 border-b border-border font-display font-bold"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-hero text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-sm">Benzene Plus</span>
        </Link>
        {renderNavLinks()}
      </aside>

      {/* Mobile sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity",
          menuOpen ? "block lg:hidden" : "hidden",
        )}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      ></div>
      <aside
        className={cn(
          "fixed z-50 inset-y-0 left-0 w-64 bg-card border-r border-border flex-col transition-transform",
          menuOpen ? "flex translate-x-0" : "flex -translate-x-full",
          "lg:hidden",
        )}
        style={{ transitionProperty: "transform" }}
      >
        {/* Mobile sidebar header */}
        <div className="flex justify-between items-center h-16 border-b border-border px-6 font-display font-bold">
          <span className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-hero text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-sm">Benzene Plus</span>
          </span>
          <button
            className="p-2 rounded hover:bg-secondary"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        {/* Only nav links, no header */}
        <div className="flex-1 flex flex-col min-h-0">
          {renderNavLinks(() => setMenuOpen(false))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-card border-b border-border flex items-center px-6 justify-between">
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <button
              className="lg:hidden mr-2 p-2 rounded hover:bg-secondary focus:outline-none"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              type="button"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <h1 className="font-display font-bold text-lg">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">
              Signed in as admin
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              A
            </span>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
