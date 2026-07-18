import { createFileRoute } from "@tanstack/react-router";
import { Building2, MapPin, Users, Ruler } from "lucide-react";

export const Route = createFileRoute("/fiche-technique")({
  head: () => ({
    meta: [
      { title: "Fiche technique — Lycée Mahazengy" },
      { name: "description", content: "Fiche technique du Lycée Mahazengy : localisation, bâtiments, terrain, effectifs et besoins." },
      { property: "og:title", content: "Fiche technique du Lycée Mahazengy" },
      { property: "og:description", content: "Infrastructures, capacité et besoins de l'établissement." },
    ],
  }),
  component: FicheTech,
});

function FicheTech() {
  return (
    <>
      <section className="bg-navy text-primary-foreground">
        <div className="container-page py-16 md:py-20">
          <p className="text-sm font-medium uppercase tracking-wider text-gold">Code établissement · 301 010 043</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold">Fiche technique</h1>
          <p className="mt-4 max-w-3xl text-white/80 leading-relaxed">
            L'ensemble des données officielles concernant les infrastructures, la superficie et les
            effectifs du Lycée Mahazengy.
          </p>
        </div>
      </section>

      <section className="container-page py-16 space-y-10">
        {/* Identité */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <InfoCard icon={MapPin} title="Emplacement" lines={["Fokontany : Mahazengy", "Commune : Fianarantsoa", "Région : Haute Matsiatra", "Province : Fianarantsoa"]} />
          <InfoCard icon={Building2} title="Acquisition" lines={["Don de la République", "Populaire de Chine", "Année : 2010"]} />
          <InfoCard icon={Ruler} title="Superficie" lines={["Total : 5 000 m² (½ ha)", "Cours : 1 000 m²", "Jardin : 500 m²", "Terrain de sport : 2 500 m²", "Bâtiments : 1 000 m²"]} />
          <InfoCard icon={Users} title="Capacité" lines={["400 élèves", "Effectif 2023 : 363 élèves"]} />
        </div>

        {/* Bâtiments */}
        <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-card">
          <h2 className="font-display text-2xl font-bold text-navy">Bâtiments</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Bloc title="1ᵉʳ Bloc — 12 bureaux"
              rows={[
                ["5 bureaux à l'étage", "Salle de dépôt, logement du Proviseur Adjoint et du Surveillant Général"],
                ["7 bureaux au rez-de-chaussée", "Personnels administratifs et salle des professeurs"],
              ]}
              note="9 armoires métalliques, 7 fauteuils, 9 tables à 7 tiroirs, 2 armoires bibliothèque, fenêtres vitrées."
            />
            <Bloc title="2ᵉ Bloc — 3 salles"
              rows={[
                ["2ⁿᵈᵉ I", "22 élèves"],
                ["2ⁿᵈᵉ II", "—"],
                ["1ʳᵉ OSE", "139 élèves"],
              ]}
              note="Équipement : 363 tables, 351 chaises élèves, table et chaise professeur, ampoules, ventilateurs."
            />
            <Bloc title="3ᵉ Bloc — 5 salles"
              rows={[
                ["1°L, 1°S", "—"],
                ["TL, T OSE, TS", "202 élèves"],
              ]}
              note="Terrain totalement clôturé, fenêtres vitrées."
            />
          </div>
        </div>

        {/* Effectif */}
        <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-card">
          <h2 className="font-display text-2xl font-bold text-navy">Effectif</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-4">
            <Stat n="26" label="Professeurs" detail="10 Scientifiques · 11 Littéraires · 1 TICE · 1 EAC · 1 EPS · 2 SES" />
            <Stat n="363" label="Élèves" detail="Répartis sur les classes de Seconde à Terminale" />
            <Stat n="07" label="Personnel administratif" detail="Proviseur, Proviseur Adjoint, Surveillant Général, Secrétaires, Scolarité" />
            <Stat n="02" label="Personnel d'appui" detail="1 gardien, 1 femme de ménage" />
          </div>
        </div>

        {/* Besoins */}
        <div className="rounded-xl border border-gold/40 bg-accent/40 p-6 md:p-8">
          <h2 className="font-display text-2xl font-bold text-navy">Besoins de l'établissement</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2 text-sm">
            {[
              "Tables et bancs supplémentaires",
              "Extension des salles et du terrain de sport",
              "Salle d'informatique et équipements informatiques",
              "Laboratoires de Physique-Chimie, Sciences Naturelles et Langues",
              "Imprimante performante",
              "Matériel pédagogique complémentaire",
            ].map((b) => (
              <li key={b} className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground italic">
            Vu le nombre croissant d'élèves, une extension du lycée est envisagée sur le terrain de sport
            pour permettre l'accueil de tous les élèves de la périphérie.
          </p>
        </div>
      </section>
    </>
  );
}

function InfoCard({ icon: Icon, title, lines }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-navy text-gold">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-navy">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
        {lines.map((l) => <li key={l}>{l}</li>)}
      </ul>
    </div>
  );
}

function Bloc({ title, rows, note }) {
  return (
    <div className="rounded-lg border border-border p-5">
      <h3 className="font-display text-lg font-semibold text-navy">{title}</h3>
      <dl className="mt-3 space-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 border-b border-border pb-1.5">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-right font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-muted-foreground italic">{note}</p>
    </div>
  );
}

function Stat({ n, label, detail }) {
  return (
    <div>
      <div className="font-display text-3xl font-bold text-gold">{n}</div>
      <div className="mt-1 text-sm font-semibold text-navy">{label}</div>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{detail}</p>
    </div>
  );
}

