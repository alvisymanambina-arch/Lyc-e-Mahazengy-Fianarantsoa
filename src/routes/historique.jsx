import { createFileRoute } from "@tanstack/react-router";
import histImg from "@/assets/proviseurs/historique.jpg";
import facade from "@/assets/lycee-facade.jpg";
import carte from "@/assets/carte-arrondissement.png";

export const Route = createFileRoute("/historique")({
  head: () => ({
    meta: [
      { title: "Historique — Lycée Mahazengy Fianarantsoa" },
      { name: "description", content: "L'histoire du Lycée Mahazengy depuis 2010 : sa fondation, don de la Chine, ses proviseurs successifs et son évolution." },
      { property: "og:title", content: "Historique du Lycée Mahazengy" },
      { property: "og:description", content: "De 2010 à aujourd'hui : l'histoire complète du Lycée Mahazengy Fianarantsoa." },
    ],
  }),
  component: Historique,
});

function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section className="bg-navy text-primary-foreground">
      <div className="container-page py-16 md:py-20">
        <p className="text-sm font-medium uppercase tracking-wider text-gold">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold">{title}</h1>
        {subtitle && <p className="mt-4 max-w-3xl text-white/80 leading-relaxed">{subtitle}</p>}
      </div>
    </section>
  );
}

function Historique() {
  return (
    <>
      <PageHeader
        eyebrow="Depuis 2010"
        title="Historique du Lycée Mahazengy"
        subtitle="Un don de la République Populaire de Chine devenu, au fil des ans, l'un des piliers du secondaire public à Fianarantsoa."
      />

      {/* Large real photo of the school */}
      <div className="container-page pt-12">
        <figure className="overflow-hidden rounded-2xl border border-border shadow-elegant">
          <img src={facade} alt="Façade du Lycée Mahazengy avec les drapeaux de Madagascar et de la Chine" className="w-full h-[260px] md:h-[460px] object-cover" />
          <figcaption className="bg-card px-6 py-3 text-sm text-muted-foreground italic">
            La façade du Lycée Mahazengy — un don de la République Populaire de Chine, aujourd'hui pilier
            du secondaire public à Fianarantsoa.
          </figcaption>
        </figure>
      </div>

      <article className="container-page py-16 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8 text-foreground/90 leading-relaxed">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy">Un emplacement stratégique</h2>
            <p className="mt-3">
              Le Lycée de Mahazengy se trouve dans le quartier de Mahazengy Nord, dans l'enceinte du CRINFP,
              c'est-à-dire sur le terrain du CRINFP et à l'Est du CEG. Il fait partie de la ZAP LALAZANA,
              dans l'arrondissement de Lalazana ambany. C'est l'un des trois lycées de la CISCO Fianarantsoa
              de la DREN Haute Matsiatra.
            </p>
            <figure className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
              <img
                src={carte}
                alt="Carte des sept arrondissements de la commune urbaine de Fianarantsoa, avec la position du Lycée Mahazengy à Lalazana"
                className="w-full object-contain bg-white"
                loading="lazy"
              />
              <figcaption className="px-4 py-3 text-xs text-muted-foreground italic border-t border-border">
                Arrondissements dans la commune urbaine de Fianarantsoa — le Lycée Mahazengy est situé
                dans l'arrondissement de Lalazana ambany.
              </figcaption>
            </figure>

            <h3 className="mt-8 font-display text-lg font-bold text-navy">Les sept arrondissements</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Extraits de la carte ci-dessus : les sept arrondissements qui composent la commune urbaine
              de Fianarantsoa. Celui de Lalazana accueille le Lycée Mahazengy.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
              {[
                { nom: "Manolafaka", zone: "Nord" },
                { nom: "Tanana Ambany", zone: "Centre-Est" },
                { nom: "Tanana Ambony", zone: "Centre" },
                { nom: "Vatosola", zone: "Ouest" },
                { nom: "Andrainjato Avaratra", zone: "Est" },
                { nom: "Andrainjato Atsimo", zone: "Sud-Est" },
                { nom: "Lalazana", zone: "Sud — Lycée Mahazengy", highlight: true },
              ].map((c) => (
                <li
                  key={c.nom}
                  className={
                    "rounded-lg border px-3 py-2 flex items-center justify-between gap-2 " +
                    (c.highlight
                      ? "border-gold bg-gold/10 text-navy font-semibold"
                      : "border-border bg-card text-foreground")
                  }
                >
                  <span>{c.nom}</span>
                  <span className={"text-xs " + (c.highlight ? "text-navy/80" : "text-muted-foreground")}>{c.zone}</span>
                </li>
              ))}
            </ul>
          </div>



          <div>
            <h2 className="font-display text-2xl font-bold text-navy">Un don de la Chine</h2>
            <p className="mt-3">
              Ce lycée est un don de la République Démocratique et Populaire de Chine. Initialement,
              c'était un don destiné à la construction d'une EPP de référence et en même temps lieu de
              pratique pour les élèves maîtres du CRINFP. Face à l'insuffisance de lycées dans la CISCO
              Fianarantsoa, la DREN Haute Matsiatra a négocié avec le donateur et le MEN pour que cette
              construction devienne le troisième lycée public de la CISCO Fianarantsoa, après la SEMIPI
              réservée aux garçons visant une carrière militaire.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-navy">L'ouverture — année scolaire 2010-2011</h2>
            <p className="mt-3">
              Le lycée a ouvert ses portes aux élèves de seconde durant l'année scolaire 2010-2011.
              La première promotion comptait <strong>100 élèves</strong>, tous en classe de seconde,
              avec seulement quelques enseignants :
            </p>
            <ul className="mt-4 space-y-2 list-disc pl-5">
              <li>M. RAKOTOMAMONJISOA Jean de Dieu, Responsable pédagogique et professeur de mathématiques</li>
              <li>M. RAMIANDRISOA Emmanuel, professeur de Physique-Chimie</li>
              <li>Mme RASOARINIVO Lydia, professeur de SVT</li>
              <li>M. Jeannot R., professeur d'Histoire-Géographie, EPS et Environnement</li>
              <li>Mlle Lalaina R., professeur de Malagasy</li>
            </ul>
            <p className="mt-4">
              Un an plus tard, M. RAVOAVY Fidèle assurait l'anglais malgré son rôle de chef CISCO de
              Fianarantsoa. Mme Marguerite terminait sa carrière au lycée comme professeur de Français.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-navy">Inauguration et reconnaissance officielle</h2>
            <p className="mt-3">
              L'inauguration du lycée a eu lieu le <strong>10 juin 2011</strong>, suivie de l'obtention
              du décret d'ouverture n°2012/241 du 21 février 2012. Dans le cadre de l'amitié
              sino-malagasy, des échanges de coopération et de visites avec la Chine ont été organisés
              pour des représentants du lycée.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-navy">Une évolution constante</h2>
            <p className="mt-3">
              Sous la conduite des proviseurs successifs, le lycée a été réhabilité, la cour dallée,
              le mobilier renouvelé. Le partenariat avec le projet TREMPLIN et l'Ambassade de France
              a permis d'enrichir la bibliothèque. Depuis 2020, sous l'impulsion de Mme RAMAHOLISOA
              Hasiniaina Santatra, l'amitié sino-malagasy est rétablie et le <strong>Mandarin</strong>
              a été intégré au programme scolaire.
            </p>
          </div>
        </div>

        <aside className="space-y-6">
          <img src={histImg} alt="Image d'archive du lycée" className="w-full rounded-xl shadow-card border border-border" loading="lazy" />
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-semibold text-navy">Chiffres clés</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between border-b border-border pb-2">
                <dt className="text-muted-foreground">Ouverture</dt><dd className="font-medium">2010</dd>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <dt className="text-muted-foreground">Inauguration</dt><dd className="font-medium">10 juin 2011</dd>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <dt className="text-muted-foreground">Décret d'ouverture</dt><dd className="font-medium">21 fév. 2012</dd>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <dt className="text-muted-foreground">Code établissement</dt><dd className="font-medium">301 010 043</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Superficie</dt><dd className="font-medium">5 000 m²</dd>
              </div>
            </dl>
          </div>
        </aside>
      </article>
    </>
  );
}

