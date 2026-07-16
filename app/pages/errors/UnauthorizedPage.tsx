import { Link } from "react-router";

export function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 p-6">
      <div className="amo-card max-w-lg p-8 text-center">
        <p className="text-sm font-medium text-primary">AMO ID Santé</p>
        <h1 className="mt-2 text-2xl font-semibold text-secondary">
          Accès non autorisé
        </h1>
        <p className="mt-3 text-sm text-base-content/70">
          Votre rôle ne dispose pas des permissions requises pour cette
          ressource. Contactez un administrateur si vous pensez qu&apos;il
          s&apos;agit d&apos;une erreur.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/dashboard" className="btn btn-primary">
            Tableau de bord
          </Link>
          <Link to="/login" className="btn btn-ghost">
            Changer de compte
          </Link>
        </div>
      </div>
    </main>
  );
}
