import { createFileRoute } from "@tanstack/react-router";
import p0 from "@/assets/proviseurs/p0-rakotomamonjisoa.png";
import p1 from "@/assets/proviseurs/p1-minoarilala (2).jpg";
import p2 from "@/assets/proviseurs/p2-andriamampihatona.jpg";
import p3 from "@/assets/proviseurs/p3-ramiandrisoa.jpg";
import p4 from "@/assets/proviseurs/p4-ralainandrasana.jpg";
import p5 from "@/assets/proviseurs/p5-rakotonirina.jpg";
import p6 from "@/assets/proviseurs/p6-ramaholisoa.jpg";

export const Route = createFileRoute("/proviseurs")({
  head: () => ({
    meta: [
      { title: "Proviseurs successifs — Lycée Mahazengy" },
      { name: "description", content: "Découvrez les six chefs d'établissement successifs qui ont dirigé le Lycée Mahazengy depuis 2010." },
      { property: "og:title", content: "Les Proviseurs du Lycée Mahazengy" },
      { property: "og:description", content: "De M. RAKOTOMAMONJISOA à Mme RAMAHOLISOA : l'histoire des chefs d'établissement." },
    ],
  }),
  component: Proviseurs,
});

const items = [
  {
    photo: p0,
    name: "M. RAKOTOMAMONJISOA Jean de Dieu",
    role: "Responsable Pédagogique — Chef d'établissement fondateur",
    period: "2010 – 2013",
    note: "À l'ouverture du lycée, il n'y avait pas encore de Proviseur : le Responsable Pédagogique assurait l'administration. Nommé par la note de service n°10/006-CISCOF1/SP du 26/10/2010. Il a marqué la période par l'inauguration du lycée le 10 juin 2011 et l'obtention du décret d'ouverture n°2012/241 du 21 février 2012.",
  },
  {
    photo: p1,
    name: "M. MINOARILALA Tahina",
    role: "Premier Proviseur",
    period: "2013 – 2015",
    note: "Durant son provisorat, le lycée a été réhabilité et la cour dallée. Il est constaté que les personnels enseignants et administratifs entretenaient de bonnes relations.",
  },
  {
    photo: p2,
    name: "M. ANDRIAMAMPIHATONA Raherifiringa Ravaka",
    role: "Deuxième Proviseur",
    period: "2015 – 2017",
    note: "Nommé par la note de service n°2015/SS-DREN/HM/SAF/AF du 13 mai 2015. Très strict en matière textuelle, il a renforcé le matériel didactique via la caisse de soutien : livres, ballons, matériel de géométrie, mobilier de bureau, tableaux d'affichage. Sous son mandat, la FRAM a acheté la première tablette du lycée.",
  },
  {
    photo: p3,
    name: "M. RAMIANDRISOA Emmanuel",
    role: "Troisième Proviseur",
    period: "2017 – 2020",
    note: "Nommé par décision n°7230-MEN/SG/DRH/SES. Ancien professeur de Physique-Chimie du lycée dès sa création.",
  },
  {
    photo: p4,
    name: "M. RALAINANDRASANA Faralahikoa Derandraibe",
    role: "Quatrième Proviseur — IM 291 081",
    period: "2020 – 2022",
    note: "Nommé par la note n°2020/113-DREN-HM/SP du 16 décembre 2020. Grâce à la FRAM, il a doté l'administration de deux ordinateurs. Il a initié un partenariat avec le projet TREMPLIN, permettant à l'établissement de bénéficier d'un don de livres de l'Ambassade de France à Madagascar.",
  },
  {
    photo: p5,
    name: "M. RAKOTONIRINA Georges",
    role: "Cinquième Proviseur",
    period: "2022 – 2025",
    note: "Le plus jeune Proviseur du lycée, nommé sous la note n°2022/190-DREN/SGRH/Div.GPSAA-Aff. Il a modernisé le lycée avec l'achat de trois ordinateurs, une imprimante, du mobilier pour la salle des professeurs, et a renforcé la convivialité entre collègues.",
  },
  {
    photo: p6,
    name: "Mme RAMAHOLISOA Hasiniaina Santatra",
    role: "Proviseur actuel",
    period: "Depuis 2025",
    note: "Proviseur Adjoint depuis 2020 (note n°2019/226-DRENETP/HM/SAF/Aff), elle a rétabli l'amitié sino-malagasy et introduit l'enseignement du Mandarin dans le programme scolaire du lycée, d'abord comme activité parascolaire chaque mercredi.",
  },
];

function Proviseurs() {
  return (
    <>
      <section className="bg-navy text-primary-foreground">
        <div className="container-page py-16 md:py-20">
          <p className="text-sm font-medium uppercase tracking-wider text-gold">Chefs d'établissement</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold">Les Proviseurs successifs</h1>
          <p className="mt-4 max-w-3xl text-white/80 leading-relaxed">
            Depuis 2010, sept chefs d'établissement — d'abord un Responsable Pédagogique, puis six Proviseurs —
            ont porté la vision du Lycée Mahazengy.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <ol className="relative border-l-2 border-gold/40 space-y-12 pl-6 md:pl-10">
          {items.map((p, i) => (
            <li key={p.name} className="relative">
              <span className="absolute -left-[34px] md:-left-[44px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-gold-foreground font-display font-bold text-sm shadow-card">
                {i}
              </span>
              <div className="grid gap-6 md:grid-cols-[220px_1fr] items-start rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                  <img src={p.photo} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gold">{p.period}</p>
                  <h2 className="mt-1 font-display text-xl md:text-2xl font-bold text-navy">{p.name}</h2>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">{p.role}</p>
                  <p className="mt-4 text-sm text-foreground/85 leading-relaxed">{p.note}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}


