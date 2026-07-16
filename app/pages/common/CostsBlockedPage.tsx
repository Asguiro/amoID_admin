import { Lock } from "lucide-react";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";

interface CostsBlockedPageProps {
  title: string;
  description?: string;
}

/**
 * Phase 7 remains disabled until financial data sources are validated.
 * Do not surface fake financial KPIs.
 */
export function CostsBlockedPage({
  title,
  description = "Le module coûts AMO démarrera uniquement après validation des sources de prestations et remboursements.",
}: CostsBlockedPageProps) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <AppCard padding="lg" className="flex flex-col items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-warning/15 text-warning">
          <Lock className="size-7" aria-hidden />
        </span>
        <h2 className="amo-display mt-4 text-xl font-semibold text-secondary">
          Module coûts désactivé
        </h2>
        <p className="mt-2 max-w-lg text-sm text-base-content/65">
          Prérequis : connecteurs prestations, montants facturés/acceptés/rejetés,
          codes officiels, pivot d&apos;identité et qualité historique. Un coût
          élevé ne doit jamais être assimilé automatiquement à une fraude.
        </p>
        <p className="mt-4 rounded-full bg-base-200 px-3 py-1 text-xs font-medium text-base-content/60">
          Phase 7 — en attente validation données
        </p>
      </AppCard>
    </div>
  );
}
