import { createFileRoute } from "@tanstack/react-router";
import { FileText, FileSpreadsheet, Download } from "lucide-react";
import expositionAsset from "@/assets/exposition-15eme.asset.json";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents officiels — Lycée Mahazengy" },
      { name: "description", content: "Téléchargez les documents officiels du Lycée Mahazengy : rapports de rentrée, situations d'effectifs, résultats du BAC et archives historiques." },
      { property: "og:title", content: "Documents du Lycée Mahazengy" },
      { property: "og:description", content: "Rapports, fiches techniques et archives à télécharger." },
    ],
  }),
  component: Documents,
});

const docs = [
  { title: "Historique du Lycée Mahazengy (2024-2025)", desc: "Version mise à jour de l'historique complet.", href: "/documents/HISTORIQUE%20LMZ%202024-2025.docx", kind: "docx" },
  { title: "Historique du Lycée Mahazengy (version initiale)", desc: "Rédaction initiale de l'historique.", href: "/documents/Historique%20LMZ.docx", kind: "docx" },
  { title: "Rapport de la rentrée 2024-2025", desc: "Descriptif détaillé de la rentrée, listes des élèves et du personnel.", href: "/documents/Rapport%20%20de%20la%20rentr%C3%A9e%202024-2025.docx", kind: "docx" },
  { title: "Résultats du BAC depuis 2012", desc: "Historique complet des résultats du baccalauréat par série.", href: "/documents/RESULTATS%20BAC%20DEPUIS%202012.docx", kind: "docx" },
  { title: "Taux de réussite, redoublement, abandon", desc: "Statistiques détaillées (version en cours de mise à jour).", href: "/documents/TAUX%20DE%20REUSSITE%20;%20RED;ABANDON%20(Pas%20%C3%A0%20jours).docx", kind: "docx" },
  { title: "Fiche technique 2023", desc: "Fiche technique complète de l'établissement.", href: "/documents/fiche%20techn%202023.docx", kind: "docx" },
  { title: "Fiche technique — juillet 2017", desc: "Version antérieure de la fiche technique.", href: "/documents/fiche%20techn%20juillet%2017.docx", kind: "docx" },
  { title: "Liste du personnel LMZ", desc: "Liste complète du personnel administratif et enseignant.", href: "/documents/PERSONNELS%20LMZ.xlsx", kind: "xlsx" },
  { title: "Situation des élèves, PA et PE depuis 2010", desc: "Évolution des effectifs élèves et personnels depuis l'ouverture.", href: "/documents/SITUATION%20DES%20ELEVES%20;%20PA%20ET%20PE%20DEPUIS%202010.xlsx", kind: "xlsx" },
  { title: "Exposition — 15ᵉ anniversaire (mise à jour)", desc: "Support d'exposition pour le 15ᵉ anniversaire du lycée.", href: expositionAsset.url, kind: "docx" },
];

function Documents() {
  return (
    <>
      <section className="bg-navy text-primary-foreground">
        <div className="container-page py-16 md:py-20">
          <p className="text-sm font-medium uppercase tracking-wider text-gold">Archives officielles</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold">Documents à télécharger</h1>
          <p className="mt-4 max-w-3xl text-white/80 leading-relaxed">
            Rapports, fiches techniques, historique et statistiques : consultez les documents officiels
            du Lycée Mahazengy Fianarantsoa.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-4 md:grid-cols-2">
          {docs.map((d) => {
            const Icon = d.kind === "xlsx" ? FileSpreadsheet : FileText;
            return (
              <a
                key={d.title}
                href={d.href}
                download
                className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-elegant hover:border-gold/50 transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-accent text-navy shrink-0">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base font-semibold text-navy group-hover:text-gold transition-colors">
                    {d.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-snug">{d.desc}</p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
                    Format {d.kind.toUpperCase()}
                  </p>
                </div>
                <Download className="h-5 w-5 text-muted-foreground shrink-0 group-hover:text-gold" />
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}


