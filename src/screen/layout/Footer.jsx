import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-display font-bold"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-hero text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span>Benzene Plus Academy</span>
          </Link>
          <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
            A premium tutorial academy preparing Nigerian students for JAMB,
            WAEC, NECO, Post-UTME and CBT examinations with structured coaching
            and proven results.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  href={l.to}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Contact</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <Phone className="h-4 w-4 mt-0.5 text-accent" />
              {SITE.phone}
            </li>
            <li className="flex gap-2">
              <Mail className="h-4 w-4 mt-0.5 text-accent" />
              {SITE.email}
            </li>
            <li className="flex gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-accent" />
              {SITE.address}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-5 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <p>
            © {new Date().getFullYear()} Benzene Plus Academy. All rights
            reserved.
          </p>
          <p>Built for Nigerian scholars · JAMB · WAEC · NECO</p>
        </div>
      </div>
    </footer>
  );
}
