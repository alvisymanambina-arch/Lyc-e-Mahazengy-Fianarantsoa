import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/historique", label: "Historique" },
  { to: "/proviseurs", label: "Proviseurs" },
  { to: "/personnel", label: "Personnel" },
  { to: "/resultats", label: "Résultats BAC" },
  { to: "/fiche-technique", label: "Fiche technique" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="leading-tight">
            <div className="font-display text-base font-semibold text-foreground">Lycée Mahazengy</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Fianarantsoa · Madagascar</div>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-navy bg-accent" }}
              className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:text-navy hover:bg-accent/60 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container-page flex flex-col py-2">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-navy bg-accent" }}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-sm font-medium text-muted-foreground rounded-md hover:text-navy hover:bg-accent/60"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
