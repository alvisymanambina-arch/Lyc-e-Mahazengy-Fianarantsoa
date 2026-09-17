import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, PageBreak, Header, Footer,
  WidthType, ShadingType, BorderStyle, TabStopType, TabStopPosition,
  convertInchesToTwip,
} from "docx";
import { writeFileSync } from "fs";

// ─── DESIGN CONSTANTS ───────────────────────────────────────────────────────
const FONT = "Calibri";
const COLOR_PRIMARY = "1B3A5C";   // navy
const COLOR_ACCENT = "2E5C8A";    // lighter navy
const COLOR_BODY = "222222";
const COLOR_MUTED = "666666";
const COLOR_LIGHT = "F2F4F7";
const COLOR_SIDEBAR = "1B3A5C";   // dark sidebar bg
const COLOR_WHITE = "FFFFFF";
const PAGE_W = 11906;
const PAGE_H = 16838;
const M_ALL = 0; // full bleed, controlled by table

// ─── HELPERS ────────────────────────────────────────────────────────────────
function tr(text, opts = {}) {
  return new TextRun({
    text,
    font: { name: FONT },
    size: opts.size || 20,
    bold: !!opts.bold,
    italics: !!opts.italics,
    color: opts.color || COLOR_WHITE,
  });
}

function paraWhite(runs, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { line: 260, after: opts.after || 60, before: opts.before || 0 },
    indent: opts.indent,
    children: Array.isArray(runs) ? runs : [runs],
  });
}

function paraDark(runs, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { line: 260, after: opts.after || 60, before: opts.before || 0 },
    indent: opts.indent,
    children: Array.isArray(runs) ? runs : [runs],
  });
}

// Sidebar section heading (e.g. "CONTACT", "COMPÉTENCES")
function sidebarHeading(text) {
  return new Paragraph({
    spacing: { before: 240, after: 100, line: 260 },
    children: [
      new TextRun({ text: text.toUpperCase(), font: { name: FONT }, size: 22, bold: true, color: COLOR_WHITE, characterSpacing: 30 }),
    ],
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR_WHITE, space: 4 } },
  });
}

// Main section heading (e.g. "EXPÉRIENCE PROFESSIONNELLE")
function mainHeading(text) {
  return new Paragraph({
    spacing: { before: 220, after: 120, line: 260 },
    children: [
      new TextRun({ text: text.toUpperCase(), font: { name: FONT }, size: 24, bold: true, color: COLOR_PRIMARY, characterSpacing: 20 }),
    ],
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: COLOR_PRIMARY, space: 4 } },
  });
}

// Bullet point in sidebar (white text)
function sidebarBullet(text) {
  return new Paragraph({
    spacing: { line: 260, after: 50 },
    indent: { left: 100, hanging: 100 },
    children: [
      new TextRun({ text: "▸ ", font: { name: FONT }, size: 18, color: COLOR_WHITE }),
      new TextRun({ text, font: { name: FONT }, size: 18, color: COLOR_WHITE }),
    ],
  });
}

// Bullet point in main area (dark text)
function mainBullet(text, opts = {}) {
  const runs = [
    new TextRun({ text: "• ", font: { name: FONT }, size: 18, color: COLOR_ACCENT }),
  ];
  if (opts.bold) {
    runs.push(new TextRun({ text: opts.bold, font: { name: FONT }, size: 18, bold: true, color: COLOR_BODY }));
  }
  runs.push(new TextRun({ text, font: { name: FONT }, size: 18, color: COLOR_BODY }));
  return new Paragraph({
    spacing: { line: 260, after: 50 },
    indent: { left: 200, hanging: 200 },
    children: runs,
  });
}

// ─── SIDEBAR CELL CONTENT ───────────────────────────────────────────────────
function buildSidebar() {
  return [
    // Name/title (top of sidebar)
    new Paragraph({
      spacing: { before: 300, after: 60, line: 260 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "ALVISY MANAMBINA", font: { name: FONT }, size: 26, bold: true, color: COLOR_WHITE }),
      ],
    }),
    new Paragraph({
      spacing: { after: 40, line: 260 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "NESTOR", font: { name: FONT }, size: 26, bold: true, color: COLOR_WHITE }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200, line: 260 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "Développeur IoT & Web", font: { name: FONT }, size: 20, italics: true, color: "B8CCE0" }),
      ],
    }),

    sidebarHeading("Contact"),
    paraWhite([
      new TextRun({ text: "Andrainjato – Fianarantsoa 301\n", font: { name: FONT }, size: 17, color: COLOR_WHITE }),
      new TextRun({ text: "Madagascar\n", font: { name: FONT }, size: 17, color: COLOR_WHITE }),
      new TextRun({ text: "+261 34 01 813 27\n", font: { name: FONT }, size: 17, color: COLOR_WHITE }),
      new TextRun({ text: "alvisymanambina@gmail.com\n", font: { name: FONT }, size: 17, color: COLOR_WHITE }),
      new TextRun({ text: "github.com/alvisymanambina-arch", font: { name: FONT }, size: 17, color: COLOR_WHITE }),
    ]),

    sidebarHeading("Compétences"),
    paraWhite([new TextRun({ text: "Langages", font: { name: FONT }, size: 18, bold: true, color: "B8CCE0" })]),
    sidebarBullet("C / C++, Java, Python"),
    sidebarBullet("JavaScript / JSX, TypeScript"),
    sidebarBullet("SQL (MySQL, SQLite)"),

    paraWhite([new TextRun({ text: "Web & Mobile", font: { name: FONT }, size: 18, bold: true, color: "B8CCE0" })], { before: 80 }),
    sidebarBullet("React.js, TanStack Start"),
    sidebarBullet("Node.js, API REST"),
    sidebarBullet("HTML5, CSS3, Tailwind CSS"),
    sidebarBullet("Flutter, Java Android"),

    paraWhite([new TextRun({ text: "Embarqué & IoT", font: { name: FONT }, size: 18, bold: true, color: "B8CCE0" })], { before: 80 }),
    sidebarBullet("Arduino, ESP32, PIC16F877A"),
    sidebarBullet("Capteurs (DHT22, ultrasons)"),
    sidebarBullet("Servomoteurs, WebSocket"),
    sidebarBullet("Programmation embarquée"),

    paraWhite([new TextRun({ text: "Conception & Outils", font: { name: FONT }, size: 18, bold: true, color: "B8CCE0" })], { before: 80 }),
    sidebarBullet("Proteus, KiCad"),
    sidebarBullet("Git, GitHub, Vercel"),
    sidebarBullet("XAMPP, Supabase, npm"),

    sidebarHeading("Langues"),
    paraWhite([new TextRun({ text: "Malagasy\n", font: { name: FONT }, size: 18, color: COLOR_WHITE }), new TextRun({ text: "  Maternelle\n", font: { name: FONT }, size: 16, italics: true, color: "B8CCE0" })]),
    paraWhite([new TextRun({ text: "Français\n", font: { name: FONT }, size: 18, color: COLOR_WHITE }), new TextRun({ text: "  Intermédiaire\n", font: { name: FONT }, size: 16, italics: true, color: "B8CCE0" })]),
    paraWhite([new TextRun({ text: "Anglais\n", font: { name: FONT }, size: 18, color: COLOR_WHITE }), new TextRun({ text: "  Intermédiaire\n", font: { name: FONT }, size: 16, italics: true, color: "B8CCE0" })]),

    sidebarHeading("Atouts"),
    sidebarBullet("Permis de conduire (A et B)"),
    sidebarBullet("Maîtrise Android / Tablette"),
    sidebarBullet("Leadership & autonomie"),
    sidebarBullet("Veille technologique"),

    sidebarHeading("Centres d'intérêt"),
    sidebarBullet("Développement logiciel & électronique"),
    sidebarBullet("Football, jeux vidéo"),
    sidebarBullet("Lecture technique"),
  ];
}

// ─── MAIN CELL CONTENT ──────────────────────────────────────────────────────
function buildMain() {
  const darkText = (t, o = {}) => new TextRun({ text: t, font: { name: FONT }, size: o.size || 19, bold: !!o.bold, italics: !!o.italics, color: o.color || COLOR_BODY });

  return [
    // Header
    new Paragraph({
      spacing: { before: 200, after: 80, line: 260 },
      children: [
        new TextRun({ text: "Développeur IoT & Web Full-Stack", font: { name: FONT }, size: 30, bold: true, color: COLOR_PRIMARY }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200, line: 260 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: COLOR_PRIMARY, space: 4 } },
      children: [
        new TextRun({ text: "Électronique Appliquée & Informatique Industrielle", font: { name: FONT }, size: 20, italics: true, color: COLOR_ACCENT }),
      ],
    }),

    // Profil
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 280, after: 100 },
      children: [
        darkText("Étudiant en Licence 3 d'Électronique Appliquée et Informatique Industrielle à la Faculté des Sciences de l'Université de Fianarantsoa, je suis passionné par les systèmes embarqués, l'Internet des Objets (IoT) et le développement d'applications web et mobiles. Rigoureux, motivé et doté d'une grande capacité d'apprentissage, je souhaite mettre en pratique mes compétences techniques au sein de projets concrets et innovants."),
      ],
    }),

    // FORMATION
    mainHeading("Formation"),
    new Paragraph({
      spacing: { after: 30, line: 260 },
      children: [
        darkText("Licence en Électronique Appliquée et Informatique Industrielle", { bold: true, size: 19 }),
        new TextRun({ text: "  —  2023 – 2026", font: { name: FONT }, size: 18, color: COLOR_ACCENT, bold: true }),
      ],
    }),
    new Paragraph({
      spacing: { after: 30, line: 260 },
      indent: { left: 100 },
      children: [darkText("Université de Fianarantsoa — Faculté des Sciences et Technologies", { italics: true, color: COLOR_ACCENT })],
    }),
    new Paragraph({
      spacing: { after: 120, line: 260 },
      indent: { left: 100 },
      children: [darkText("Licence 3 en cours (2025-2026). Mention L3 : Conception web, systèmes embarqués et réseaux.", { size: 18 })],
    }),

    new Paragraph({
      spacing: { after: 30, line: 260 },
      children: [
        darkText("Baccalauréat de l'Enseignement Général, Série D", { bold: true, size: 19 }),
        new TextRun({ text: "  —  2023", font: { name: FONT }, size: 18, color: COLOR_ACCENT, bold: true }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120, line: 260 },
      indent: { left: 100 },
      children: [darkText("Lycée Privé Marovatolena, Mahajanga — Mention Assez-Bien", { italics: true, color: COLOR_ACCENT })],
    }),

    // EXPÉRIENCE PROFESSIONNELLE
    mainHeading("Expérience Professionnelle"),

    new Paragraph({
      spacing: { after: 30, line: 260 },
      children: [
        darkText("Stage de fin d'études L3 — Développeur Web", { bold: true, size: 19 }),
        new TextRun({ text: "  —  Juin – Septembre 2026", font: { name: FONT }, size: 18, color: COLOR_ACCENT, bold: true }),
      ],
    }),
    new Paragraph({
      spacing: { after: 30, line: 260 },
      indent: { left: 100 },
      children: [darkText("Lycée Mahazengy, Fianarantsoa — Projet de site web institutionnel", { italics: true, color: COLOR_ACCENT })],
    }),
    mainBullet("Conception et développement d'un site web officiel (8 pages) avec rendu côté serveur (SSR).", { bold: "Projet : " }),
    mainBullet("Stack technique : React 19, TanStack Start, Tailwind CSS v4, Nitro, Vercel."),
    mainBullet("Intégration de graphiques interactifs (Recharts) pour les résultats du Baccalauréat."),
    mainBullet("Mise en place d'un annuaire du personnel avec recherche en temps réel."),
    mainBullet("Déploiement automatisé via Git/GitHub et Vercel, configuration Nitro serverless."),
    mainBullet("Collecte, vérification et numérisation des données institutionnelles (historique, 45 personnels, résultats sur 12 sessions)."),
    new Paragraph({ spacing: { after: 80 } }),

    new Paragraph({
      spacing: { after: 30, line: 260 },
      children: [
        darkText("Enquêteur — Enquête de Couverture Vaccinale (ECV-2025)", { bold: true, size: 19 }),
        new TextRun({ text: "  —  2025", font: { name: FONT }, size: 18, color: COLOR_ACCENT, bold: true }),
      ],
    }),
    new Paragraph({
      spacing: { after: 30, line: 260 },
      indent: { left: 100 },
      children: [darkText("Organisation Mondiale de la Santé (OMS) — District d'Ambohimahasoa, Haute Matsiatra", { italics: true, color: COLOR_ACCENT })],
    }),
    mainBullet("Collecte de données sur le terrain auprès des ménages pour évaluer la couverture vaccinale."),
    mainBullet("Réalisation d'entretiens, vérification des carnets de vaccination et saisie des données."),
    mainBullet("Respect strict des protocoles de l'enquête, des normes de confidentialité et d'assurance qualité."),
    new Paragraph({ spacing: { after: 80 } }),

    // PROJETS ACADÉMIQUES
    mainHeading("Projets Académiques"),

    new Paragraph({
      spacing: { after: 30, line: 260 },
      children: [
        darkText("Couveuse automatique avec microcontrôleur PIC", { bold: true, size: 19 }),
        new TextRun({ text: "  —  2026", font: { name: FONT }, size: 18, color: COLOR_ACCENT, bold: true }),
      ],
    }),
    mainBullet("Conception et réalisation d'une couveuse automatique basée sur un PIC16F877A."),
    mainBullet("Intégration d'un capteur DHT22 pour la surveillance de la température et de l'humidité en temps réel."),
    mainBullet("Servomoteur pour le retournement automatique des œufs (3 fois par jour) et pompe à eau pour l'humidité."),
    mainBullet("Développement du programme embarqué en C assurant la gestion automatique complète."),

    new Paragraph({
      spacing: { before: 100, after: 30, line: 260 },
      children: [
        darkText("Système de domotique basé sur ESP32 et smartphone", { bold: true, size: 19 }),
        new TextRun({ text: "  —  2025", font: { name: FONT }, size: 18, color: COLOR_ACCENT, bold: true }),
      ],
    }),
    mainBullet("Système de gestion de porte intelligent : ESP32 + capteurs ultrasons + ouverture automatique."),
    mainBullet("Configuration de l'ESP32 en mode point d'accès pour communication directe sans Internet."),
    mainBullet("Application mobile Java (Android) avec communication bidirectionnelle via WebSocket."),
    mainBullet("Technologies : C/C++, ESP32, Arduino, Java, WebSocket, React.js, Node.js, MySQL."),

    new Paragraph({
      spacing: { before: 100, after: 30, line: 260 },
      children: [
        darkText("Système de gestion de porte ESP32 + application mobile", { bold: true, size: 19 }),
        new TextRun({ text: "  —  2024", font: { name: FONT }, size: 18, color: COLOR_ACCENT, bold: true }),
      ],
    }),
    mainBullet("Contrôle à distance d'une porte via smartphone, protocole WebSocket, Java Android."),
  ];
}

// ─── BUILD CV DOCUMENT ──────────────────────────────────────────────────────
async function main() {
  const sidebarWidth = 3800; // twips
  const mainWidth = PAGE_W - sidebarWidth;

  const sidebarCell = new TableCell({
    width: { size: sidebarWidth, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: COLOR_SIDEBAR },
    margins: { top: 200, bottom: 200, left: 300, right: 300 },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
    children: buildSidebar(),
  });

  const mainCell = new TableCell({
    width: { size: mainWidth, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: COLOR_WHITE },
    margins: { top: 100, bottom: 100, left: 400, right: 300 },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
    children: buildMain(),
  });

  const layoutTable = new Table({
    width: { size: PAGE_W, type: WidthType.DXA },
    rows: [
      new TableRow({
        cantSplit: false,
        children: [sidebarCell, mainCell],
      }),
    ],
  });

  const doc = new Document({
    creator: "ALVISY MANAMBINA Nestor",
    title: "CV — ALVISY MANAMBINA Nestor",
    description: "Curriculum Vitae",
    styles: {
      default: {
        document: {
          run: { font: { name: FONT }, size: 20 },
          paragraph: { spacing: { line: 260 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 0, bottom: 0, left: 0, right: 0, header: 0, footer: 0, gutter: 0 },
            size: { width: PAGE_W, height: PAGE_H },
          },
        },
        children: [layoutTable],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = "C:/Users/ALVISY/Desktop/Lycee Mahazengy/CV_Nestor_Corrige.docx";
  writeFileSync(outPath, buffer);
  console.log("CV generated:", outPath);
}

main().catch(e => { console.error(e); process.exit(1); });
