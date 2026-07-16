import { ShieldCheck, SlidersHorizontal } from "lucide-react";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { adminRoles } from "~/config/permissions";

export function FraudRulesPage() {
  const signals = [
    "Multiplication rapide de vérifications échouées",
    "Utilisation d’un appareil révoqué",
    "Volume inhabituel de QR temporaires",
    "Opérations hors des horaires habituels",
  ];
  return (
    <>
      <PageHeader
        title="Règles de fraude"
        description="Aperçu des signaux simples utilisés pour orienter les investigations."
      />
      <AppCard padding="lg">
        <div className="flex gap-4">
          <SlidersHorizontal className="size-8 shrink-0 text-primary" aria-hidden />
          <div>
            <h2 className="amo-display text-lg font-semibold text-secondary">Signaux actifs</h2>
            <p className="mt-1 text-sm text-base-content/60">
              Cette première version est informative. Le paramétrage sera activé après validation de la gouvernance fraude.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {signals.map((signal) => (
                <li key={signal} className="rounded-2xl bg-base-200 p-4 text-sm font-medium">{signal}</li>
              ))}
            </ul>
          </div>
        </div>
      </AppCard>
    </>
  );
}

export function AccessSettingsPage() {
  const labels: Record<string, string> = {
    ADMIN_CENTRAL: "Administrateur central",
    REGIONAL_SUPERVISOR: "Superviseur régional",
    ESTABLISHMENT_SUPERVISOR: "Superviseur d’établissement",
    AUDITOR: "Auditeur",
    ENROLLMENT_AGENT: "Agent d’enrôlement",
    CARE_POINT_AGENT: "Agent de point de soins",
  };
  return (
    <>
      <PageHeader
        title="Paramètres d’accès"
        description="Référentiel des rôles administratifs. Consultation seule pour le moment."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Object.values(adminRoles).map((role) => (
          <AppCard key={role}>
            <ShieldCheck className="mb-4 size-7 text-primary" aria-hidden />
            <h2 className="font-semibold text-secondary">{labels[role]}</h2>
            <p className="mt-1 font-mono text-xs text-base-content/50">{role}</p>
          </AppCard>
        ))}
      </div>
    </>
  );
}
