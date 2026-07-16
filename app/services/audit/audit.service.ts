import type { AuditEvent, ListQuery, PaginatedResponse } from "~/types/admin";

import { daysAgo, filterByQuery, filterByStatus, toPaginated } from "../_shared/mock.utils";

const actions = [
  ["Connexion administrateur", "Aminata Traoré", "Session web", "Authentification", "SUCCESS"],
  ["Consultation bénéficiaire", "Moussa Coulibaly", "BEN-10482", "Bénéficiaires", "SUCCESS"],
  ["Accès sensible refusé", "Oumar Diallo", "BEN-10931", "Bénéficiaires", "DENIED"],
  ["Affectation d’alerte", "Aminata Traoré", "ALT-2026-001", "Alertes", "SUCCESS"],
  ["Décision fraude confirmée", "Fatoumata Sangaré", "ALT-2026-002", "Alertes", "SUCCESS"],
  ["Export opérationnel", "Moussa Coulibaly", "EXP-104", "Rapports", "SUCCESS"],
  ["Révocation appareil", "Aminata Traoré", "DEV-882", "Appareils", "SUCCESS"],
  ["Validation enrôlement", "Fatoumata Sangaré", "ENR-5031", "Enrôlements", "SUCCESS"],
  ["Échec de connexion", "Utilisateur inconnu", "Session web", "Authentification", "FAILED"],
  ["Lecture du journal", "Moussa Coulibaly", "AUD-001", "Audit", "SUCCESS"],
  ["Modification d’agent", "Aminata Traoré", "AGT-122", "Agents", "SUCCESS"],
  ["Création établissement", "Aminata Traoré", "EST-045", "Établissements", "SUCCESS"],
  ["Révocation QR temporaire", "Fatoumata Sangaré", "QR-892", "QR temporaires", "SUCCESS"],
  ["Consultation rapport fraude", "Moussa Coulibaly", "RPT-FRAUD", "Rapports", "SUCCESS"],
  ["Changement de rôle refusé", "Oumar Diallo", "AGT-089", "Paramètres", "DENIED"],
  ["Analyse biométrique", "Fatoumata Sangaré", "VER-4021", "Vérifications", "SUCCESS"],
  ["Export échoué", "Moussa Coulibaly", "EXP-099", "Rapports", "FAILED"],
] as const;

const auditEvents: AuditEvent[] = actions.map(
  ([action, actor, target, scope, status], index) => ({
    id: `AUD-${String(index + 1).padStart(4, "0")}`,
    action,
    actor,
    target,
    scope,
    status,
    createdAt: daysAgo(Math.floor(index / 3), index % 4),
    correlationId: `corr-${2026000 + index}`,
  }),
);

export async function listAuditEvents(
  query: ListQuery,
): Promise<PaginatedResponse<AuditEvent>> {
  const searched = filterByQuery(auditEvents, query.q, [
    (event) => event.action,
    (event) => event.actor,
    (event) => event.target,
    (event) => event.correlationId,
  ]);
  const filtered = filterByStatus(searched, query.status);
  return toPaginated(filtered, query.page, query.pageSize);
}

export async function getAuditEvent(id: string): Promise<AuditEvent | undefined> {
  return auditEvents.find((event) => event.id === id);
}
