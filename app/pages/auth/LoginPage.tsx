import { Form, useNavigation } from "react-router";
import { Fingerprint, Lock, ShieldCheck } from "lucide-react";

import { BrandLogo } from "~/components/brand/BrandLogo";
import markWhite from "~/assets/icons/svg/amo-id-sante-mark-white.svg";

interface LoginPageProps {
  error?: string;
  redirectTo: string;
  demoAccounts: Array<{ email: string; role: string; displayName: string }>;
}

export function LoginPage({ error, redirectTo, demoAccounts }: LoginPageProps) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" &&
    (navigation.formAction === "/login" ||
      navigation.formAction?.endsWith("/login"));

  return (
    <main className="amo-login-surface flex min-h-screen">
      <section className="amo-login-panel relative hidden w-[44%] overflow-hidden text-white lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-14">
        <div className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute bottom-20 -left-20 size-80 rounded-full bg-(--amo-gold)/10" />

        <div className="relative flex items-center gap-3">
          <img
            src={markWhite}
            alt=""
            aria-hidden
            className="size-11"
          />
          <div>
            <p className="amo-display text-lg font-semibold tracking-wide">
              AMO <span className="text-(--amo-gold)">ID</span> Santé
            </p>
            <p className="text-xs text-white/55">Administration</p>
          </div>
        </div>

        <div className="amo-animate-in relative max-w-md">
          <h1 className="amo-display text-4xl leading-tight font-semibold tracking-tight xl:text-5xl">
            L&apos;identité qui protège.
            <span className="mt-2 block text-(--amo-gold)">
              La santé qui rassemble.
            </span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/75">
            Back-office CANAM / AMO pour piloter enrôlements, vérifications et
            sécurité opérationnelle.
          </p>

          <ul className="mt-10 space-y-4 text-sm text-white/80">
            <li className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-white/10">
                <ShieldCheck className="size-4" aria-hidden />
              </span>
              Accès réservé et journalisé
            </li>
            <li className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-white/10">
                <Fingerprint className="size-4" aria-hidden />
              </span>
              Identité biométrique sécurisée
            </li>
            <li className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-white/10">
                <Lock className="size-4" aria-hidden />
              </span>
              Session serveur httpOnly
            </li>
          </ul>
        </div>

        <p className="relative text-xs text-white/50">
          AMO ID Santé Mali — administration professionnelle
        </p>
      </section>

      <section className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <div className="amo-animate-in amo-animate-in-delay-1 w-full max-w-[420px]">
          <div className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="lg:hidden">
              <BrandLogo variant="horizontal" to={null} priority imgClassName="h-11" />
            </div>
            <p className="mt-6 text-sm font-medium tracking-wide text-primary uppercase lg:mt-0">
              Espace administration
            </p>
            <h2 className="amo-display mt-2 text-3xl font-semibold tracking-tight text-secondary">
              Bon retour
            </h2>
            <p className="mt-2 text-sm text-base-content/65">
              Connectez-vous avec vos identifiants professionnels AMO.
            </p>
          </div>

          <div className="amo-card-flush p-6 sm:p-8">
            {error ? (
              <div className="alert alert-error mb-5 rounded-2xl" role="alert">
                <span>{error}</span>
              </div>
            ) : null}

            <Form method="post" className="space-y-4" replace>
              <input type="hidden" name="redirectTo" value={redirectTo} />

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-secondary">
                  Adresse e-mail
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="username"
                  className="amo-input"
                  defaultValue="admin@amo.ml"
                  placeholder="prenom.nom@amo.ml"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-secondary">
                  Mot de passe
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  className="amo-input"
                  defaultValue="Admin123!"
                  placeholder="••••••••"
                />
              </label>

              <button
                type="submit"
                className="amo-btn-primary mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : null}
                {isSubmitting ? "Connexion…" : "Se connecter"}
              </button>
            </Form>
          </div>

          <details className="amo-animate-in amo-animate-in-delay-2 mt-5 rounded-2xl border border-base-300/80 bg-white/70 p-4 text-xs backdrop-blur-sm">
            <summary className="cursor-pointer font-medium text-secondary">
              Comptes de démonstration
            </summary>
            <ul className="mt-3 space-y-2 text-base-content/70">
              {demoAccounts.map((account) => (
                <li key={account.email} className="flex flex-col gap-0.5">
                  <span className="font-medium text-secondary">
                    {account.displayName}
                  </span>
                  <span>
                    {account.email} · {account.role}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </section>
    </main>
  );
}
