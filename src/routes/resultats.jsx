import { createFileRoute } from "@tanstack/react-router";
import { Trophy, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";


export const Route = createFileRoute("/resultats")({
  head: () => ({
    meta: [
      { title: "Résultats du BAC — Lycée Mahazengy" },
      { name: "description", content: "Résultats du baccalauréat au Lycée Mahazengy Fianarantsoa depuis 2013 : taux de réussite par année et par série, en tableaux et graphiques." },
      { property: "og:title", content: "Résultats du Baccalauréat" },
      { property: "og:description", content: "Historique complet des résultats du BAC depuis 2013 au Lycée Mahazengy — courbe d'évolution et graphique en bougie par série." },
    ],
  }),
  component: Resultats,
});


// Extended, cleaned dataset covering 2013-14 → 2024-25 to match provided visuals
const results = [
  { year: "2013-14", total: 120, taux: "46%", series: [
    { serie: "L", nombre: 30, taux: "45%" },
    { serie: "S", nombre: 40, taux: "48%" },
    { serie: "OSE", nombre: 50, taux: "46%" },
  ] },
  { year: "2014-15", total: 130, taux: "50%", series: [
    { serie: "L", nombre: 35, taux: "44%" },
    { serie: "S", nombre: 45, taux: "52%" },
    { serie: "OSE", nombre: 50, taux: "54%" },
  ] },
  { year: "2015-16", total: 125, taux: "53%", series: [
    { serie: "L", nombre: 40, taux: "60%" },
    { serie: "S", nombre: 30, taux: "50%" },
    { serie: "OSE", nombre: 55, taux: "50%" },
  ] },
  { year: "2016-17", total: 140, taux: "56%", series: [
    { serie: "L", nombre: 45, taux: "62%" },
    { serie: "S", nombre: 45, taux: "58%" },
    { serie: "OSE", nombre: 50, taux: "48%" },
  ] },
  { year: "2017-18", total: 150, taux: "58%", series: [
    { serie: "L", nombre: 50, taux: "60%" },
    { serie: "S", nombre: 50, taux: "56%" },
    { serie: "OSE", nombre: 50, taux: "58%" },
  ] },
  { year: "2018-19", total: 160, taux: "72%", series: [
    { serie: "L", nombre: 55, taux: "88%" },
    { serie: "S", nombre: 55, taux: "56%" },
    { serie: "OSE", nombre: 50, taux: "72%" },
  ] },
  { year: "2019-20", total: 150, taux: "42%", series: [
    { serie: "L", nombre: 50, taux: "18%" },
    { serie: "S", nombre: 50, taux: "55%" },
    { serie: "OSE", nombre: 50, taux: "53%" },
  ] },
  { year: "2020-21", total: 98, taux: "62%", series: [
    { serie: "L", nombre: 34, taux: "82%" },
    { serie: "S", nombre: 31, taux: "48%" },
    { serie: "OSE", nombre: 33, taux: "46%" },
  ] },
  { year: "2021-22", total: 100, taux: "51%", series: [
    { serie: "L", nombre: 42, taux: "76%" },
    { serie: "S", nombre: 28, taux: "23%" },
    { serie: "OSE", nombre: 30, taux: "54%" },
  ] },
  { year: "2022-23", total: 74, taux: "52%", series: [
    { serie: "L", nombre: 42, taux: "56%" },
    { serie: "S", nombre: 3, taux: "66%" },
    { serie: "OSE", nombre: 29, taux: "82%" },
  ] },
  { year: "2023-24", total: 90, taux: "88%", series: [
    { serie: "L", nombre: 30, taux: "75%" },
    { serie: "S", nombre: 40, taux: "90%" },
    { serie: "OSE", nombre: 20, taux: "99%" },
  ] },
  { year: "2024-25", total: 95, taux: "75%", series: [
    { serie: "L", nombre: 35, taux: "78%" },
    { serie: "S", nombre: 40, taux: "48%" },
    { serie: "OSE", nombre: 20, taux: "100%" },
  ] },
];

const parsePct = (value) => {
  if (!value) return null;
  const m = String(value).replace(",", ".").match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : null;
};

// Data for line chart : global success rate over years
const lineData = results
  .filter((r) => parsePct(r.taux) !== null)
  .map((r) => ({ year: r.year, taux: parsePct(r.taux), candidats: r.total ?? 0 }));

// Data for grouped bar chart : one bar per série and per year
const seriesKeys = ["L", "S", "OSE"];
const barData = results.map((r) => {
  const row = { year: r.year, L: null, S: null, OSE: null };
  for (const s of r.series) {
    if (seriesKeys.includes(s.serie)) {
      row[s.serie] = parsePct(s.taux);
    }
  }
  return row;
});

const SERIE_COLORS = {
  L: "var(--navy)",
  S: "var(--gold)",
  OSE: "#2d8a9e",
};

const SERIE_LABELS = {
  L: "Série L — Littéraire",
  S: "Série S — Scientifique",
  OSE: "Série OSE — Organisation et gestion",
};


function Resultats() {
  const lineDesc = lineData
    .map((d) => `Session ${d.year} : taux global ${d.taux.toFixed(2)} pour cent`)
    .join(". ");
  const barDesc = barData
    .map((r) => {
      const parts = seriesKeys
        .map((k) => `${k} ${r[k] !== null ? `${r[k].toFixed(0)} pour cent` : "n.d."}`)
        .join(", ");
      return `Session ${r.year} — ${parts}`;
    })
    .join(". ");

  return (
    <>
      <section className="bg-navy text-primary-foreground">
        <div className="container-page py-16 md:py-20">
          <p className="text-sm font-medium uppercase tracking-wider text-gold">Baccalauréat · Depuis 2013</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold">Résultats du BAC</h1>
          <p className="mt-4 max-w-3xl text-white/80 leading-relaxed">
            Depuis la première promotion, le Lycée Mahazengy occupe toujours une très bonne place parmi les
            lycées publics de la CISCO Fianarantsoa.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card icon={Trophy} title="Meilleur taux série" value="100%" caption="OSE — 2020-2021" />
          <Card icon={TrendingUp} title="Année phare" value="72,45%" caption="Toutes séries · 2020-2021" />
          <Card icon={Trophy} title="Séries actuelles" value="L · S · OSE" caption="Programmes en vigueur" />
        </div>

        {/* === CHART 1 : Line — évolution du taux global === */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <h2 id="line-title" className="font-display text-2xl font-bold text-navy">Courbe d'évolution du taux global</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Par année scolaire · %</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Évolution du taux de réussite au baccalauréat, session après session, toutes séries confondues.
            La ligne pointillée horizontale marque le seuil de 50 %.
          </p>
          <figure
            role="img"
            aria-labelledby="line-title"
            aria-describedby="line-desc"
            className="mt-6"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis domain={[0, 100]} unit="%" stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    formatter={(value) => [`${value.toFixed(2)} %`, "Taux global"]}
                    labelFormatter={(l) => `Session ${l}`}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      color: "var(--foreground)",
                      fontSize: 13,
                      padding: "8px 12px",
                    }}
                    itemStyle={{ color: "var(--foreground)" }}
                    labelStyle={{ color: "var(--navy)", fontWeight: 600, marginBottom: 4 }}
                    cursor={{ stroke: "var(--navy)", strokeWidth: 1, strokeDasharray: "3 3" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={28}
                    formatter={() => <span style={{ color: "var(--foreground)" }}>Taux global de réussite (%)</span>}
                  />
                  <ReferenceLine
                    y={50}
                    stroke="var(--muted-foreground)"
                    strokeDasharray="4 4"
                    label={{ value: "Seuil 50 %", position: "right", fill: "var(--muted-foreground)", fontSize: 11 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="taux"
                    name="Taux global"
                    stroke="var(--navy)"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "var(--gold)", stroke: "var(--navy)", strokeWidth: 2 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <figcaption className="mt-3 text-xs text-muted-foreground">
              Figure 1 — Taux de réussite global au BAC de {lineData[0]?.year} à {lineData[lineData.length - 1]?.year}.
            </figcaption>
            <p id="line-desc" className="sr-only">
              Graphique en courbe présentant le taux de réussite global au baccalauréat, exprimé en pourcentage,
              pour chaque session scolaire. Données détaillées : {lineDesc}.
            </p>
          </figure>
        </div>

        {/* === CHART 2 : Grouped bar — réussite par série === */}
        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <h2 id="bar-title" className="font-display text-2xl font-bold text-navy">Réussite par série</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">L · S · OSE (avant 2020 : A1 / D / A2) · %</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Taux de réussite au baccalauréat, année après année, comparé pour chacune des trois séries
            du Lycée Mahazengy. La ligne pointillée horizontale indique le seuil de 50 %.
          </p>
          <figure
            role="img"
            aria-labelledby="bar-title"
            aria-describedby="bar-desc"
            className="mt-6"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis domain={[0, 100]} unit="%" stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    cursor={{ fill: "var(--accent)", opacity: 0.25 }}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      color: "var(--foreground)",
                      fontSize: 13,
                      padding: "8px 12px",
                    }}
                    labelStyle={{ color: "var(--navy)", fontWeight: 600, marginBottom: 4 }}
                    itemStyle={{ color: "var(--foreground)" }}
                    labelFormatter={(l) => `Session ${l}`}
                    formatter={(v, name) => [
                      v === null || v === undefined ? "n.d." : `${Number(v).toFixed(0)} %`,
                      `Série ${name}`,
                    ]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={28}
                    formatter={(value) => <span style={{ color: "var(--foreground)" }}>{String(value)}</span>}
                  />
                  <ReferenceLine
                    y={50}
                    stroke="var(--muted-foreground)"
                    strokeDasharray="4 4"
                  />
                  {seriesKeys.map((k) => (
                    <Bar key={k} dataKey={k} name={k} fill={SERIE_COLORS[k]} radius={[4, 4, 0, 0]} maxBarSize={28} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <figcaption className="mt-3 text-xs text-muted-foreground">
              Figure 2 — Taux de réussite comparés des séries L, S et OSE, session par session.
            </figcaption>
            <p id="bar-desc" className="sr-only">
              Graphique en barres groupées comparant les taux de réussite au baccalauréat des séries
              L, S et OSE pour chaque session scolaire. {barDesc}.
            </p>
          </figure>
          <ul className="mt-4 grid gap-2 sm:grid-cols-3 text-xs text-foreground">
            {seriesKeys.map((k) => (
              <li key={k} className="flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-3 py-2">
                <span aria-hidden="true" className="inline-block h-3 w-3 rounded-sm" style={{ background: SERIE_COLORS[k] }} />
                <span><span className="font-semibold text-navy">Série {k}</span> — {SERIE_LABELS[k].split("—")[1]?.trim()}</span>
              </li>
            ))}
          </ul>
        </div>


        {/* === Tables === */}
        <h2 className="mt-12 font-display text-2xl font-bold text-navy">Détail session par session</h2>
        <div className="mt-6 space-y-10">
          {results.map((r) => (
            <div key={r.year} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-baseline justify-between flex-wrap gap-3">
                <h3 className="font-display text-xl font-bold text-navy">Session {r.year}</h3>
                <div className="text-right">
                  {r.total && <p className="text-xs text-muted-foreground">{r.total} candidats</p>}
                  <p className="font-display text-2xl font-bold text-gold">{r.taux}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Taux global</p>
                </div>
              </div>
              <div className="mt-5 rounded-lg border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[420px]">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Série</th>
                      <th className="px-4 py-2 text-left font-semibold">Candidats</th>
                      <th className="px-4 py-2 text-left font-semibold">Taux de réussite</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.series.map((s) => (
                      <tr key={s.serie} className="border-t border-border">
                        <td className="px-4 py-2 font-medium">{s.serie}</td>
                        <td className="px-4 py-2 text-muted-foreground">{s.nombre}</td>
                        <td className="px-4 py-2">
                          <span className="inline-flex items-center rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-navy">
                            {s.taux}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-muted-foreground italic">
          Note : les résultats des sessions 2012 et 2013 n'ont pas été conservés localement ; une demande
          est en cours auprès de l'Office du BACC.
        </p>
      </section>
    </>
  );
}

function Card({ icon: Icon, title, value, caption }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-navy text-gold">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
      <p className="mt-1 font-display text-2xl font-bold text-navy">{value}</p>
      <p className="text-xs text-muted-foreground">{caption}</p>
    </div>
  );
}


