import { Construction } from "lucide-react";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";

interface ComingSoonPageProps {
  title: string;
  description: string;
  phase?: string;
}

export function ComingSoonPage({
  title,
  description,
  phase,
}: ComingSoonPageProps) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <AppCard padding="lg" className="flex flex-col items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Construction className="size-7" aria-hidden />
        </span>
        <h2 className="amo-display mt-4 text-xl font-semibold text-secondary">
          Module en préparation
        </h2>
        <p className="mt-2 max-w-md text-sm text-base-content/65">
          Cette section sera livrée dans la roadmap d&apos;implémentation. Les
          permissions et la navigation sont déjà actives.
        </p>
        {phase ? (
          <p className="mt-4 rounded-full bg-base-200 px-3 py-1 text-xs font-medium text-base-content/60">
            {phase}
          </p>
        ) : null}
      </AppCard>
    </div>
  );
}
