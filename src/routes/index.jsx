import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, GraduationCap, Users, Building2, Trophy, BookOpen } from "lucide-react";
import hero from "@/assets/lycee-facade.jpg";
import proviseurActuel from "@/assets/proviseurs/p6-ramaholisoa.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lycée Mahazengy Fianarantsoa — Accueil" },
      {
        name: "description",
        content:
          "Bienvenue au Lycée Mahazengy, établissement public secondaire de Fianarantsoa depuis 2010. Découvrez notre histoire, notre équipe et nos résultats.",
      },
      { property: "og:title", content: "Lycée Mahazengy Fianarantsoa" },
      {
        property: "og:description",
        content:
          "Établissement public secondaire depuis 2010, don de la République Populaire de Chine.",
      },
    ],
  }),
  component: Home,
});

const highlights = [
  { icon: GraduationCap, label: "Année d'ouverture", value: "2010" },
  { icon: Users, label: "Élèves (2023)", value: "363" },
  { icon: Building2, label: "Salles de classe", value: "8" },
  { icon: Trophy, label: "Taux BAC 2021", value: "72,45%" },
];

const cards = [
  {
    to: "/historique",
    icon: BookOpen,
    title: "Historique du Lycée",
    desc: "De sa fondation en 2010 à aujourd'hui : un don de la Chine devenu pilier éducatif de Fianarantsoa.",
  },
  {
    to: "/proviseurs",
    icon: Users,
    title: "Nos Proviseurs",
    desc: "Les six chefs d'établissement successifs qui ont façonné le Lycée Mahazengy.",
  },
  {
    to: "/resultats",
    icon: Trophy,
    title: "Résultats du BAC",
    desc: "Historique complet des résultats du baccalauréat depuis 2013.",
  },
  {
    to: "/personnel",
    icon: GraduationCap,
    title: "Personnel",
    desc: "Les 45 enseignants et administratifs qui accompagnent nos élèves.",
  },
  {
    to: "/fiche-technique",
    icon: Building2,
    title: "Fiche technique",
    desc: "Infrastructures, superficie, capacité et besoins de l'établissement.",
  },
];

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={hero}
            alt="Cour du Lycée Mahazengy"
            className="h-full w-full object-cover"
            width={1600}
            height={900}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/40" />
        </div>
        <div className="relative container-page py-24 md:py-36 text-primary-foreground">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gold">
            Fianarantsoa · Haute Matsiatra
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl">
            Lycée Mahazengy
            <span className="block text-gold">L&apos;excellence au cœur de Fianarantsoa</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80 leading-relaxed">
            Établissement public secondaire fondé en 2010, don de la République Populaire de Chine.
            Nous formons chaque année des centaines d&apos;élèves aux séries L, S et OSE dans une
            tradition d&apos;excellence et de rigueur.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/historique"
              className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-semibold text-gold-foreground hover:bg-gold/90 transition-colors shadow-elegant"
            >
              Découvrir notre histoire
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/5 backdrop-blur px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="container-page -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-xl bg-card shadow-elegant border border-border p-6">
          {highlights.map((h) => (
            <div key={h.label} className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-accent text-navy shrink-0">
                <h.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-navy">{h.value}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {h.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Message du proviseur */}
      <section className="container-page mt-24">
        <div className="grid gap-10 md:grid-cols-5 items-center">
          <div className="md:col-span-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-elegant">
              <img
                src={proviseurActuel}
                alt="Mme RAMAHOLISOA Hasiniaina Santatra, Proviseur"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="text-sm font-medium uppercase tracking-wider text-gold">
              Mot du Proviseur
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-navy">
              Un établissement en pleine croissance, tourné vers l&apos;excellence
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Depuis son ouverture en 2010, le Lycée Mahazengy est devenu un des trois lycées
              publics de la CISCO Fianarantsoa. Sous notre direction, cet établissement a renforcé
              la relation sino-malagasy avec l introduction du Mandarin au programme scolaire, et
              poursuit son œuvre au service de la jeunesse de la Haute Matsiatra.
            </p>
            <p className="mt-4 text-navy font-display text-lg font-semibold">
              Mme RAMAHOLISOA Hasiniaina Santatra
            </p>
            <p className="text-sm text-muted-foreground">Proviseur du Lycée Mahazengy</p>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="container-page mt-24">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-gold">Explorer</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-navy">
              Tout sur le Lycée Mahazengy
            </h2>
          </div>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group rounded-xl border border-border bg-card p-6 shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-navy text-gold">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-navy">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy group-hover:text-gold">
                Voir <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="pb-20" />
    </>
  );
}
