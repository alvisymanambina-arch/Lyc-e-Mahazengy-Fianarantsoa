import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

function NotFoundComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <div className="flex-1 flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center py-24">
          <p className="font-display text-7xl font-bold text-navy">404</p>
          <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">Page introuvable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            La page recherchée n'existe pas ou a été déplacée.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-navy/90"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function ErrorComponent({ error, reset }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold text-foreground">Une erreur est survenue</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Quelque chose s'est mal passé. Vous pouvez réessayer ou revenir à l'accueil.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-md bg-navy px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-navy/90"
          >
            Réessayer
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent">
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lycée Mahazengy Fianarantsoa — Établissement public secondaire" },
      { name: "description", content: "Site officiel du Lycée Mahazengy à Fianarantsoa (Madagascar). Historique, proviseurs, personnel, résultats du BAC et fiche technique." },
      { name: "author", content: "Lycée Mahazengy Fianarantsoa" },
      { property: "og:title", content: "Lycée Mahazengy Fianarantsoa" },
      { property: "og:description", content: "Établissement public secondaire de la CISCO Fianarantsoa, DREN Haute Matsiatra. Depuis 2010." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}


