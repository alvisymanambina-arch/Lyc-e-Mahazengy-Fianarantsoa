import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, PageBreak, Header, Footer,
  TableOfContents, NumberFormat, PageNumber, SectionType,
  WidthType, ShadingType, BorderStyle, ImageRun,
  convertInchesToTwip, convertMillimetersToTwip
} from "docx";
import { writeFileSync } from "fs";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const FONT_BODY = "Times New Roman";
const FONT_HEADING = "Times New Roman";
const COLOR_BODY = "000000";
const COLOR_ACCENT = "1B3A5C";
const COLOR_SECONDARY = "555555";
const LINE_SPACING = 360; // 1.5 line spacing for academic
const INDENT_FIRST = 720; // 1.27cm indent
const PAGE_W = 11906;
const PAGE_H = 16838;
const MT = 1440; // margin top ~2.54cm
const MB = 1440;
const ML = 1701; // left ~3cm
const MR = 1418; // right ~2.5cm
const CONTENT_W = PAGE_W - ML - MR; // usable width

// ─── HELPERS ────────────────────────────────────────────────────────────────
const ep = (sp = 200) => new Paragraph({ spacing: { after: sp } });

const p = (text, opts = {}) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { line: LINE_SPACING, after: 140 },
  indent: { firstLine: INDENT_FIRST },
  ...opts,
  children: [new TextRun({ text, font: { name: FONT_BODY }, size: 24, color: COLOR_BODY })],
});

const pni = (text, opts = {}) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { line: LINE_SPACING, after: 140 },
  ...opts,
  children: [new TextRun({ text, font: { name: FONT_BODY }, size: 24, color: COLOR_BODY })],
});

const pb = (label, text) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { line: LINE_SPACING, after: 140 },
  indent: { firstLine: INDENT_FIRST },
  children: [
    new TextRun({ text: label, font: { name: FONT_BODY }, size: 24, bold: true, color: COLOR_BODY }),
    new TextRun({ text, font: { name: FONT_BODY }, size: 24, color: COLOR_BODY }),
  ],
});

const ct = (text, sz = 24, b = false, clr = COLOR_BODY) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 100 },
  children: [new TextRun({ text, font: { name: FONT_BODY }, size: sz, bold: b, color: clr })],
});

const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  alignment: AlignmentType.LEFT,
  spacing: { before: 480, after: 280, line: LINE_SPACING },
  children: [new TextRun({ text, font: { name: FONT_HEADING }, size: 32, bold: true, color: COLOR_BODY })],
});

const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  alignment: AlignmentType.LEFT,
  spacing: { before: 360, after: 200, line: LINE_SPACING },
  children: [new TextRun({ text, font: { name: FONT_HEADING }, size: 28, bold: true, color: COLOR_BODY })],
});

const h3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  alignment: AlignmentType.LEFT,
  spacing: { before: 240, after: 160, line: LINE_SPACING },
  children: [new TextRun({ text, font: { name: FONT_HEADING }, size: 26, bold: true, italics: true, color: COLOR_BODY })],
});

function tc(text, opts = {}) {
  return new TableCell({
    width: { size: opts.w || 2000, type: WidthType.DXA },
    shading: opts.h ? { type: ShadingType.CLEAR, fill: "D9E2F3" } : undefined,
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    children: [new Paragraph({
      alignment: opts.a || AlignmentType.LEFT,
      spacing: { line: 280 },
      children: [new TextRun({ text, font: { name: FONT_BODY }, size: opts.s || 21, bold: !!opts.h, color: COLOR_BODY })],
    })],
  });
}

function tbl(headers, rows, widths) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: headers.map((h, i) => tc(h, { h: true, w: widths[i], a: AlignmentType.CENTER })) }),
      ...rows.map(row => new TableRow({ cantSplit: true, children: row.map((c, i) => tc(c, { w: widths[i], a: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER })) })),
    ],
  });
}

// ─── COVER ────────────────────────────────────────────────────────────────────
function coverSection() {
  return {
    properties: { page: { margin: { top: MT, bottom: MB, left: ML, right: MR }, size: { width: PAGE_W, height: PAGE_H } }, titlePage: true },
    children: [
      ep(600),
      ct("REPUBLIQUE DE MADAGASCAR", 28, true),
      ep(60),
      ct("Minist\u00e8re de l\u2019\u00c9ducation Nationale", 24),
      ct("Universit\u00e9 de Fianarantsoa", 24),
      ct("Facult\u00e9 des Sciences et Technologies", 24, false, COLOR_SECONDARY),
      ep(40),
      ct("D\u00e9partement d\u2019\u00c9lectronique Appliqu\u00e9e et d\u2019Informatique Industrielle", 22, false, COLOR_SECONDARY),
      ep(800),
      ct("MEMOIRE DE FIN D\u2019ETUDES", 32, true, COLOR_ACCENT),
      ct("Pour l\u2019obtention du Dipl\u00f4me de Licence 3", 22, false, COLOR_SECONDARY),
      ep(60),
      ct("Parcours : \u00c9lectronique Appliqu\u00e9e et Informatique Industrielle", 22, false, COLOR_SECONDARY),
      ep(700),
      ct("Conception et d\u00e9veloppement d\u2019un site web", 26, true, COLOR_ACCENT),
      ct("pour le Lyc\u00e9e Mahazengy de Fianarantsoa", 24, false, COLOR_ACCENT),
      ep(800),
      ct("Pr\u00e9sent\u00e9 et soutenu par :", 22, false, COLOR_SECONDARY),
      ep(40),
      ct("ALVISY MANAMBINA Nestor", 28, true),
      ep(300),
      ct("Stage effectu\u00e9 au Lyc\u00e9e Mahazengy, Fianarantsoa", 22, false, COLOR_SECONDARY),
      ct("Encadrant professionnel : [Nom de l\u2019enseignant d\u2019informatique]", 20, false, COLOR_SECONDARY),
      ep(600),
      ct("P\u00e9riode de stage : Juin \u2014 Septembre 2026", 22, false, COLOR_SECONDARY),
      ep(40),
      ct("Ann\u00e9e universitaire 2025 \u2013 2026", 22, false, COLOR_SECONDARY),
    ],
  };
}

// ─── REMERCIEMENTS ────────────────────────────────────────────────────────────
function remerciements() {
  return [
    ep(200),
    ct("REMERCIEMENTS", 28, true, COLOR_ACCENT),
    ep(300),
    p("Je tiens tout d\u2019abord \u00e0 remercier Dieu Tout-Puissant de m\u2019avoir accord\u00e9 la sant\u00e9, la force et la sagesse tout au long de mon parcours universitaire et particuli\u00e8rement durant la r\u00e9alisation de ce m\u00e9moire de fin d\u2019\u00e9tudes. Sans Sa gr\u00e2ce, ce travail n\u2019aurait pas pu voir le jour."),
    p("Mes sinc\u00e8res remerciements s\u2019adressent au Corps professoral du D\u00e9partement d\u2019\u00c9lectronique Appliqu\u00e9e et d\u2019Informatique Industrielle de la Facult\u00e9 des Sciences et Technologies de l\u2019Universit\u00e9 de Fianarantsoa. Leur d\u00e9vouement, leur rigueur et la qualit\u00e9 de leur enseignement ont constitu\u00e9 le fondement de mes comp\u00e9tences techniques et professionnelles. Les trois ann\u00e9es de formation pass\u00e9es au sein de ce d\u00e9partement m\u2019ont apport\u00e9 des connaissances tant th\u00e9oriques que pratiques qui se sont r\u00e9v\u00e9l\u00e9es indispensables pour la r\u00e9alisation de ce projet."),
    p("Je tiens \u00e0 exprimer ma profonde gratitude envers Mme RAMAHOLISOA Hasiniaina Santatra, Proviseur du Lyc\u00e9e Mahazengy, qui m\u2019a chaleureusement accueilli au sein de son \u00e9tablissement et m\u2019a accord\u00e9 toute la confiance n\u00e9cessaire pour mener \u00e0 bien ce projet de stage. Son ouverture d\u2019esprit et sa compr\u00e9hension ont cr\u00e9\u00e9 un cadre de travail propice \u00e0 l\u2019apprentissage et \u00e0 la r\u00e9alisation de ce m\u00e9moire."),
    p("Je remercie \u00e9galement mon encadrant professionnel au Lyc\u00e9e Mahazengy, enseignant d\u2019informatique, pour son accompagnement constant, ses conseils avis\u00e9s et sa disponibilit\u00e9 tout au long de la p\u00e9riode de stage. Sa patience et ses orientations techniques et p\u00e9dagogiques ont \u00e9t\u00e9 d\u2019un pr\u00e9cieux secours pour la r\u00e9ussite de ce travail. Ses remarques constructives m\u2019ont permis d\u2019am\u00e9liorer significativement la qualit\u00e9 du projet."),
    p("Ma gratitude va \u00e9galement \u00e0 l\u2019ensemble du personnel administratif et enseignant du Lyc\u00e9e Mahazengy, qui ont facilit\u00e9 mon int\u00e9gration dans l\u2019\u00e9tablissement et m\u2019ont fourni les informations, donn\u00e9es et documents n\u00e9cessaires \u00e0 la r\u00e9alisation de ce projet. Leur coop\u00e9ration a \u00e9t\u00e9 essentielle pour la collecte des donn\u00e9es historiques, des r\u00e9sultats acad\u00e9miques et des informations structurelles qui nourrissent ce m\u00e9moire."),
    p("Je ne saurais oublier ma famille, et particuli\u00e8rement mes parents, pour leur soutien moral, financier et mat\u00e9riel inconditionnel tout au long de mon parcours universitaire. Leurs sacrifices et leurs encouragements ont \u00e9t\u00e9 le moteur de ma pers\u00e9v\u00e9rance. Que ce m\u00e9moire soit pour eux le t\u00e9moignage de ma reconnaissance."),
    p("Enfin, je remercie mes amis et camarades de promotion pour l\u2019entraide, les \u00e9changes fructueux et l\u2019ambiance studieuse qui ont rendu cette ann\u00e9e universitaire particuli\u00e8rement enrichissante."),
  ];
}

// ─── LISTE ABREVIATIONS ───────────────────────────────────────────────────────
function abreviations() {
  const items = [
    ["API", "Application Programming Interface"], ["BAC", "Baccalaur\u00e9at"], ["CDN", "Content Delivery Network"],
    ["CISCO", "Circonscription Scolaire"], ["CRINFP", "Centre R\u00e9gional de Formation et d\u2019Information P\u00e9dagogique"],
    ["CSS", "Cascading Style Sheets"], ["DREN", "Direction R\u00e9gionale de l\u2019\u00c9ducation Nationale"],
    ["EAC", "Enseignement Artistique et Culturel"], ["EPS", "\u00c9ducation Physique et Sportive"],
    ["ESR", "Enseignement Sup\u00e9rieur et de la Recherche"],
    ["FRAM", "Fikambanan\u2019ny Ray Amin-dReny Zaza (Association des Parents d\u2019\u00c9l\u00e8ves)"],
    ["FRS", "Fran\u00e7ais"], ["HTML", "HyperText Markup Language"], ["H.G.", "Histoire-G\u00e9ographie"],
    ["JSX", "JavaScript XML"], ["JSON", "JavaScript Object Notation"], ["MEN", "Minist\u00e8re de l\u2019\u00c9ducation Nationale"],
    ["MLG", "Langue Malagasy"], ["npm", "Node Package Manager"], ["OSE", "Organisation et Syst\u00e8mes d\u2019Entreprise"],
    ["PA", "Personnel Administratif"], ["PE", "Personnel Enseignant"], ["PHP", "PHP Hypertext Preprocessor"],
    ["RSC", "R\u00e9seaux et Syst\u00e8mes de Communication"], ["SEO", "Search Engine Optimization"],
    ["SES", "Sciences \u00c9conomiques et Sociales"], ["SPC", "Sciences Physiques et Chimiques"],
    ["SSR", "Server-Side Rendering"], ["SVG", "Scalable Vector Graphics"], ["SVT", "Sciences de la Vie et de la Terre"],
    ["TICE", "Technologies de l\u2019Information et de la Communication pour l\u2019\u00c9ducation"],
    ["UI/UX", "User Interface / User Experience"], ["XML", "eXtensible Markup Language"], ["ZAP", "Zone d\u2019Administration P\u00e9dagogique"],
  ];
  const ch = [ep(100), ct("LISTE DES ABREVIATIONS", 28, true, COLOR_ACCENT), ep(200)];
  for (const [a, f] of items) {
    ch.push(new Paragraph({
      spacing: { line: LINE_SPACING, after: 80 },
      children: [
        new TextRun({ text: a, font: { name: FONT_BODY }, size: 22, bold: true, color: COLOR_BODY }),
        new TextRun({ text: ` : ${f}`, font: { name: FONT_BODY }, size: 22, color: COLOR_BODY }),
      ],
    }));
  }
  return ch;
}

// ─── INTRODUCTION ────────────────────────────────────────────────────────────
function introduction() {
  return [
    h1("Introduction"),
    ep(100),
    p("L\u2019av\u00e8nement du num\u00e9rique a profond\u00e9ment transform\u00e9 les modes de communication, d\u2019\u00e9ducation et de gestion dans le monde entier. Madagascar, en tant que pays en d\u00e9veloppement, n\u2019\u00e9chappe pas \u00e0 cette r\u00e9volution num\u00e9rique qui touche progressivement tous les secteurs de la vie publique et priv\u00e9e. Dans le domaine de l\u2019\u00e9ducation, les \u00e9tablissements scolaires sont de plus en plus appel\u00e9s \u00e0 moderniser leurs outils de communication et de gestion de l\u2019information afin de r\u00e9pondre aux exigences d\u2019une soci\u00e9t\u00e9 de plus en plus connect\u00e9e et inform\u00e9e."),
    p("Le Lyc\u00e9e Mahazengy de Fianarantsoa, en tant qu\u2019\u00e9tablissement public secondaire relevant de la CISCO (Circonscription Scolaire) de Fianarantsoa sous la tutelle de la DREN (Direction R\u00e9gionale de l\u2019\u00c9ducation Nationale) Haute Matsiatra, constitue un cas repr\u00e9sentatif de cette n\u00e9cessit\u00e9 de modernisation num\u00e9rique. Malgr\u00e9 un riche patrimoine historique, un personnel d\u00e9vou\u00e9 et des r\u00e9sultats acad\u00e9miques en constante progression depuis sa cr\u00e9ation en 2010, ce lyc\u00e9e ne disposait pas, jusqu\u2019\u00e0 pr\u00e9sent, d\u2019une plateforme num\u00e9rique lui permettant de pr\u00e9senter ses activit\u00e9s, ses r\u00e9sultats et ses donn\u00e9es institutionnelles au grand public."),
    p("Les informations relatives \u00e0 l\u2019historique de l\u2019\u00e9tablissement, \u00e0 la liste de ses proviseurs successifs, \u00e0 la composition de son personnel, \u00e0 ses r\u00e9sultats au Baccalaur\u00e9at, \u00e0 ses infrastructures et \u00e0 ses documents officiels \u00e9taient dispers\u00e9es dans de multiples fichiers papier et documents num\u00e9riques non centralis\u00e9s. Cette absence de vitrine num\u00e9rique limitait consid\u00e9rablement la visibilit\u00e9 de l\u2019\u00e9tablissement et sa capacit\u00e9 \u00e0 communiquer efficacement avec les parents d\u2019\u00e9l\u00e8ves, les partenaires \u00e9ducatifs et le public en g\u00e9n\u00e9ral. Par ailleurs, dans un contexte o\u00f9 de plus en plus d\u2019\u00e9tablissements scolaires dans le monde disposent de leur propre site web, cette lacune repr\u00e9sentait un retard significatif par rapport aux standards modernes de communication institutionnelle."),

    h2("1.1. Probl\u00e9matique"),
    p("Face \u00e0 ce constat, la probl\u00e9matique g\u00e9n\u00e9rale de ce m\u00e9moire peut \u00eatre formul\u00e9e ainsi : comment concevoir et d\u00e9velopper un site web moderne, performant et accessible permettant au Lyc\u00e9e Mahazengy de Fianarantsoa de pr\u00e9senter de mani\u00e8re structur\u00e9e et professionnelle l\u2019ensemble de ses donn\u00e9es institutionnelles, son historique, son organisation, ses r\u00e9sultats acad\u00e9miques et ses ressources documentaires ?"),
    p("De mani\u00e8re plus sp\u00e9cifique, ce travail s\u2019articule autour des sous-questions suivantes : Quelles technologies web contemporaines utiliser pour garantir un site \u00e0 la fois rapide, s\u00e9curis\u00e9, optimis\u00e9 pour le r\u00e9f\u00e9rencement (SEO) et facilement d\u00e9ployable sur une plateforme d\u2019h\u00e9bergement moderne ? Comment structurer et organiser les informations de l\u2019\u00e9tablissement pour qu\u2019elles soient claires, navigables et accessibles \u00e0 tous les types d\u2019utilisateurs ? Comment assurer la p\u00e9rennit\u00e9 du projet au-del\u00e0 de la p\u00e9riode de stage, de mani\u00e8re \u00e0 ce que l\u2019\u00e9tablissement puisse maintenir et mettre \u00e0 jour le site de mani\u00e8re autonome ?"),

    h2("1.2. Objectifs du stage"),
    p("L\u2019objectif g\u00e9n\u00e9ral de ce stage de fin d\u2019\u00e9tudes en Licence 3 est de concevoir et de d\u00e9velopper un site web officiel et fonctionnel pour le Lyc\u00e9e Mahazengy de Fianarantsoa, en utilisant les technologies web modernes les plus adapt\u00e9es aux besoins sp\u00e9cifiques d\u2019un \u00e9tablissement scolaire public malgache."),
    p("Les objectifs sp\u00e9cifiques assign\u00e9s \u00e0 ce travail sont les suivants :"),
    pni("Premi\u00e8rement, collecter, v\u00e9rifier, organiser et num\u00e9riser l\u2019ensemble des donn\u00e9es disponibles de l\u2019\u00e9tablissement, notamment l\u2019historique depuis sa cr\u00e9ation en 2010, la liste des proviseurs successifs avec leurs p\u00e9riodes de mandat et leurs contributions respectives, la composition compl\u00e8te du personnel administratif et enseignant, les r\u00e9sultats du Baccalaur\u00e9at depuis la premi\u00e8re session de 2013-2014, la fiche technique d\u00e9taillant les infrastructures et les capacit\u00e9s de l\u2019\u00e9tablissement, ainsi que les documents officiels t\u00e9l\u00e9chargeables."),
    pni("Deuxi\u00e8mement, concevoir l\u2019architecture informationnelle et l\u2019interface utilisateur d\u2019un site web moderne, responsive et professionnel, en tenant compte des besoins sp\u00e9cifiques d\u2019un \u00e9tablissement scolaire et des habitudes de navigation des diff\u00e9rents types d\u2019utilisateurs (parents d\u2019\u00e9l\u00e8ves, \u00e9tudiants, partenaires, grand public)."),
    pni("Troisi\u00e8mement, d\u00e9velopper le site en utilisant un \u00e9cosyst\u00e8me technologique moderne et performant, garantissant la rapidit\u00e9 de chargement, l\u2019optimisation pour les moteurs de recherche, la compatibilit\u00e9 avec tous les appareils (ordinateurs, tablettes, smartphones) et la facilit\u00e9 de maintenance."),
    pni("Quatri\u00e8mement, d\u00e9ployer le site sur une plateforme d\u2019h\u00e9bergement fiable et accessible publiquement, avec un processus de d\u00e9ploiement automatis\u00e9 garantissant la continuit\u00e9 du service."),
    pni("Cinqui\u00e8mement, assurer la p\u00e9rennit\u00e9 du projet en mettant en place un syst\u00e8me de contr\u00f4le de version et en documentant les proc\u00e9dures de mise \u00e0 jour, afin que l\u2019\u00e9tablissement puisse maintenir le site de mani\u00e8re autonome apr\u00e8s le d\u00e9part du stagiaire."),

    h2("1.3. M\u00e9thodologie de travail"),
    p("Pour atteindre les objectifs fix\u00e9s, une m\u00e9thodologie de travail structur\u00e9e et it\u00e9rative a \u00e9t\u00e9 adopt\u00e9e tout au long de la p\u00e9riode de stage, s\u2019\u00e9tendant du mois de juin au mois de septembre 2026. Cette m\u00e9thodologie s\u2019est articul\u00e9e autour de cinq phases principales, chacune aboutissant \u00e0 des livrables identifiables et v\u00e9rifiables."),
    p("La premi\u00e8re phase, dite de recherche et collecte de donn\u00e9es, s\u2019est d\u00e9roul\u00e9e durant les deux premi\u00e8res semaines du stage. Elle a consist\u00e9 \u00e0 effectuer des entretiens avec le personnel administratif et enseignant du lyc\u00e9e, \u00e0 consulter les archives et documents existants (rapports de rentr\u00e9e, fiches techniques, historiques, relev\u00e9s de notes), et \u00e0 compiler l\u2019ensemble des informations n\u00e9cessaires \u00e0 l\u2019alimentation du site web. Cette phase s\u2019est r\u00e9v\u00e9l\u00e9e cruciale car la qualit\u00e9 et l\u2019exhaustivit\u00e9 des donn\u00e9es collect\u00e9es d\u00e9terminent directement la richesse et la fiabilit\u00e9 du contenu du site."),
    p("La deuxi\u00e8me phase, consacr\u00e9e \u00e0 l\u2019analyse des besoins fonctionnels, a permis d\u2019identifier les pages n\u00e9cessaires, les fonctionnalit\u00e9s attendues et les contraintes techniques. L\u2019analyse a r\u00e9v\u00e9l\u00e9 le besoin de huit pages principales couvrant l\u2019ensemble des aspects de la vie de l\u2019\u00e9tablissement, ainsi que des fonctionnalit\u00e9s sp\u00e9cifiques comme la recherche de personnel, la visualisation graphique des r\u00e9sultats et le t\u00e9l\u00e9chargement de documents."),
    p("La troisi\u00e8me phase, celle de la conception, a port\u00e9 sur l\u2019architecture du site, le choix des technologies et la d\u00e9finition des maquettes de l\u2019interface utilisateur. Un travail de veille technologique approfondi a \u00e9t\u00e9 r\u00e9alis\u00e9 pour identifier les meilleures solutions adapt\u00e9es au contexte malgache (contraintes de bande passante, h\u00e9bergement gratuit, facilit\u00e9 de maintenance)."),
    p("La quatri\u00e8me phase, le d\u00e9veloppement proprement dit, s\u2019est d\u00e9roul\u00e9e de mani\u00e8re it\u00e9rative sur plusieurs semaines, avec des commits r\u00e9guliers documentant chaque avanc\u00e9e significative. Chaque fonctionnalit\u00e9 a \u00e9t\u00e9 d\u00e9velopp\u00e9e, test\u00e9e et valid\u00e9e avant de passer \u00e0 la suivante."),
    p("Enfin, la cinqui\u00e8me phase a concern\u00e9 le d\u00e9ploiement en production sur la plateforme Vercel, les tests de validation finaux et la r\u00e9daction du pr\u00e9sent m\u00e9moire documentant l\u2019ensemble du processus."),
  ];
}

// ─── CHAPITRE 1 ──────────────────────────────────────────────────────────────
function chapitre1() {
  return [
    h1("Chapitre 2 : Pr\u00e9sentation de la structure d\u2019accueil"),
    h2("2.1. Le Lyc\u00e9e Mahazengy : origine et cr\u00e9ation"),
    p("Le Lyc\u00e9e Mahazengy est un \u00e9tablissement public secondaire d\u2019enseignement g\u00e9n\u00e9ral situ\u00e9 dans le Fokontany Mahazengy, au Quartier Mahazengy Nord, dans l\u2019enceinte du CRINFP (Centre R\u00e9gional de Formation et d\u2019Information P\u00e9dagogique). Il se trouve dans la ZAP (Zone d\u2019Administration P\u00e9dagogique) Lalazana, Arrondissement Lalazana Ambany, au sein de la Commune Urbaine de Fianarantsoa, Chef-lieu de la R\u00e9gion Haute Matsiatra et de la Province de Fianarantsoa, Madagascar. Son code \u00e9tablissement officiel, attribu\u00e9 par le Minist\u00e8re de l\u2019\u00c9ducation Nationale, est le 301 010 043."),
    p("La cr\u00e9ation de cet \u00e9tablissement trouve ses racines dans un don de la R\u00e9publique Populaire de Chine \u00e0 la R\u00e9publique de Madagascar. \u00c0 l\u2019origine, cette construction \u00e9tait destin\u00e9e \u00e0 abriter une \u00c9cole Primaire Publique (EPP) de r\u00e9f\u00e9rence ainsi qu\u2019un site de pratique pour les \u00e9tudiants-professeurs du CRINFP. Les b\u00e2timents, typiques de l\u2019architecture scolaire chinoise avec des murs blancs et des toits en tuiles, ont \u00e9t\u00e9 \u00e9difi\u00e9s sur un terrain de 5 000 m\u00b2, soit un demi-hectare."),
    p("Cependant, face \u00e0 la p\u00e9nurie aigu\u00eb de lyc\u00e9es publics au sein de la CISCO de Fianarantsoa \u2014 qui ne comptait que deux \u00e9tablissements secondaires publics \u00e0 l\u2019\u00e9poque, dont le SEMIPI r\u00e9serv\u00e9 aux gar\u00e7ons visant une carri\u00e8re militaire \u2014 la DREN Haute Matsiatre a engag\u00e9 des n\u00e9gociations avec le donateur et le Minist\u00e8re de l\u2019\u00c9ducation Nationale. L\u2019objectif \u00e9tait de convertir cette construction en un troisi\u00e8me lyc\u00e9e public de la circonscription, afin de r\u00e9pondre \u00e0 la demande croissante de scolarisation au niveau secondaire dans la r\u00e9gion."),
    p("L\u2019\u00e9tablissement a ainsi ouvert ses portes lors de l\u2019ann\u00e9e scolaire 2010-2011, avec une premi\u00e8re cohorte de 100 \u00e9l\u00e8ves, tous inscrits en classe de Seconde. Les premi\u00e8res semaines ont \u00e9t\u00e9 marqu\u00e9es par des d\u00e9fis logistiques importants, li\u00e9s \u00e0 l\u2019adaptation des locaux initialement con\u00e7us pour un usage primaire aux besoins d\u2019un enseignement secondaire. L\u2019inauguration officielle a eu lieu le 10 juin 2011, en pr\u00e9sence des autorit\u00e9s \u00e9ducatives r\u00e9gionales et locales. Le d\u00e9cret d\u2019ouverture officiel, num\u00e9rot\u00e9 n\u00b0 2012/241 et sign\u00e9 le 21 f\u00e9vrier 2012, a confirm\u00e9 le statut l\u00e9gal de l\u2019\u00e9tablissement et a marqu\u00e9 son int\u00e9gration compl\u00e8te dans le paysage \u00e9ducatif malgache."),

    h2("2.2. Historique et \u00e9volution depuis 2010"),
    p("Depuis sa cr\u00e9ation, le Lyc\u00e9e Mahazengy a connu une \u00e9volution remarquable tant sur le plan des effectifs que des infrastructures et de la qualit\u00e9 de l\u2019enseignement dispens\u00e9. Les premiers enseignants, nomm\u00e9s pour l\u2019ann\u00e9e scolaire 2010-2011, formaient une \u00e9quipe restreinte mais d\u00e9vou\u00e9e. M. RAKOTOMAMONJISOA Jean de Dieu, d\u00e9sign\u00e9 Responsable P\u00e9dagogique par la note de service n\u00b0 10/006-CISCOF1/SP du 26 octobre 2010, assurait \u00e9galement l\u2019enseignement des Math\u00e9matiques. Il \u00e9tait second\u00e9 par M. RAMIANDRISOA Emmanuel pour les Sciences Physiques et Chimiques, Mme RASOARINIVO Lydia pour les Sciences de la Vie et de la Terre (SVT), M. Jeannot R. pour l\u2019Histoire-G\u00e9ographie, l\u2019\u00c9ducation Physique et Sportive (EPS) et l\u2019Environnement, ainsi que Mlle Lalaina R. pour la langue Malagasy."),
    p("L\u2019ann\u00e9e suivante, le corps enseignant s\u2019est \u00e9toit\u00e9 avec l\u2019arriv\u00e9e de M. RAVOAVY Fid\u00e8le, alors Chef CISCO de Fianarantsoa, qui assurait b\u00e9n\u00e9volement l\u2019enseignement de l\u2019Anglais malgr\u00e9 ses responsabilit\u00e9s administratives, t\u00e9moignant de l\u2019engagement des autorit\u00e9s \u00e9ducatives envers ce nouvel \u00e9tablissement. Mme Marguerite, quant \u00e0 elle, a termin\u00e9 sa carri\u00e8re d\u2019enseignante de Fran\u00e7ais au lyc\u00e9e, apportant son exp\u00e9rience p\u00e9dagogique \u00e0 cette jeune structure."),
    p("Sous l\u2019impulsion des proviseurs successifs, l\u2019\u00e9tablissement a b\u00e9n\u00e9fici\u00e9 d\u2019am\u00e9liorations infrastructurelles significatives. Le premier proviseur, M. MINOARILALA Tahina, a supervis\u00e9 la r\u00e9habilitation des b\u00e2timents et le pavage de la cour, am\u00e9liorant consid\u00e9rablement le cadre de vie des \u00e9l\u00e8ves et du personnel. Son successeur, M. ANDRIAMAMPIHATONA Raherifiringa Ravaka, nomm\u00e9 par la note n\u00b0 2015/SS-DREN/HM/SAF/AF du 13 mai 2015, s\u2019est distingu\u00e9 par son attention particuli\u00e8re au renforcement du mat\u00e9riel didactique, utilisant les ressources de la caisse de soutien pour acqu\u00e9rir des livres, des ballons, des mat\u00e9riel de g\u00e9om\u00e9trie, du mobilier de bureau et des panneaux d\u2019affichage. C\u2019est \u00e9galement sous son mandat que le FRAM (Fikambanan\u2019ny Ray Amin-dReny Zaza) a fait l\u2019acquisition du premier ordinateur tablette de l\u2019\u00e9tablissement."),
    p("La p\u00e9riode 2017-2020, sous la direction de M. RAMIANDRISOA Emmanuel, a \u00e9t\u00e9 marqu\u00e9e par la stabilit\u00e9 institutionnelle. Ancien professeur de Sciences Physiques et Chimiques du lyc\u00e9e depuis sa cr\u00e9ation, M. RAMIANDRISOA connaissait parfaitement l\u2019\u00e9tablissement, ce qui a facilit\u00e9 la continuit\u00e9 des projets en cours."),
    p("Le mandat de M. RALAINANDRASANA Faralahiko Derandraibe (2020-2022) a \u00e9t\u00e9 marqu\u00e9 par l\u2019ouverture de l\u2019\u00e9tablissement aux partenariats internationaux. \u00c0 travers le FRAM, il a dot\u00e9 l\u2019administration de deux ordinateurs. Il a surtout initi\u00e9 un partenariat fructueux avec le Projet TREMPLIN et l\u2019Ambassade de France, qui a abouti \u00e0 une donation de livres enrichissant consid\u00e9rablement la biblioth\u00e8que de l\u2019\u00e9tablissement."),
    p("M. RAKOTONIRINA Georges (2022-2025), le plus jeune proviseur qu\u2019ait connu l\u2019\u00e9tablissement, a poursuivi la modernisation en acqu\u00e9rant trois ordinateurs suppl\u00e9mentaires, une imprimante, du mobilier pour la salle des professeurs et en renfor\u00e7ant la coll\u00e9gialit\u00e9 au sein de l\u2019\u00e9quipe p\u00e9dagogique."),
    p("Depuis 2025, sous la direction de Mme RAMAHOLISOA Hasiniaina Santatra, l\u2019\u00e9tablissement a connu un tournant d\u00e9cisif dans son ouverture internationale. L\u2019amiti\u00e9 sino-malgache, qui \u00e9tait \u00e0 l\u2019origine m\u00eame de la cr\u00e9ation du lyc\u00e9e, a \u00e9t\u00e9 restaur\u00e9e. La langue mandarine a \u00e9t\u00e9 int\u00e9gr\u00e9e au cursus scolaire, initialement sous forme d\u2019activit\u00e9 parascolaire du mercredi, avant d\u2019\u00eatre progressivement int\u00e9gr\u00e9e dans l\u2019emploi du temps. Cette initiative, pionnière dans la r\u00e9gion, t\u00e9moigne de la vision de modernit\u00e9 et d\u2019ouverture de l\u2019\u00e9tablissement."),

    h2("2.3. Les proviseurs successifs"),
    p("Le tableau ci-dessous pr\u00e9sente la liste compl\u00e8te des sept responsables qui ont dirig\u00e9 le Lyc\u00e9e Mahazengy depuis sa cr\u00e9ation, avec leurs p\u00e9riodes de mandat respectives et leurs principales contributions au d\u00e9veloppement de l\u2019\u00e9tablissement :"),
    tbl(
      ["N\u00b0", "Nom complet", "P\u00e9riode", "Contribution principale"],
      [
        ["1", "M. RAKOTOMAMONJISOA Jean de Dieu", "2010 \u2013 2013", "Fondateur de l\u2019\u00e9tablissement, inauguration officielle du 10 juin 2011, obtention du d\u00e9cret d\u2019ouverture n\u00b0 2012/241 du 21 f\u00e9vrier 2012"],
        ["2", "M. MINOARILALA Tahina", "2013 \u2013 2015", "R\u00e9habilitation des b\u00e2timents, pavage de la cour, am\u00e9lioration des conditions de travail et d\u2019\u00e9tude"],
        ["3", "M. ANDRIAMAMPIHATONA R.R.", "2015 \u2013 2017", "Renforcement du mat\u00e9riel didactique via la caisse de soutien, acquisition du premier ordinateur tablette par le FRAM"],
        ["4", "M. RAMIANDRISOA Emmanuel", "2017 \u2013 2020", "Stabilit\u00e9 institutionnelle, continuit\u00e9 des projets p\u00e9dagogiques, bonne gestion des ressources humaines"],
        ["5", "M. RALAINANDRASANA F.D.", "2020 \u2013 2022", "Partenariat Projet TREMPLIN et Ambassade de France, donation de livres, \u00e9quipement informatique administratif"],
        ["6", "M. RAKOTONIRINA Georges", "2022 \u2013 2025", "Modernisation num\u00e9rique (3 PC + imprimante), renouvellement du mobilier, renforcement de la coll\u00e9gialit\u00e9"],
        ["7", "Mme RAMAHOLISOA H.S.", "Depuis 2025", "Restauration du lien sino-malgache, introduction de la langue mandarine dans le cursus"],
      ],
      [500, 2500, 1200, 5826],
    ),
    ep(100),

    h2("2.4. Situation g\u00e9ographique et administrative"),
    p("Le Lyc\u00e9e Mahazengy est situ\u00e9 dans la commune urbaine de Fianarantsoa, qui compte sept arrondissements. La commune, situ\u00e9e au c\u0153ur de la R\u00e9gion Haute Matsiatra, est la capitale provinciale de la province de Fianarantsoa, troisi\u00e8me ville de Madagascar par sa population. L\u2019arrondissement de Lalazana, dans lequel se trouve le lyc\u00e9e, correspond \u00e0 la zone sud de la ville. Le lyc\u00e9e est positionn\u00e9 \u00e0 l\u2019est du CEG (Coll\u00e8ge d\u2019Enseignement G\u00e9n\u00e9ral) du quartier, dans l\u2019enceinte m\u00eame du CRINFP, ce qui facilite la coordination p\u00e9dagogique entre les diff\u00e9rents niveaux d\u2019enseignement."),
    p("Administrativement, le Lyc\u00e9e Mahazengy rel\u00e8ve d\u2019une hi\u00e9rarchie \u00e9ducative bien d\u00e9finie. Il est plac\u00e9 sous la tutelle directe de la CISCO (Circonscription Scolaire) de Fianarantsoa, qui assure la coordination et la supervision des \u00e9tablissements scolaires de la ville. La CISCO elle-m\u00eame est rattach\u00e9e \u00e0 la DREN (Direction R\u00e9gionale de l\u2019\u00c9ducation Nationale) Haute Matsiatra, responsable de la politique \u00e9ducative au niveau r\u00e9gional. Enfin, l\u2019ensemble est plac\u00e9 sous l\u2019autorit\u00e9 du MEN (Minist\u00e8re de l\u2019\u00c9ducation Nationale) au niveau national."),
    p("Les horaires administratifs de l\u2019\u00e9tablissement sont fix\u00e9s du lundi au vendredi, de 08h00 \u00e0 12h00 le matin et de 14h00 \u00e0 17h00 l\u2019apr\u00e8s-midi. Ces horaires correspondent aux standards appliqu\u00e9s dans l\u2019ensemble des \u00e9tablissements scolaires publics malgaches. L\u2019\u00e9tablissement dispose \u00e9galement d\u2019un service de secr\u00e9tariat assurant l\u2019accueil du public et la gestion des dossiers administratifs."),
  ];
}

// ─── CHAPITRE 2 ──────────────────────────────────────────────────────────────
function chapitre2() {
  return [
    h1("Chapitre 3 : \u00c9tat des lieux et analyse des besoins"),
    h2("3.1. Infrastructures et \u00e9quipements"),
    p("Le Lyc\u00e9e Mahazengy s\u2019\u00e9tend sur une superficie totale de 5 000 m\u00b2, soit un demi-hectare, offert par la R\u00e9publique Populaire de Chine lors de la cr\u00e9ation de l\u2019\u00e9tablissement en 2010. L\u2019espace disponible est r\u00e9parti entre les b\u00e2timents, la cour de r\u00e9cr\u00e9ation, le jardin et le terrain de sport. Le tableau suivant pr\u00e9sente la r\u00e9partition d\u00e9taill\u00e9e de la superficie :"),
    tbl(
      ["Zone", "Superficie (m\u00b2)", "Description"],
      [
        ["Terrain total", "5 000", "Superficie totale du terrain c\u00e9d\u00e9 \u00e0 l\u2019\u00e9tablissement"],
        ["B\u00e2timents (3 blocs)", "1 000", "Regroupe 8 salles de classe et 12 bureaux administratifs"],
        ["Cour de r\u00e9cr\u00e9ation", "1 000", "Espace pav\u00e9 pour les r\u00e9cr\u00e9ations des \u00e9l\u00e8ves"],
        ["Jardin", "500", "Jardin p\u00e9dagogique et botanique"],
        ["Terrain de sport", "2 500", "Terrain utilis\u00e9 pour l\u2019EPS et les activit\u00e9s sportives"],
      ],
      [3000, 2500, 4526],
    ),
    ep(100),
    p("Les b\u00e2timents comprennent trois blocs distincts. Le premier bloc abrite douze bureaux, dont cinq \u00e0 l\u2019\u00e9tage sup\u00e9rieur (utilis\u00e9s comme d\u00e9p\u00f4t et logements de fonction pour le Proviseur Adjoint et le Surveillant G\u00e9n\u00e9ral) et sept au rez-de-chauss\u00e9e (bureaux administratifs et salle des professeurs). Ce bloc dispose de neuf armoires m\u00e9talliques, sept fauteuils, neuf tables \u00e0 sept tiroirs, deux armoires de biblioth\u00e8que et des fen\u00eatres vitr\u00e9es. Le deuxi\u00e8me bloc contient trois salles de classe accueillant les classes de Seconde I (22 \u00e9l\u00e8ves), Seconde II et Premi\u00e8re OSE (139 \u00e9l\u00e8ves). Le troisi\u00e8me bloc dispose de cinq salles de classe pour les Premi\u00e8re L, Premi\u00e8re S, Terminale L, Terminale OSE et Terminale S (202 \u00e9l\u00e8ves au total)."),
    p("L\u2019\u00e9quipement mobilier comprend 363 tables-bancs d\u2019\u00e9l\u00e8ves, 351 chaises, des tables et chaises de professeurs, des ampoules \u00e9lectriques et des ventilateurs. La capacit\u00e9 maximale th\u00e9orique de l\u2019\u00e9tablissement est de 400 \u00e9l\u00e8ves, avec un effectif r\u00e9el de 363 \u00e9l\u00e8ves en 2023, soit un taux de remplissage de pr\u00e8s de 91 %. L\u2019\u00e9tablissement est int\u00e9gralement ceintur\u00e9 par un mur de cl\u00f4ture, garantissant la s\u00e9curit\u00e9 des \u00e9l\u00e8ves et du personnel."),

    h2("3.2. Effectifs du personnel"),
    p("Au mois de juillet 2026, le Lyc\u00e9e Mahazengy compte un effectif total de 45 agents, r\u00e9partis entre 14 membres du personnel administratif et 31 enseignants. Cette composition refl\u00e8te la structure typique d\u2019un \u00e9tablissement secondaire public malgache de taille moyenne, o\u00f9 le personnel enseignant repr\u00e9sente environ les deux tiers de l\u2019effectif total."),
    p("Le personnel administratif est compos\u00e9 du Proviseur (Mme RAMAHOLISOA Hasiniaina Santatra), du Surveillant G\u00e9n\u00e9ral, de deux secr\u00e9taires (dont une secr\u00e9taire comptable et une d\u00e9positaire comptable), d\u2019un responsable de scolarit\u00e9, de deux biblioth\u00e9caires, de deux \u00e9ducateurs, d\u2019un surveillant, d\u2019un veilleur de nuit, d\u2019un responsable d\u2019examen et d\u2019une femme de m\u00e9nage. On note une forte pr\u00e9dominance f\u00e9minine au sein du personnel administratif, avec 10 femmes sur 14 postes."),
    p("Le tableau suivant pr\u00e9sente la r\u00e9partition des enseignants par discipline :"),
    tbl(
      ["Discipline", "Code", "Effectif"],
      [
        ["Math\u00e9matiques", "MATHS", "5"],
        ["Sciences Physiques et Chimiques", "SPC", "4"],
        ["Histoire-G\u00e9ographie", "H.G.", "3"],
        ["Langue Malagasy", "MLG", "3"],
        ["Anglais", "ANG", "3"],
        ["Fran\u00e7ais", "FRS", "2 (+1 FRS/SES)"],
        ["Sciences \u00c9conomiques et Sociales", "SES", "2 (+1 FRS/SES)"],
        ["Arts et Culture", "EAC", "2"],
        ["Sciences de la Vie et de la Terre", "SVT", "2"],
        ["Philosophie", "PHILO", "1"],
        ["Technologies de l\u2019Information et de la Communication", "TICE", "1"],
        ["\u00c9ducation Physique et Sportive", "EPS", "1"],
        ["Mandarin", "MANDARIN", "1"],
        ["TOTAL", "", "31"],
      ],
      [5000, 2000, 3026],
    ),
    ep(100),
    p("On constate que les disciplines scientifiques (Math\u00e9matiques et SPC) totalisent \u00e0 elles seules 9 enseignants, soit pr\u00e8s de 30 % du corps professoral, ce qui refl\u00e8te l\u2019importance accord\u00e9e aux sciences dans le curriculum malgache. La pr\u00e9sence d\u2019un enseignant de Mandarin, unique dans la r\u00e9gion, constitue une sp\u00e9cificit\u00e9 notable du Lyc\u00e9e Mahazengy li\u00e9e \u00e0 son origine sino-malgache."),

    h2("3.3. R\u00e9sultats du Baccalaur\u00e9at (2013-2025)"),
    p("Le Lyc\u00e9e Mahazengy pr\u00e9sente ses \u00e9l\u00e8ves aux examens du Baccalaur\u00e9at depuis la session 2013-2014. Les r\u00e9sultats pour les sessions 2012 et 2013 n\u2019ont pas pu \u00eatre pr\u00e9serv\u00e9s localement ; une demande est en cours aupr\u00e8s de l\u2019Office du BAC pour obtenir ces donn\u00e9es manquantes. Le tableau ci-dessous pr\u00e9sente l\u2019\u00e9volution d\u00e9taill\u00e9e des r\u00e9sultats sur douze sessions cons\u00e9cutives :"),
    tbl(
      ["Session", "Candidats", "Taux global", "S\u00e9rie L", "S\u00e9rie S", "S\u00e9rie OSE"],
      [
        ["2013-2014", "120", "46%", "45%", "48%", "46%"],
        ["2014-2015", "130", "50%", "44%", "52%", "54%"],
        ["2015-2016", "125", "53%", "60%", "50%", "50%"],
        ["2016-2017", "140", "56%", "62%", "58%", "48%"],
        ["2017-2018", "150", "58%", "60%", "56%", "58%"],
        ["2018-2019", "160", "72%", "88%", "56%", "72%"],
        ["2019-2020", "150", "42%", "18%", "55%", "53%"],
        ["2020-2021", "98", "62%", "82%", "48%", "46%"],
        ["2021-2022", "100", "51%", "76%", "23%", "54%"],
        ["2022-2023", "74", "52%", "56%", "66%", "82%"],
        ["2023-2024", "90", "88%", "75%", "90%", "99%"],
        ["2024-2025", "95", "75%", "78%", "48%", "100%"],
      ],
      [1600, 1500, 1500, 1500, 1500, 1526],
    ),
    ep(100),
    p("L\u2019analyse de ces r\u00e9sultats r\u00e9v\u00e8le plusieurs tendances significatives. Le taux de r\u00e9ussite global a connu une progression g\u00e9n\u00e9rale remarquable, passant de 46 % lors de la premi\u00e8re session en 2013-2014 \u00e0 88 % en 2023-2024, soit une augmentation de 42 points de pourcentage en dix ans. Le pic de r\u00e9ussite a \u00e9t\u00e9 atteint lors de la session 2023-2024 avec 88 % de r\u00e9ussite globale, dont des performances particuli\u00e8rement impressionnantes en S\u00e9rie S (90 %) et en S\u00e9rie OSE (99 %)."),
    p("La chute brutale observ\u00e9e en 2019-2020, o\u00f9 le taux global est tomb\u00e9 \u00e0 42 %, s\u2019explique par les perturbations majeures caus\u00e9es par la pand\u00e9mie de COVID-19. La S\u00e9rie L a \u00e9t\u00e9 particuli\u00e8rement affect\u00e9e avec un taux de seulement 18 %, probablement en raison de l\u2019impossibilit\u00e9 de mener \u00e0 bien les activit\u00e9s p\u00e9dagogiques en pr\u00e9sentiel pendant la p\u00e9riode de confinement. La reprise progressive lors des sessions suivantes t\u00e9moigne de la r\u00e9silience de l\u2019\u00e9tablissement et de la qualit\u00e9 de son encadrement p\u00e9dagogique."),
    p("La session 2024-2025 a confirm\u00e9 le dynamisme de l\u2019\u00e9tablissement avec un taux global de 75 % et une performance exceptionnelle de la S\u00e9rie OSE qui a atteint 100 % de r\u00e9ussite. Le nombre de candidats par session a vari\u00e9 entre 74 (2022-2023) et 160 (2018-2019), refl\u00e9tant les fluctuations des effectifs li\u00e9es aux conditions d\u2019inscription et aux al\u00e9as de la scolarisation dans la r\u00e9gion."),

    h2("3.4. Analyse des besoins en communication num\u00e9rique"),
    p("L\u2019analyse approfondie de l\u2019\u00e9tat des lieux a r\u00e9v\u00e9l\u00e9 un ensemble de besoins prioritaires en mati\u00e8re de communication num\u00e9rique, justifiant pleinement la r\u00e9alisation de ce projet de site web. Ces besoins peuvent \u00eatre regroup\u00e9s en cinq cat\u00e9gories principales."),
    p("Le premier besoin concerne la visibilit\u00e9 institutionnelle. Le Lyc\u00e9e Mahazengy, malgr\u00e9 ses 15 ann\u00e9es d\u2019existence et sa contribution significative \u00e0 l\u2019\u00e9ducation dans la r\u00e9gion Haute Matsiatra, ne disposait d\u2019aucune pr\u00e9sence en ligne. Cette absence limitait consid\u00e9rablement sa capacit\u00e9 \u00e0 pr\u00e9senter ses activit\u00e9s, ses r\u00e9sultats acad\u00e9miques et son identit\u00e9 au public, aux parents d\u2019\u00e9l\u00e8ves et aux partenaires \u00e9ducatifs potentiels. Dans un contexte o\u00f9 la majorit\u00e9 des \u00e9tablissements scolaires modernes disposent d\u2019un site web, cette lacune repr\u00e9sentait un d\u00e9savantage concurrentiel en termes d\u2019image et de communication."),
    p("Le deuxi\u00e8me besoin porte sur la centralisation de l\u2019information. Les donn\u00e9es de l\u2019\u00e9tablissement \u00e9taient dispers\u00e9es dans de multiples documents papier (rapports annuels, fiches techniques, listes de personnel) et fichiers num\u00e9riques \u00e9parpill\u00e9s (fichiers Word, Excel, images). Cette dispersion rendait la consultation et la mise \u00e0 jour des informations fastidieuses et source d\u2019erreurs. Un site web centralis\u00e9 offre un point d\u2019acc\u00e8s unique et structur\u00e9 \u00e0 l\u2019ensemble des donn\u00e9es de l\u2019\u00e9tablissement."),
    p("Le troisi\u00e8me besoin concerne l\u2019accessibilit\u00e9 des documents officiels. Les rapports de rentr\u00e9e, les fiches techniques, les historiques, les r\u00e9sultats du BAC et la liste du personnel n\u2019\u00e9taient pas facilement accessibles aux parties prenantes. Les parents d\u2019\u00e9l\u00e8ves devaient se d\u00e9placer physiquement au lyc\u00e9e pour obtenir ces informations, ce qui repr\u00e9sentait une contrainte significative, notamment pour les familles r\u00e9sidant hors de la ville de Fianarantsoa."),
    p("Le quatri\u00e8me besoin est li\u00e9 \u00e0 la modernisation de l\u2019image de l\u2019\u00e9tablissement. Dans le contexte actuel de transformation num\u00e9rique de l\u2019\u00e9ducation \u00e0 Madagascar, o\u00f9 le Minist\u00e8re de l\u2019\u00c9ducation Nationale encourage la modernisation des outils p\u00e9dagogiques et administratifs, l\u2019absence de site web constituait un retard par rapport aux standards contemporains de communication institutionnelle."),
    p("Enfin, le cinqui\u00e8me besoin porte sur la p\u00e9rennit\u00e9 et la conservation des donn\u00e9es. La num\u00e9risation et la mise en ligne des informations historiques, des r\u00e9sultats acad\u00e9miques et des documents officiels permettent d\u2019assurer leur conservation \u00e0 long terme, ind\u00e9pendamment des al\u00e9as li\u00e9s \u00e0 la conservation des documents papier. Un site web constitue ainsi une archive num\u00e9rique p\u00e9renne de la m\u00e9moire institutionnelle de l\u2019\u00e9tablissement."),
  ];
}

// ─── CHAPITRE 3 ──────────────────────────────────────────────────────────────
function chapitre3() {
  return [
    h1("Chapitre 4 : Conception et r\u00e9alisation du site web"),
    h2("4.1. Choix technologiques"),
    h3("4.1.1. \u00c9tude comparative des technologies disponibles"),
    p("Avant de proc\u00e9der au d\u00e9veloppement proprement dit, une \u00e9tude comparative approfondie des technologies web disponibles a \u00e9t\u00e9 r\u00e9alis\u00e9e. L\u2019objectif \u00e9tait d\u2019identifier la combinaison technologique la plus adapt\u00e9e aux contraintes sp\u00e9cifiques du projet : nature du contenu (pr\u00e9sentation institutionnelle statique), contexte (d\u00e9ploiement gratuit, maintenance minimale), et environnement (connectivit\u00e9 internet limit\u00e9e \u00e0 Madagascar, ressources financi\u00e8res restreintes de l\u2019\u00e9tablissement)."),
    p("Plusieurs solutions ont \u00e9t\u00e9 examin\u00e9es. Les CMS (Content Management Systems) traditionnels comme WordPress, Joomla ou Drupal offrent une interface d\u2019administration conviviale mais imposent une complexit\u00e9 de maintenance (mises \u00e0 jour, s\u00e9curit\u00e9, base de donn\u00e9es) incompatible avec les ressources disponibles. Les g\u00e9n\u00e9rateurs de sites statiques comme Hugo ou Jekyll sont performants mais limitent les possibilit\u00e9s d\u2019interactivit\u00e9. Les frameworks JavaScript modernes comme Next.js, Nuxt.js ou TanStack Start offrent un excellent compromis entre performance, flexibilit\u00e9 et facilit\u00e9 de d\u00e9ploiement."),
    p("Le choix final s\u2019est port\u00e9 sur l\u2019\u00e9cosyst\u00e8me TanStack (React + TanStack Start + TanStack Router) pour plusieurs raisons. D\u2019abord, React est la librairie d\u2019interface utilisateur la plus utilis\u00e9e au monde, garantissant un vaste \u00e9cosyst\u00e8me, une communaut\u00e9 active et une abondance de ressources d\u2019apprentissage. Ensuite, TanStack Start offre un rendu c\u00f4t\u00e9 serveur (SSR) natif, essentiel pour le r\u00e9f\u00e9rencement naturel (SEO) et le temps de chargement initial, deux crit\u00e8res cruciaux pour un site institutionnel devant \u00eatre visible sur les moteurs de recherche. Enfin, TanStack Router fournit un syst\u00e8me de routing avanc\u00e9 avec le chargement de code (code splitting), permettant d\u2019optimiser les performances en ne chargeant que les ressources n\u00e9cessaires pour chaque page."),

    h3("4.1.2. Technologies retenues"),
    p("Le tableau suivant pr\u00e9sente l\u2019ensemble des technologies utilis\u00e9es dans le projet, avec leur r\u00f4le respectif et la version d\u00e9ploy\u00e9e :"),
    tbl(
      ["Technologie", "R\u00f4le dans le projet", "Version"],
      [
        ["React", "Librairie d\u2019interface utilisateur (UI)", "19.2"],
        ["TanStack Start", "Framework SSR (Server-Side Rendering)", "1.168"],
        ["TanStack Router", "Syst\u00e8me de routing avec code splitting", "1.170"],
        ["TanStack React Query", "Gestion des donn\u00e9es c\u00f4t\u00e9 client", "5.101"],
        ["Tailwind CSS v4", "Framework CSS utilitaire (mobile-first)", "4.2"],
        ["Vite", "Outil de build et d\u00e9veloppement rapide", "8.0"],
        ["Nitro", "Moteur de d\u00e9ploiement universel (preset Vercel)", "3.0"],
        ["Recharts", "Visualisation de donn\u00e9es (graphiques)", "2.15"],
        ["Lucide React", "Biblioth\u00e8que d\u2019ic\u00f4nes SVG", "0.575"],
        ["ESLint + Prettier", "Outils de linting et formatage du code", "9.32 / 3.7"],
        ["Git + GitHub", "Contr\u00f4le de version et h\u00e9bergement du code source", "Dernier"],
        ["Vercel", "Plateforme d\u2019h\u00e9bergement et d\u00e9ploiement", "Cloud"],
      ],
      [2500, 4000, 1526],
    ),
    ep(100),

    h2("4.2. Architecture du site"),
    h3("4.2.1. Organisation des fichiers source"),
    p("Le projet est organis\u00e9 selon une architecture modulaire et hi\u00e9rarchique, favorisant la lisibilit\u00e9 du code, la r\u00e9utilisabilit\u00e9 des composants et la maintenabilit\u00e9 \u00e0 long terme. Le r\u00e9pertoire source (src/) contient l\u2019ensemble du code applicatif, tandis que le r\u00e9pertoire public/ abrite les ressources statiques. Cette organisation suit les conventions recommand\u00e9es par l\u2019\u00e9cosyst\u00e8me TanStack Start :"),
    tbl(
      ["R\u00e9pertoire / Fichier", "Description fonctionnelle"],
      [
        ["src/routes/", "Pages du site organis\u00e9es en routing file-based (8 pages principales + sitemap)"],
        ["src/components/", "Composants r\u00e9utilisables (SiteHeader.jsx, SiteFooter.jsx)"],
        ["src/assets/", "Images et ressources visuelles (logos, photos des proviseurs, photos du lyc\u00e9e)"],
        ["src/lib/", "Utilitaires partag\u00e9s (utils.js, error-page.js, error-capture.js)"],
        ["src/hooks/", "Hooks personnalis\u00e9s React (use-mobile.jsx pour la d\u00e9tection responsive)"],
        ["src/server.js", "Configuration du serveur SSR avec gestion des erreurs"],
        ["src/start.js", "Configuration TanStack Start avec middleware d\u2019erreur"],
        ["src/router.jsx", "Configuration du routeur avec QueryClient React Query"],
        ["src/styles.css", "Feuille de styles globale avec import de Tailwind CSS"],
        ["public/documents/", "Documents officiels t\u00e9l\u00e9chargeables (DOCX, XLSX)"],
        ["public/favicon.svg", "Ic\u00f4ne du site"],
        ["public/robots.txt", "Instructions pour les robots d\u2019indexation"],
        ["vite.config.js", "Configuration du build (Vite + TanStack Start + Nitro)"],
        ["package.json", "D\u00e9pendances et scripts du projet"],
      ],
      [3500, 6526],
    ),
    ep(100),
    h3("4.2.2. Routing et pages principales"),
    p("Le site comporte huit pages principales, chacune correspondant \u00e0 un fichier dans le r\u00e9pertoire src/routes/. TanStack Router utilise un syst\u00e8me de routing bas\u00e9 sur les fichiers (file-based routing), o\u00f9 le nom du fichier d\u00e9termine automatiquement la route URL associ\u00e9e. Ce syst\u00e8me offre l\u2019avantage d\u2019\u00e9liminer la configuration manuelle du routing et de faciliter le chargement conditionnel du code :"),
    tbl(
      ["Page", "Route URL", "Description du contenu"],
      [
        ["Accueil", "/", "Pr\u00e9sentation g\u00e9n\u00e9rale, statistiques cl\u00e9s (363 \u00e9l\u00e8ves, 8 salles, 72 % BAC), mot du Proviseur"],
        ["Historique", "/historique", "Chronologie compl\u00e8te depuis 2010, localisation g\u00e9ographique, \u00e9v\u00e9nements marquants"],
        ["Proviseurs", "/proviseurs", "Liste des 7 responsables avec photos, p\u00e9riodes et contributions"],
        ["Personnel", "/personnel", "Annuaire de 45 agents avec recherche en temps r\u00e9el et filtrage par cat\u00e9gorie"],
        ["R\u00e9sultats BAC", "/resultats", "Tableaux et graphiques interactifs des r\u00e9sultats (2013-2025) par s\u00e9rie"],
        ["Fiche technique", "/fiche-technique", "Donn\u00e9es infrastructurelles, capacit\u00e9s, \u00e9quipements et besoins"],
        ["Documents", "/documents", "Espace de t\u00e9l\u00e9chargement de 10 documents officiels"],
        ["Contact", "/contact", "Adresse compl\u00e8te, horaires, carte interactive OpenStreetMap"],
      ],
      [2000, 1500, 6526],
    ),
    ep(100),

    h2("4.3. D\u00e9veloppement des fonctionnalit\u00e9s"),
    h3("4.3.1. Interface utilisateur et design responsive"),
    p("L\u2019interface utilisateur a \u00e9t\u00e9 con\u00e7ue en suivant une approche mobile-first, garantissant une exp\u00e9rience optimale sur tous les formats d\u2019\u00e9cran. Cette approche est particuli\u00e8rement pertinente dans le contexte malgache, o\u00f9 la majorit\u00e9 des utilisateurs acc\u00e8dent \u00e0 internet via des smartphones. Le design utilise une palette de couleurs professionnelle avec des teintes bleu marine (hex #1B3A5C) et blanc, refl\u00e9tant le caract\u00e8re institutionnel et s\u00e9rieux de l\u2019\u00e9tablissement."),
    p("La typographie combine deux familles de polices issues de Google Fonts. La police Inter est utilis\u00e9e pour le texte courant, offrant une excellente lisibilit\u00e9 sur tous les \u00e9crans gr\u00e2ce \u00e0 son design optimis\u00e9 pour l\u2019affichage num\u00e9rique. La police Playfair Display est r\u00e9serv\u00e9e aux titres principaux, apportant une identit\u00e9 visuelle forte et \u00e9l\u00e9gante qui distingue le site des templates g\u00e9n\u00e9riques."),
    p("L\u2019en-t\u00eate (SiteHeader) est de type sticky, c\u2019est-\u00e0-dire qu\u2019il reste visible en haut de l\u2019\u00e9cran lors du d\u00e9filement, assurant un acc\u00e8s permanent \u00e0 la navigation. Il affiche le nom de l\u2019\u00e9tablissement et les huit liens de navigation principaux. Sur les \u00e9crans mobiles, un syst\u00e8me de menu hamburger permet de regrouper les liens de navigation dans un panneau d\u00e9roulant, optimisant l\u2019espace disponible sur les petits \u00e9crans."),
    p("Le pied de page (SiteFooter) affiche l\u2019identit\u00e9 compl\u00e8te de l\u2019\u00e9tablissement, la devise nationale malgache (\u00ab Fitiavana \u2013 Tanindrazana \u2013 Fandrosoana \u00bb, qui se traduit par \u00ab Amour \u2013 Patrie \u2013 Progr\u00e8s \u00bb), les informations de contact, un r\u00e9sum\u00e9 des liens de navigation et les droits d\u2019auteur dynamiques avec l\u2019ann\u00e9e en cours."),

    h3("4.3.2. Fonctionnalit\u00e9s interactives et dynamiques"),
    p("La page d\u2019accueil constitue la vitrine du site et a \u00e9t\u00e9 con\u00e7ue pour capter l\u2019attention du visiteur d\u00e8s les premi\u00e8res secondes. Elle affiche une image h\u00e9ro plein \u00e9cran de la fa\u00e7ade du lyc\u00e9e, suivie de cartes statistiques pr\u00e9sentant les chiffres cl\u00e9s de l\u2019\u00e9tablissement (ann\u00e9e d\u2019ouverture : 2010, 363 \u00e9l\u00e8ves, 8 salles de classe, taux de r\u00e9ussite au BAC : 72,45 %). Un encart sp\u00e9cial est d\u00e9di\u00e9 au \u00ab Mot du Proviseur \u00bb, mettant en avant le message de Mme RAMAHOLISOA concernant la restauration de l\u2019amiti\u00e9 sino-malgache et l\u2019introduction de la langue mandarine."),
    p("La page Personnel int\u00e8gre un syst\u00e8me de recherche en temps r\u00e9el et de filtrage par cat\u00e9gorie. L\u2019utilisateur peut rechercher un membre du personnel par son nom ou filtrer la liste par fonction (administratif, enseignant) ou par discipline. Cette fonctionnalit\u00e9 utilise les hooks React et le filtrage client-side, garantissant une r\u00e9ponse instantan\u00e9e sans rechargement de page. Les r\u00e9sultats sont affich\u00e9s sous forme de tableau structur\u00e9 avec le nom, le genre, la fonction et la discipline de chaque agent."),
    p("La page des R\u00e9sultats du BAC utilise la biblioth\u00e8que Recharts pour afficher des visualisations graphiques interactives. Deux types de graphiques sont propos\u00e9s : un graphique en ligne montrant l\u2019\u00e9volution du taux de r\u00e9ussite global au fil des sessions, et un graphique en barres group\u00e9es comparant les performances des trois s\u00e9ries (L, S, OSE) pour chaque session. Des cartes r\u00e9sum\u00e9s affichent les meilleurs taux obtenus (100 % pour la S\u00e9rie OSE en 2020-2021 et 2024-2025, 88 % pour le meilleur taux global en 2023-2024)."),
    p("La page Documents offre un espace de t\u00e9l\u00e9chargement organis\u00e9 en deux cat\u00e9gories : les documents g\u00e9n\u00e9raux (historiques, rapports de rentr\u00e9e, r\u00e9sultats du BAC, fiche technique) et les documents sp\u00e9cifiques (situation des \u00e9l\u00e8ves et du personnel depuis 2010, support d\u2019exposition pour le 15e anniversaire). Chaque document est accompagn\u00e9 d\u2019une ic\u00f4ne repr\u00e9sentant son type (fichier texte, tableur) et d\u2019une description informative. Les fichiers sont disponibles en formats DOCX et XLSX."),
    p("Une page sitemap.xml, g\u00e9n\u00e9r\u00e9e dynamiquement c\u00f4t\u00e9 serveur, am\u00e9liore le r\u00e9f\u00e9rencement sur les moteurs de recherche en listant toutes les pages du site avec leurs fr\u00e9quences de mise \u00e0 jour estim\u00e9es et leurs niveaux de priorit\u00e9. La page d\u2019accueil est prioris\u00e9e avec un score de 1.0 et une fr\u00e9quence mensuelle, tandis que les pages d\u00e9taill\u00e9es re\u00e7oivent des scores d\u00e9croissants selon leur importance relative."),

    h3("4.3.3. Gestion des erreurs et robustesse"),
    p("Un soin particulier a \u00e9t\u00e9 apport\u00e9 \u00e0 la gestion des erreurs, tant c\u00f4t\u00e9 client que c\u00f4t\u00e9 serveur. C\u00f4t\u00e9 client, une page 404 personnalis\u00e9e en fran\u00e7ais est affich\u00e9e lorsque l\u2019utilisateur tente d\u2019acc\u00e9der \u00e0 une page inexistante, avec un message explicatif (\u00ab La page recherch\u00e9e n\u2019existe pas ou a \u00e9t\u00e9 d\u00e9plac\u00e9e \u00bb) et un bouton de retour \u00e0 l\u2019accueil. Une page d\u2019erreur g\u00e9n\u00e9rique offre la possibilit\u00e9 de r\u00e9essayer ou de revenir \u00e0 la page d\u2019accueil."),
    p("C\u00f4t\u00e9 serveur, un syst\u00e8me de capture des erreurs silencieuses a \u00e9t\u00e9 mis en place (src/lib/error-capture.js). Ce module intercepte les erreurs JavaScript non capt\u00e9es (y compris les rejections de promesses) et les stocke temporairement avec un horodatage. Lorsqu\u2019une erreur de type \u00ab HTTPError \u00bb est d\u00e9tect\u00e9e dans la r\u00e9ponse SSR, le syst\u00e8me g\u00e9n\u00e8re automatiquement une page d\u2019erreur HTML avec des instructions pour l\u2019utilisateur. Un middleware d\u2019erreur (src/start.js) enveloppe chaque requ\u00eate dans un bloc try-catch pour garantir qu\u2019aucune erreur ne se propage sans traitement."),

    h2("4.4. D\u00e9ploiement sur Vercel"),
    h3("4.4.1. Choix de la plateforme d\u2019h\u00e9bergement"),
    p("Plusieurs plateformes d\u2019h\u00e9bergement ont \u00e9t\u00e9 envisag\u00e9es pour le d\u00e9ploiement du site : Netlify, GitHub Pages, Firebase Hosting et Vercel. Le choix final s\u2019est port\u00e9 sur Vercel pour plusieurs raisons d\u00e9terminantes. Vercel offre un plan gratuit g\u00e9n\u00e9reux, adapt\u00e9 aux projets \u00e9ducatifs et personnels, avec un h\u00e9bergement illimit\u00e9 pour les sites statiques et un quota mensuel suffisant pour les fonctions serverless. La plateforme fournit \u00e9galement un r\u00e9seau de distribution de contenu (CDN) mondial, garantissant des temps de chargement rapides quelle que soit la localisation g\u00e9ographique de l\u2019utilisateur."),
    p("Vercel propose une int\u00e9gration native avec Git et GitHub, permettant un d\u00e9ploiement continu automatis\u00e9 : chaque push sur la branche principale (main) du d\u00e9p\u00f4t GitHub d\u00e9clenche automatiquement un nouveau build et un d\u00e9ploiement. Cette fonctionnalit\u00e9 simplifie consid\u00e9rablement le processus de mise \u00e0 jour du site en production. De plus, Vercel fournit un certificat SSL automatique (HTTPS), des aper\u00e7us de d\u00e9ploiement pour chaque pull request, et un tableau de bord de monitoring des performances et des erreurs."),

    h3("4.4.2. Processus de d\u00e9ploiement technique"),
    p("Le processus de d\u00e9ploiement s\u2019appuie sur le preset Nitro pour Vercel, qui automatise la g\u00e9n\u00e9ration de la configuration n\u00e9cessaire. Lors du build, la commande `vite build` ex\u00e9cute deux phases successives. La premi\u00e8re phase compile le code client (React, CSS) et g\u00e9n\u00e8re les assets statiques optimis\u00e9s dans le r\u00e9pertoire .output/public/. La seconde phase compile le code serveur (SSR) et g\u00e9n\u00e8re les fonctions serverless dans .vercel/output/functions/.__server.func/."),
    p("Nitro g\u00e9n\u00e8re automatiquement un fichier de configuration (.vercel/output/config.json) d\u00e9finissant les r\u00e8gles de routage. Ce fichier inclut trois types de r\u00e8gles : le cache des assets statiques (en-t\u00eate Cache-Control avec max-age=31536000 pour les fichiers /assets/*), le routage filesystem pour les fichiers statiques, et un routage fallback vers la fonction serverless /__server pour toutes les autres requ\u00eates. Cette configuration garantit un temps de r\u00e9ponse optimal pour les ressources statiques tout en assurant le rendu SSR pour les pages dynamiques."),
    p("Il est important de noter que le processus de d\u00e9ploiement a rencontr\u00e9 des d\u00e9fis techniques significatifs lors des premi\u00e8res tentatives. La configuration initiale utilisait une approche manuelle avec un fichier api/index.js et un vercel.json personnalis\u00e9, ce qui a conduit \u00e0 une erreur FUNCTION_INVOCATION_TIMEOUT (erreur 504) en production. Ce probl\u00e8me \u00e9tait d\u00fb au fait que les chunks du serveur n\u2019\u00e9taient pas correctement accessibles dans l\u2019environnement serverless de Vercel. La migration vers le preset Nitro officiel a r\u00e9solu ce probl\u00e8me en laissant Nitro g\u00e9rer la totalit\u00e9 de la configuration d\u00e9ploiement."),

    h3("4.4.3. Contr\u00f4le de version avec Git et GitHub"),
    p("Le code source du projet est versionn\u00e9 avec Git et h\u00e9berg\u00e9 sur un d\u00e9p\u00f4t priv\u00e9 GitHub (https://github.com/alvisymanambina-arch/Lyc-e-Mahazengy-Fianarantsoa). Cette approche garantit la tra\u00e7abilit\u00e9 de toutes les modifications, facilite la collaboration entre contributeurs et assure la p\u00e9rennit\u00e9 du code source ind\u00e9pendamment de la machine de d\u00e9veloppement."),
    p("L\u2019historique des commits refl\u00e8te la progression it\u00e9rative du projet. Le commit initial (0329312) a pos\u00e9 les fondations du projet avec la structure de base. Le commit suivant (3a86ded) a ajout\u00e9 une premi\u00e8re tentative de configuration Vercel. Le commit de mise \u00e0 jour (8a4bb04) a refactor\u00e9 le projet en supprimant la configuration manuelle. Enfin, le commit final (8ead3d0) a int\u00e9gr\u00e9 le preset Nitro pour Vercel, r\u00e9solvant d\u00e9finitivement les probl\u00e8mes de d\u00e9ploiement."),
    p("Les fichiers sensibles (tokens d\u2019authentification Vercel, variables d\u2019environnement) sont exclus du suivi Git via le fichier .gitignore, qui filtre \u00e9galement les r\u00e9pertoires de build (dist, .output, .vercel/output), les d\u00e9pendances (node_modules) et les fichiers de configuration locale (.env*)."),

    h2("4.5. Maintenance et p\u00e9rennit\u00e9 du projet"),
    p("La question de la p\u00e9rennit\u00e9 du site web au-del\u00e0 de la p\u00e9riode de stage a \u00e9t\u00e9 une pr\u00e9occupation constante durant le d\u00e9veloppement. Plusieurs mesures ont \u00e9t\u00e9 prises pour garantir la continuit\u00e9 du service et faciliter la maintenance future par l\u2019\u00e9tablissement ou par tout autre contributeur d\u00e9sign\u00e9."),
    p("Premi\u00e8rement, le code est structur\u00e9 de mani\u00e8re claire et document\u00e9. Les noms des composants, des routes et des variables sont explicites et suivent les conventions standard de l\u2019\u00e9cosyst\u00e8me React. Les donn\u00e9es sont directement int\u00e9gr\u00e9es dans le code source des composants, ce qui signifie que toute mise \u00e0 jour peut \u00eatre effectu\u00e9e en modifiant les fichiers JSX correspondants, sans n\u00e9cessiter de base de donn\u00e9es externe."),
    p("Deuxi\u00e8mement, le d\u00e9ploiement automatis\u00e9 via Vercel ne n\u00e9cessite aucune intervention technique manuelle. Une fois le d\u00e9p\u00f4t GitHub connect\u00e9 \u00e0 Vercel, toute modification pouss\u00e9e sur la branche principale d\u00e9clenche automatiquement un nouveau d\u00e9ploiement, sans co\u00fbt suppl\u00e9mentaire."),
    p("Troisi\u00e8mement, les mises \u00e0 jour des donn\u00e9es (r\u00e9sultats du BAC annuels, liste du personnel, documents officiels) peuvent \u00eatre r\u00e9alis\u00e9es en suivant un processus simple : modifier le fichier source correspondant sur GitHub via l\u2019interface web ou un client Git, puis pousser les modifications. Le d\u00e9ploiement se fait automatiquement. La formation d\u2019au moins un membre du personnel du lyc\u00e9e aux bases de l\u2019\u00e9dition de fichiers JSX et de l\u2019utilisation de GitHub serait l\u2019id\u00e9al pour garantir l\u2019autonomie compl\u00e8te de l\u2019\u00e9tablissement."),
    p("Des perspectives d\u2019am\u00e9lioration futures ont \u00e9t\u00e9 identifi\u00e9es : l\u2019ajout d\u2019un syst\u00e8me d\u2019authentification pour la gestion du contenu par les administrateurs du lyc\u00e9e, l\u2019int\u00e9gration d\u2019un blog pour les actualit\u00e9s, la mise en place d\u2019un formulaire de contact interactif, et l\u2019ajout d\u2019une galerie photo de l\u2019\u00e9tablissement."),
  ];
}

// ─── CONCLUSION ──────────────────────────────────────────────────────────────
function conclusion() {
  return [
    h1("Conclusion"),
    ep(100),
    p("Ce m\u00e9moire de fin d\u2019\u00e9tudes en Licence 3 d\u2019\u00c9lectronique Appliqu\u00e9e et d\u2019Informatique Industrielle \u00e0 l\u2019Universit\u00e9 de Fianarantsoa a pr\u00e9sent\u00e9 la conception et le d\u00e9veloppement d\u2019un site web officiel pour le Lyc\u00e9e Mahazengy de Fianarantsoa, r\u00e9alis\u00e9 dans le cadre d\u2019un stage de trois mois s\u2019\u00e9tendant de juin \u00e0 septembre 2026."),
    p("Le projet a permis d\u2019atteindre l\u2019ensemble des objectifs sp\u00e9cifiques fix\u00e9s en d\u00e9but de stage. Un site web fonctionnel, moderne et responsive a \u00e9t\u00e9 con\u00e7u et d\u00e9velopp\u00e9 avec succ\u00e8s, int\u00e9grant huit pages couvrant l\u2019ensemble des aspects de la vie de l\u2019\u00e9tablissement : la page d\u2019accueil pr\u00e9sentant les statistiques cl\u00e9s et le mot du Proviseur, la page historique retra\u00e7ant les quinze ann\u00e9es de l\u2019\u00e9tablissement, la page des proviseurs honorant les sept responsables successifs, la page du personnel offrant un annuaire interactif de 45 agents, la page des r\u00e9sultats du BAC avec des graphiques comparatifs sur douze sessions, la page de la fiche technique d\u00e9taillant les infrastructures, la page des documents officiels t\u00e9l\u00e9chargeables et la page de contact avec carte g\u00e9ographique."),
    p("Sur le plan technique, ce stage a constitu\u00e9 une exp\u00e9rience de formation exceptionnellement enrichissante. L\u2019utilisation du framework TanStack Start avec le rendu c\u00f4t\u00e9 serveur (SSR) m\u2019a permis d\u2019approfondir mes comp\u00e9tences en d\u00e9veloppement web full-stack moderne. La gestion du routing avanc\u00e9 avec TanStack Router, la visualisation de donn\u00e9es avec Recharts, et le d\u00e9ploiement sur Vercel avec Nitro constituent autant de comp\u00e9tences techniques directement transf\u00e9rables dans le monde professionnel."),
    p("La r\u00e9solution des probl\u00e8mes techniques rencontr\u00e9s lors du d\u00e9ploiement a \u00e9t\u00e9 particuli\u00e8rement formatrice. L\u2019erreur FUNCTION_INVOCATION_TIMEOUT sur Vercel a n\u00e9cessit\u00e9 une analyse approfondie de la documentation, des tests locaux et une migration vers la configuration Nitro officielle. Cette exp\u00e9rience m\u2019a enseign\u00e9 l\u2019importance de la pers\u00e9v\u00e9rance, de la m\u00e9thode de d\u00e9bogage syst\u00e9matique et de la veille technologique permanente."),
    p("Sur le plan humain et professionnel, ce stage m\u2019a offert l\u2019opportunit\u00e9 de d\u00e9couvrir le fonctionnement d\u2019un \u00e9tablissement secondaire public malgache de l\u2019int\u00e9rieur. La collecte des donn\u00e9es aupr\u00e8s du personnel m\u2019a confront\u00e9 \u00e0 la r\u00e9alit\u00e9 du terrain : la patience n\u00e9cessaire pour compiler des informations \u00e9parpill\u00e9es, l\u2019importance de la communication interpersonnelle dans un environnement professionnel, et la richesse de l\u2019exp\u00e9rience humaine que repr\u00e9sente le contact direct avec les acteurs de l\u2019\u00e9ducation. L\u2019engagement et le d\u00e9vouement du personnel du Lyc\u00e9e Mahazengy, malgr\u00e9 des moyens parfois limit\u00e9s, ont \u00e9t\u00e9 une source d\u2019inspiration constante."),
    p("Ce projet constitue une premi\u00e8re \u00e9tape significative vers la num\u00e9risation de la communication du Lyc\u00e9e Mahazengy. Des perspectives d\u2019am\u00e9lioration concr\u00e8tes ont \u00e9t\u00e9 identifi\u00e9es pour les futures sessions de stage : l\u2019ajout d\u2019un syst\u00e8me d\u2019authentification pour la gestion du contenu directement depuis une interface d\u2019administration, l\u2019int\u00e9gration d\u2019un blog pour les actualit\u00e9s de l\u2019\u00e9tablissement, la mise en place d\u2019un formulaire de contact interactif, l\u2019ajout d\u2019une galerie photo pr\u00e9sentant l\u2019\u00e9tablissement et ses activit\u00e9s, et la traduction du site en anglais et en malgasy pour \u00e9largir son audience."),
    p("En d\u00e9finitive, ce stage de fin d\u2019\u00e9tudes a \u00e9t\u00e9 une exp\u00e9rience globalement positive et enrichissante, tant sur le plan technique et acad\u00e9mique que sur le plan humain et professionnel. Il m\u2019a permis de mettre en application les connaissances acquises durant trois ann\u00e9es d\u2019universit\u00e9, de d\u00e9velopper de nouvelles comp\u00e9tences techniques pointues, et de contribuer utilement \u00e0 la modernisation d\u2019un \u00e9tablissement public malgache. Je suis profond\u00e9ment reconnaissant envers toutes les personnes qui ont contribu\u00e9, de pr\u00e8s ou de loin, \u00e0 la r\u00e9ussite de ce projet."),
  ];
}

// ─── BIBLIOGRAPHIE ──────────────────────────────────────────────────────────────
function bibliographie() {
  const refs = [
    "[1] TanStack, \u00ab TanStack Start \u2014 Modern Full-Stack React Framework \u00bb, Documentation officielle, 2026. Disponible sur : https://tanstack.com/start",
    "[2] Vercel Inc., \u00ab TanStack Start on Vercel \u00bb, Documentation Vercel, juillet 2026. Disponible sur : https://vercel.com/docs/frameworks/full-stack/tanstack-start",
    "[3] UnJS, \u00ab Nitro \u2014 Universal Server Engine v3 \u00bb, Documentation officielle, 2026. Disponible sur : https://nitro.build",
    "[4] Meta Platforms, Inc., \u00ab React \u2014 The library for web and native user interfaces \u00bb, Documentation officielle, 2026. Disponible sur : https://react.dev",
    "[5] Tailwind Labs, \u00ab Tailwind CSS v4.0 \u2014 Rapidly build modern websites without ever leaving your HTML \u00bb, Documentation officielle, 2026. Disponible sur : https://tailwindcss.com",
    "[6] Evan Bacon, \u00ab Vite \u2014 Next Generation Frontend Tooling \u00bb, Documentation officielle, 2026. Disponible sur : https://vitejs.dev",
    "[7] Recharts, \u00ab Recharts \u2014 A composable charting library built on React components \u00bb, Documentation officielle, 2026. Disponible sur : https://recharts.org",
    "[8] GitHub, Inc., \u00ab GitHub \u2014 Where the world builds software \u00bb, 2026. Disponible sur : https://github.com",
    "[9] Google LLC, \u00ab Google Fonts \u2014 Inter and Playfair Display \u00bb, 2026. Disponible sur : https://fonts.google.com",
    "[10] OpenStreetMap Foundation, \u00ab OpenStreetMap \u2014 The Free Wiki World Map \u00bb, 2026. Disponible sur : https://www.openstreetmap.org",
    "[11] Lucide, \u00ab Lucide \u2014 Beautiful & consistent icon toolkit \u00bb, 2026. Disponible sur : https://lucide.dev",
    "[12] Lyc\u00e9e Mahazengy Fianarantsoa, \u00ab Historique du Lyc\u00e9e Mahazengy (2024-2025) \u00bb, Document interne non publi\u00e9, Fianarantsoa, 2025.",
    "[13] Lyc\u00e9e Mahazengy Fianarantsoa, \u00ab Rapport de la rentr\u00e9e scolaire 2024-2025 \u00bb, Document interne non publi\u00e9, Fianarantsoa, 2025.",
    "[14] Lyc\u00e9e Mahazengy Fianarantsoa, \u00ab R\u00e9sultats du Baccalaur\u00e9at depuis la session 2012 \u00bb, Document interne non publi\u00e9, Fianarantsoa, 2025.",
    "[15] Lyc\u00e9e Mahazengy Fianarantsoa, \u00ab Fiche technique de l\u2019\u00e9tablissement (version 2023) \u00bb, Document interne non publi\u00e9, Fianarantsoa, 2024.",
    "[16] Lyc\u00e9e Mahazengy Fianarantsoa, \u00ab Liste du personnel LMZ \u00bb, Fichier Excel interne, mis \u00e0 jour en juillet 2026.",
    "[17] Lyc\u00e9e Mahazengy Fianarantsoa, \u00ab Situation des \u00e9l\u00e8ves, PA et PE depuis 2010 \u00bb, Fichier Excel interne, Fianarantsoa.",
    "[18] Lyc\u00e9e Mahazengy Fianarantsoa, \u00ab Exposition \u2014 15\u00e8me anniversaire du Lyc\u00e9e Mahazengy \u00bb, Document de support, 2025.",
    "[19] R\u00e9publique de Madagascar, \u00ab D\u00e9cret n\u00b0 2012/241 portant ouverture du Lyc\u00e9e Mahazengy \u00bb, sign\u00e9 le 21 f\u00e9vrier 2012.",
    "[20] CISCO Fianarantsoa, \u00ab Note de service n\u00b0 10/006-CISCOF1/SP du 26/10/2010 \u00bb, Nomination du Responsable P\u00e9dagogique.",
  ];
  const ch = [h1("Bibliographie"), ep(100)];
  for (const r of refs) {
    ch.push(new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: LINE_SPACING, after: 100 },
      indent: { left: 720, hanging: 720 },
      children: [new TextRun({ text: r, font: { name: FONT_BODY }, size: 22, color: COLOR_BODY })],
    }));
  }
  return ch;
}

// ─── TABLE DES MATIERES ────────────────────────────────────────────────────
function tocSection() {
  return [
    ep(100),
    ct("TABLE DES MATIERES", 28, true, COLOR_ACCENT),
    ep(300),
    new TableOfContents("Table des mati\u00e8res", { hyperlink: true, headingStyleRange: "1-3" }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 300 },
      children: [new TextRun({ text: "(Note : Ouvrir ce document dans Microsoft Word, puis clic droit sur le sommaire \u2192 \u00ab Mettre \u00e0 jour les champs \u00bb pour afficher les num\u00e9ros de page corrects)", font: { name: FONT_BODY }, size: 20, italics: true, color: "888888" })],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── BUILD DOCUMENT ─────────────────────────────────────────────────────────
async function main() {
  const doc = new Document({
    creator: "ALVISY MANAMBINA Nestor",
    title: "M\u00e9moire L3 \u2014 Site web du Lyc\u00e9e Mahazengy Fianarantsoa",
    description: "Conception et d\u00e9veloppement d\u2019un site web pour le Lyc\u00e9e Mahazengy de Fianarantsoa",
    styles: {
      default: {
        document: { run: { font: { name: FONT_BODY }, size: 24 }, paragraph: { spacing: { line: LINE_SPACING } } },
        heading1: { run: { font: { name: FONT_HEADING }, size: 32, bold: true, color: COLOR_BODY }, paragraph: { spacing: { before: 480, after: 280 } } },
        heading2: { run: { font: { name: FONT_HEADING }, size: 28, bold: true, color: COLOR_BODY }, paragraph: { spacing: { before: 360, after: 200 } } },
        heading3: { run: { font: { name: FONT_HEADING }, size: 26, bold: true, italics: true, color: COLOR_BODY }, paragraph: { spacing: { before: 240, after: 160 } } },
      },
    },
    sections: [
      // Section 1: Cover
      coverSection(),
      // Section 2: Remerciements + TOC + Abreviations (Roman numerals)
      {
        properties: {
          page: { margin: { top: MT, bottom: MB, left: ML, right: MR }, size: { width: PAGE_W, height: PAGE_H }, pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN } },
          sectionType: SectionType.NEXT_PAGE,
        },
        headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "M\u00e9moire de fin d\u2019\u00e9tudes \u2014 ALVISY MANAMBINA Nestor", font: { name: FONT_BODY }, size: 18, color: COLOR_SECONDARY, italics: true })] })] }) },
        footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], font: { name: FONT_BODY }, size: 20, color: COLOR_SECONDARY })] })] }) },
        children: [...remerciements(), new Paragraph({ children: [new PageBreak()] }), ...tocSection(), ...abreviations(), new Paragraph({ children: [new PageBreak()] })],
      },
      // Section 3: Body (Arabic numerals)
      {
        properties: {
          page: { margin: { top: MT, bottom: MB, left: ML, right: MR }, size: { width: PAGE_W, height: PAGE_H }, pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } },
          sectionType: SectionType.NEXT_PAGE,
        },
        headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "M\u00e9moire de fin d\u2019\u00e9tudes \u2014 ALVISY MANAMBINA Nestor", font: { name: FONT_BODY }, size: 18, color: COLOR_SECONDARY, italics: true })] })] }) },
        footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], font: { name: FONT_BODY }, size: 20, color: COLOR_SECONDARY })] })] }) },
        children: [...introduction(), ...chapitre1(), ...chapitre2(), ...chapitre3(), ...conclusion(), ...bibliographie()],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  writeFileSync("C:/Users/ALVISY/Desktop/Lycee Mahazengy/Memoire_L3_ALVISY_MANAMBINA.docx", buffer);
  console.log("Memoire generated OK");
}

main().catch(e => { console.error(e); process.exit(1); });
