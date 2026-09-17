import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardList, FileWarning, Send, UserRound } from "lucide-react";

export const Route = createFileRoute("/inscription")({
  head: () => ({
    meta: [
      {
        title: "Inscription — Lycée Mahazengy Fianarantsoa",
      },
      {
        name: "description",
        content: "Suivi de l'inscription et des pièces du dossier au Lycée Mahazengy.",
      },
    ],
  }),
  component: Inscription,
});

const documents = [
  "Copie d'acte de naissance",
  "Bulletin ou relevé de notes",
  "Certificat de scolarité",
  "Photo d'identité",
];

const ESP32_BASE_URL = (import.meta.env.VITE_ESP32_URL || "http://192.168.137.63").replace(/\/$/, "");

function Inscription() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [classe, setClasse] = useState("");
  const [situation, setSituation] = useState(/** @type {"passant" | "redoublant"} */ ("passant"));
  const [inscriptionValidee, setInscriptionValidee] = useState(false);
  const [pieces, setPieces] = useState(/** @type {string[]} */ ([]));
  const [envoiLcd, setEnvoiLcd] = useState(
    /** @type {"idle" | "sending" | "success" | "error"} */ ("idle"),
  );

  const manquantes = documents.filter((document) => !pieces.includes(document));
  const dossierComplet = inscriptionValidee && manquantes.length === 0;

  const classeCourte = useMemo(() => {
    switch (classe) {
      case "Seconde":
        return "2nde";
      case "Première L":
        return "1L";
      case "Première S":
        return "1S";
      case "Terminale L":
        return "TL";
      case "Terminale S":
        return "TS";
      case "Terminale OSE":
        return "TOSE";
      default:
        return "CLASSE ?";
    }
  }, [classe]);

  const statutEleve = situation === "passant" ? "PASSANT" : "REDOUBLANT";
  const lcdLines = useMemo(() => {
    if (!inscriptionValidee) return ["INSCRIPTION", "EN ATTENTE"];
    return ["INSCRIPTION OK", `${classeCourte}/${statutEleve}`];
  }, [inscriptionValidee, classeCourte, statutEleve]);

  const inscriptionPrete = Boolean(nom.trim()) && Boolean(prenom.trim()) && Boolean(classe);

  /**
   * @param {string} document
   */
  function toggleDocument(document) {
    setEnvoiLcd("idle");
    setPieces((actuelles) =>
      actuelles.includes(document)
        ? actuelles.filter((piece) => piece !== document)
        : [...actuelles, document],
    );
  }

  function valider() {
    setInscriptionValidee(true);
    setEnvoiLcd("idle");
  }

  async function afficherSurLcd() {
    setEnvoiLcd("sending");
    try {
      const etatDisplay = `${classeCourte}/${statutEleve}`;

      const response1 = await fetch(`${ESP32_BASE_URL}/display`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ line1: "INSCRIPTION OK", line2: etatDisplay }),
      });
      if (!response1.ok) throw new Error("ESP32 inaccessible");

      await new Promise((resolve) => setTimeout(resolve, 1800));

      const response2 = await fetch(`${ESP32_BASE_URL}/display`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          line1: "DOSSIER",
          line2: dossierComplet ? "COMPLET" : "INCOMPLET",
        }),
      });
      if (!response2.ok) throw new Error("ESP32 inaccessible");

      setEnvoiLcd("success");
    } catch {
      setEnvoiLcd("error");
    }
  }

  return (
    <>
      <section className="bg-navy text-primary-foreground">
        <div className="container-page py-16 md:py-20">
          <p className="text-sm font-medium uppercase tracking-wider text-gold">
            Service administratif
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Inscription et suivi du dossier
          </h1>
          <p className="mt-4 max-w-3xl leading-relaxed text-white/80">
            Vérifiez les pièces du dossier avant de finaliser l&apos;inscription, puis envoyez le
            statut vers l&apos;écran LCD relié à l&apos;ESP32.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-8 py-12 lg:grid-cols-[1.25fr_.75fr] lg:py-16">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-accent text-navy">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-navy">
                Nouvelle inscription
              </h2>
              <p className="text-sm text-muted-foreground">
                Complétez et contrôlez le dossier de l&apos;élève.
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground" htmlFor="nom-eleve">
                Nom
              </label>
              <input
                id="nom-eleve"
                value={nom}
                onChange={(event) => setNom(event.target.value)}
                placeholder="Ex. RAKOTO"
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground" htmlFor="prenom-eleve">
                Prénom
              </label>
              <input
                id="prenom-eleve"
                value={prenom}
                onChange={(event) => setPrenom(event.target.value)}
                placeholder="Ex. Aina"
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground" htmlFor="classe">
                Classe
              </label>
              <select
                id="classe"
                value={classe}
                onChange={(event) => setClasse(event.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Choisir la classe</option>
                <option>Seconde</option>
                <option>Première L</option>
                <option>Première S</option>
                <option>Terminale L</option>
                <option>Terminale S</option>
                <option>Terminale OSE</option>
              </select>
            </div>

            <fieldset>
              <legend className="block text-sm font-medium text-foreground">Situation</legend>
              <div className="mt-2 flex h-[42px] items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="situation"
                    value="passant"
                    checked={situation === "passant"}
                    onChange={(event) =>
                      setSituation(event.target.value === "redoublant" ? "redoublant" : "passant")
                    }
                  />
                  Passant
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="situation"
                    value="redoublant"
                    checked={situation === "redoublant"}
                    onChange={(event) =>
                      setSituation(event.target.value === "redoublant" ? "redoublant" : "passant")
                    }
                  />
                  Redoublant
                </label>
              </div>
            </fieldset>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-navy">Pièces du dossier</h3>
              <p className="mt-1 text-sm text-muted-foreground">Cochez les documents déjà remis.</p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-navy">
              {pieces.length}/{documents.length} reçues
            </span>
          </div>

          <div className="mt-4 divide-y divide-border rounded-lg border border-border">
            {documents.map((document) => {
              const recu = pieces.includes(document);
              return (
                <label
                  key={document}
                  className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-secondary/60"
                >
                  <input
                    type="checkbox"
                    checked={recu}
                    onChange={() => toggleDocument(document)}
                    className="h-4 w-4 accent-[var(--navy)]"
                  />
                  <span className="flex-1 text-sm">{document}</span>
                  {recu ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <FileWarning className="h-5 w-5 text-amber-500" />
                  )}
                </label>
              );
            })}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={valider}
              disabled={!inscriptionPrete}
              className="inline-flex items-center gap-2 rounded-md bg-navy px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ClipboardList className="h-4 w-4" />
              Valider l&apos;inscription
            </button>

            <button
              type="button"
              onClick={afficherSurLcd}
              disabled={!inscriptionValidee || envoiLcd === "sending"}
              className="inline-flex items-center gap-2 rounded-md border border-navy bg-background px-5 py-3 text-sm font-semibold text-navy hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {envoiLcd === "sending" ? "Envoi..." : "Envoyer vers le LCD"}
            </button>
          </div>

          {!inscriptionPrete && (
            <p className="mt-2 text-xs text-muted-foreground">
              Saisissez le nom, le prénom et la classe pour valider l&apos;inscription.
            </p>
          )}
          {envoiLcd === "success" && (
            <p className="mt-3 text-sm font-medium text-emerald-700">
              Statut envoyé avec succès vers l&apos;écran LCD.
            </p>
          )}
          {envoiLcd === "error" && (
            <p className="mt-3 text-sm font-medium text-destructive">
              Connexion impossible. Connectez d&apos;abord cet ordinateur au Wi-Fi de l&apos;ESP32.
            </p>
          )}
        </div>

        <aside className="space-y-5">
          {dossierComplet ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <h3 className="mt-3 font-display text-xl font-semibold">
                Inscription et dossier complets
              </h3>
              <p className="mt-2 text-sm">
                {nom} {prenom} — {classe}, {situation} — est inscrit(e) et toutes les pièces ont été
                reçues.
              </p>
            </div>
          ) : inscriptionValidee ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
              <FileWarning className="h-6 w-6 text-amber-600" />
              <h3 className="mt-3 font-display text-xl font-semibold">
                Inscription validée, dossier incomplet
              </h3>
              <p className="mt-2 text-sm">Pièces manquantes : {manquantes.join(", ")}.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-secondary p-5 text-foreground">
              <ClipboardList className="h-6 w-6 text-navy" />
              <h3 className="mt-3 font-display text-xl font-semibold text-navy">
                En attente de validation
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Validez l&apos;inscription pour obtenir le statut définitif du dossier.
              </p>
            </div>
          )}
        </aside>
      </section>
    </>
  );
}
