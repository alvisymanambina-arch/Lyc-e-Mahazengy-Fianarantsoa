import { Link } from "@tanstack/react-router";
import { MapPin, Mail, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-navy text-primary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div>
            <div className="font-display text-lg font-semibold">Lycée Mahazengy</div>
            <div className="text-xs uppercase tracking-wider text-white/60">Depuis 2010</div>
          </div>
          <p className="mt-4 text-sm text-white/70 leading-relaxed">
            Établissement public secondaire de la CISCO Fianarantsoa, DREN Haute Matsiatra. Un don de la
            République Populaire de Chine, ouvert aux élèves depuis 2010.
          </p>
        </div>
        <div>
          <h3 className="font-display text-base font-semibold text-gold">Navigation</h3>
          <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm text-white/80">
            <li><Link to="/historique" className="hover:text-gold">Historique</Link></li>
            <li><Link to="/proviseurs" className="hover:text-gold">Proviseurs</Link></li>
            <li><Link to="/personnel" className="hover:text-gold">Personnel</Link></li>
            <li><Link to="/resultats" className="hover:text-gold">Résultats BAC</Link></li>
            <li><Link to="/fiche-technique" className="hover:text-gold">Fiche technique</Link></li>
            <li><Link to="/documents" className="hover:text-gold">Documents</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-base font-semibold text-gold">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex gap-3">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
              <span>Mahazengy Nord, enceinte du CRINFP<br/>ZAP Lalazana, Fianarantsoa<br/>Haute Matsiatra, Madagascar</span>
            </li>
            <li className="flex gap-3">
              <Phone className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
              <span>Code établissement : 301 010 043</span>
            </li>
            <li className="flex gap-3">
              <Mail className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
              <Link to="/contact" className="hover:text-gold">Nous contacter</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-5 text-xs text-white/60 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Lycée Mahazengy Fianarantsoa. Tous droits réservés.</span>
          <span>Fitiavana · Tanindrazana · Fandrosoana</span>
        </div>
      </div>
    </footer>
  );
}
