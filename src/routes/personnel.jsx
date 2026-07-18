import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/personnel")({
  head: () => ({
    meta: [
      { title: "Personnel — Lycée Mahazengy Fianarantsoa" },
      { name: "description", content: "Liste du personnel administratif et enseignant du Lycée Mahazengy — juillet 2026." },
      { property: "og:title", content: "Personnel du Lycée Mahazengy" },
      { property: "og:description", content: "45 membres du personnel administratif et enseignant." },
    ],
  }),
  component: Personnel,
});

const staff = [
  { n: 1, nom: "RAMAHOLISOA Hasiniaina Santatra", genre: "F", fonction: "Proviseur" },
  { n: 2, nom: "AINA ANDRINIRINA Rabia Marcellin", genre: "M", fonction: "Surveillant Général" },
  { n: 3, nom: "RAHARINIRINTSOA Albina Roussella", genre: "F", fonction: "Secrétaire Comptable" },
  { n: 4, nom: "RASOAMBOLA Oliva Regis", genre: "F", fonction: "Dépositaire Comptable" },
  { n: 5, nom: "RAHARITSOA Jeanne Marie Patricia", genre: "F", fonction: "Secrétaire" },
  { n: 6, nom: "RAKOTORAHALAHY Mamindrainy Vololoniaina", genre: "F", fonction: "Responsable Scolarité" },
  { n: 7, nom: "RAVONJIARISOA Haingonirina Samuëline Gilberte", genre: "F", fonction: "Bibliothécaire" },
  { n: 8, nom: "RAZAFITSAROVANA Hasinandrato", genre: "F", fonction: "Bibliothécaire" },
  { n: 9, nom: "SAMIARILALA Sisi Jean Aimé", genre: "M", fonction: "Veilleur de Nuit" },
  { n: 10, nom: "RASOLOFONIAINA Samuelzà", genre: "M", fonction: "Surveillant" },
  { n: 11, nom: "RAZAFITRIMO Malalatiana", genre: "F", fonction: "Éducatrice" },
  { n: 12, nom: "RANDRIANAIVO Tsilavina Gracia", genre: "F", fonction: "Éducatrice" },
  { n: 13, nom: "ANJARASOA Heritina Juna Murella", genre: "F", fonction: "Femme de Ménage" },
  { n: 14, nom: "RAVELOSOAMBOLA François Jean Paul", genre: "M", fonction: "Responsable d'Examen" },
  { n: 15, nom: "MINOARISOA Suzanne", genre: "F", fonction: "H.G" },
  { n: 16, nom: "RAZANANTAHINA Lalarisoa", genre: "F", fonction: "H.G" },
  { n: 17, nom: "ANDRIAMPANALINDAHY Florent Brice", genre: "M", fonction: "H.G" },
  { n: 18, nom: "RAVAOMALALA Voahanginirina Myriame", genre: "F", fonction: "MLG" },
  { n: 19, nom: "RAZAFINDRAFARA Maminirina Daniella", genre: "F", fonction: "MLG" },
  { n: 20, nom: "RATONGAVAO Solonirina Marie Elianne", genre: "F", fonction: "MLG" },
  { n: 21, nom: "RAZAFINDRAVAO D'Assise Sabine Lucie", genre: "F", fonction: "PHILO" },
  { n: 22, nom: "RAHERINA Laza", genre: "M", fonction: "MATHS" },
  { n: 23, nom: "ANDRIANASOLO Hanitriniaina Niry", genre: "F", fonction: "MATHS" },
  { n: 24, nom: "RAVAOARISOA David", genre: "F", fonction: "MATHS" },
  { n: 25, nom: "RASAHONDRANIRINA Vola", genre: "F", fonction: "MATHS" },
  { n: 26, nom: "RAZANANANDRASANA Aimée Sylviane", genre: "F", fonction: "MATHS" },
  { n: 27, nom: "ANDRIAMANDIAMANANA Jose Olivier Chrysante", genre: "M", fonction: "SPC" },
  { n: 28, nom: "RASABOTSY Jean Martin", genre: "M", fonction: "SPC" },
  { n: 29, nom: "RAVAOASINERA Gisele", genre: "F", fonction: "SPC" },
  { n: 30, nom: "ANDRIAMANANJARA Masiarisaotra", genre: "F", fonction: "SPC" },
  { n: 31, nom: "ANDRIAFANJATIANA Weysrock Patricia", genre: "F", fonction: "SVT" },
  { n: 32, nom: "RAMANGASOAVOLA Francissia", genre: "F", fonction: "SVT" },
  { n: 33, nom: "RAMAROSON Josiane", genre: "F", fonction: "FRS" },
  { n: 34, nom: "RAMARONAHINA Fabrice Diannol", genre: "M", fonction: "FRS" },
  { n: 35, nom: "TAITSY NDRIHA Nomena", genre: "F", fonction: "ANG" },
  { n: 36, nom: "HASINIAINA Jeanne Marie Claire", genre: "F", fonction: "ANG" },
  { n: 37, nom: "ANJARASOA Chantal Georgia", genre: "F", fonction: "ANG" },
  { n: 38, nom: "RABEBIARISOA Ange Omega", genre: "F", fonction: "EAC" },
  { n: 39, nom: "RASOANOMENJANAHARY Marie Justine", genre: "F", fonction: "EAC" },
  { n: 40, nom: "RAZAFIARIVONY NANDRASANAELA Marie Tonette", genre: "F", fonction: "SES" },
  { n: 41, nom: "RAZANAMASY Odile Lilie", genre: "F", fonction: "SES" },
  { n: 42, nom: "RAKOTOMALALA Rindra Nantenaina", genre: "F", fonction: "FRS SES" },
  { n: 43, nom: "MORARIVONY RAZAFINDRAKOTO Micheline", genre: "F", fonction: "TICE" },
  { n: 44, nom: "RAZAFINDRAIBE Ramanantsoa Daniel", genre: "M", fonction: "EPS" },
  { n: 45, nom: "VALIMBAVAKARISOA Andriamisa Eloi", genre: "M", fonction: "MANDARIN" },
];

const ADMIN_ROLES = new Set([
  "Proviseur", "Surveillant Général", "Secrétaire Comptable", "Dépositaire Comptable",
  "Secrétaire", "Responsable Scolarité", "Bibliothécaire", "Veilleur de Nuit",
  "Surveillant", "Éducatrice", "Femme de Ménage", "Responsable d'Examen",
]);

function Personnel() {
  const [q, setQ] = useState("");
  const [fonctionFilter, setFonctionFilter] = useState("all");
  const [category, setCategory] = useState("tous");
  const [sortBy, setSortBy] = useState("num");
  const [page, setPage] = useState(1);
  const perPage = 15;

  const admin = staff.filter((s) => ADMIN_ROLES.has(s.fonction));
  const enseignants = staff.filter((s) => !ADMIN_ROLES.has(s.fonction));

  const fonctions = Array.from(new Set(staff.map((s) => s.fonction))).sort();

  const base =
    category === "admin" ? admin : category === "enseignants" ? enseignants : staff;

  // Search: allow searching by name / fonction, or by number when the query is numeric
  const isNumericQuery = q.trim().length > 0 && /^[0-9]+$/.test(q.trim());

  const filtered = base
    .filter((s) => (fonctionFilter === "all" ? true : s.fonction === fonctionFilter))
    .filter((s) => {
      if (!q) return true;
      if (isNumericQuery) return s.n === Number(q.trim());
      return (s.nom + " " + s.fonction).toLowerCase().includes(q.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "nom") return a.nom.localeCompare(b.nom);
      if (sortBy === "fonction") return a.fonction.localeCompare(b.fonction) || a.nom.localeCompare(b.nom);
      return a.n - b.n;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Keep current page when filters change; totalPages logic keeps page in-range.
  const resetPage = (setter) => (value) => {
    setter(value);
  };

  return (
    <>
      <section className="bg-navy text-primary-foreground">
        <div className="container-page py-16 md:py-20">
          <p className="text-sm font-medium uppercase tracking-wider text-gold">Effectif · Juillet 2026</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold">Notre personnel</h1>
          <p className="mt-4 max-w-3xl text-white/80 leading-relaxed">
            L'équipe administrative et enseignante du Lycée Mahazengy compte {staff.length} membres au service
            de la réussite des élèves.
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
            <Stat n={staff.length} label="Total personnel" />
            <Stat n={admin.length} label="Administratifs" />
            <Stat n={enseignants.length} label="Enseignants" />
            <Stat n={staff.filter(s => s.genre === "F").length} label="Femmes" />
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rechercher</label>
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); }}
                placeholder="Nom, N° ou fonction..."
                aria-label="Rechercher un membre du personnel par nom, numéro ou fonction"
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Catégorie</label>
              <select
                value={category}
                onChange={(e) => resetPage(setCategory)(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="tous">Tous ({staff.length})</option>
                <option value="admin">Administratifs ({admin.length})</option>
                <option value="enseignants">Enseignants ({enseignants.length})</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fonction</label>
              <select
                value={fonctionFilter}
                onChange={(e) => resetPage(setFonctionFilter)(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">Toutes les fonctions</option>
                {fonctions.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trier par</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="num">N° d'ordre</option>
                <option value="nom">Nom (A-Z)</option>
                <option value="fonction">Fonction</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-navy">{filtered.length}</span> résultat{filtered.length > 1 ? "s" : ""} ·
            page {currentPage} / {totalPages}
          </p>
        </div>

        <StaffTable list={pageItems} />

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-40"
            >
              Précédent
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`rounded-md px-3 py-1.5 text-sm border ${
                  p === currentPage
                    ? "bg-navy text-primary-foreground border-navy"
                    : "bg-card border-border hover:bg-accent"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        )}
      </section>
    </>
  );
}

function Stat({ n, label }) {
  return (
    <div className="rounded-lg bg-white/10 border border-white/15 px-4 py-3 backdrop-blur">
      <div className="font-display text-2xl font-bold text-gold">{n}</div>
      <div className="text-xs text-white/70 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function StaffTable({ list }) {
  return (
    <div className="mt-4">
      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[540px]">
          <thead className="bg-secondary text-secondary-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-semibold w-12">N°</th>
              <th className="px-4 py-3 text-left font-semibold">Nom et Prénoms</th>
              <th className="px-4 py-3 text-left font-semibold w-24">Genre</th>
              <th className="px-4 py-3 text-left font-semibold">Fonction</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.n} className="border-t border-border hover:bg-accent/40">
                <td className="px-4 py-3 text-muted-foreground">{s.n}</td>
                <td className="px-4 py-3 font-medium text-foreground">{s.nom}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.genre === "F" ? "Féminin" : "Masculin"}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-navy">
                    {s.fonction}
                  </span>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">Aucun résultat.</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}


