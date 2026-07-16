import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./styles/app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:wght@500;600;700&display=swap",
  },
  { rel: "icon", href: "/favicon.ico", sizes: "any" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = "Erreur inattendue";
  let details =
    "Une erreur est survenue. Réessayez ou contactez le support AMO ID.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page introuvable";
      details = "La ressource demandée n'existe pas ou a été déplacée.";
    } else if (error.status === 401) {
      title = "Session expirée";
      details = "Veuillez vous reconnecter pour continuer.";
    } else if (error.status === 403) {
      title = "Accès refusé";
      details = "Vous n'avez pas les permissions nécessaires.";
    } else {
      title = `Erreur ${error.status}`;
      details = error.statusText || details;
    }
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen bg-base-200 p-6">
      <div className="amo-card mx-auto max-w-xl p-8">
        <p className="text-sm font-medium text-primary">AMO ID Santé</p>
        <h1 className="mt-2 text-2xl font-semibold text-secondary">{title}</h1>
        <p className="mt-3 text-base-content/80">{details}</p>
        {stack ? (
          <pre className="mt-6 overflow-x-auto rounded-xl bg-base-300 p-4 text-xs">
            <code>{stack}</code>
          </pre>
        ) : null}
        <a className="btn btn-primary mt-6" href="/dashboard">
          Retour au tableau de bord
        </a>
      </div>
    </main>
  );
}
