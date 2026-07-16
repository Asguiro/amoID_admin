import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 p-6">
      <div className="amo-card max-w-lg p-8 text-center">
        <p className="text-sm font-medium text-primary">AMO ID Santé</p>
        <h1 className="mt-2 text-2xl font-semibold text-secondary">
          Page introuvable
        </h1>
        <p className="mt-3 text-sm text-base-content/70">
          La page demandée n&apos;existe pas ou n&apos;est plus disponible.
        </p>
        <Link to="/dashboard" className="btn btn-primary mt-6">
          Retour au tableau de bord
        </Link>
      </div>
    </main>
  );
}
