import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock, Hash } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Lycée Mahazengy Fianarantsoa" },
      { name: "description", content: "Contactez le Lycée Mahazengy à Fianarantsoa : adresse, code établissement et informations pratiques." },
      { property: "og:title", content: "Contacter le Lycée Mahazengy" },
      { property: "og:description", content: "Coordonnées et informations pratiques du Lycée Mahazengy." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <section className="bg-navy text-primary-foreground">
        <div className="container-page py-16 md:py-20">
          <p className="text-sm font-medium uppercase tracking-wider text-gold">Nous contacter</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold">Contact & Informations</h1>
          <p className="mt-4 max-w-3xl text-white/80 leading-relaxed">
            Pour toute demande — inscription, renseignements pédagogiques ou administratifs — l'équipe
            du Lycée Mahazengy vous accueille.
          </p>
        </div>
      </section>

      <section className="container-page py-16 grid gap-10 lg:grid-cols-2">
        <div className="space-y-5">
          <Item icon={MapPin} title="Adresse">
            Quartier Mahazengy Nord, enceinte du CRINFP<br />
            ZAP Lalazana — Arrondissement Lalazana Ambany<br />
            Commune de Fianarantsoa<br />
            Région Haute Matsiatra, Province de Fianarantsoa<br />
            Madagascar
          </Item>
          <Item icon={Hash} title="Code établissement">301 010 043</Item>
          <Item icon={Clock} title="Horaires administratifs">
            Du lundi au vendredi<br />
            08h00 – 12h00 · 14h00 – 17h00
          </Item>
          <Item icon={Phone} title="Téléphone">
            Contact via le Secrétariat du lycée
          </Item>
          <Item icon={Mail} title="Rattachement">
            CISCO Fianarantsoa<br />
            DREN Haute Matsiatra<br />
            Ministère de l'Éducation Nationale
          </Item>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
          <iframe
            title="Carte — Lycée Mahazengy Fianarantsoa"
            src="https://www.openstreetmap.org/export/embed.html?bbox=47.033%2C-21.500%2C47.093%2C-21.467&layer=mapnik&marker=-21.48354%2C47.06277"
            className="w-full h-[420px] border-0"
            loading="lazy"
          />
          <div className="p-4 text-sm text-muted-foreground bg-secondary">
            Situé dans l'enceinte du CRINFP, à Mahazengy Nord (Fianarantsoa).
          </div>
        </div>
      </section>
    </>
  );
}

function Item({ icon: Icon, title, children }) {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-navy text-gold shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold text-navy">{title}</h3>
        <p className="mt-1 text-sm text-foreground/85 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

