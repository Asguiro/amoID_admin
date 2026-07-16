import type {
  AlertDetail,
  AlertItem,
  AlertStatus,
  ListQuery,
  PaginatedResponse,
} from "~/types/admin";

import { daysAgo, filterByQuery, filterByStatus, toPaginated } from "../_shared/mock.utils";

const ALLOWED_TRANSITIONS: Record<AlertStatus, readonly AlertStatus[]> = {
  NEW: ["ASSIGNED"],
  ASSIGNED: ["UNDER_REVIEW"],
  UNDER_REVIEW: ["NEEDS_INFORMATION", "CONFIRMED", "DISMISSED", "ESCALATED"],
  NEEDS_INFORMATION: ["UNDER_REVIEW"],
  CONFIRMED: ["CLOSED"],
  DISMISSED: ["CLOSED"],
  ESCALATED: ["CLOSED"],
  CLOSED: [],
};

export function canTransitionAlertStatus(
  from: AlertStatus,
  to: AlertStatus,
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function assertAlertStatusTransition(
  from: AlertStatus,
  to: AlertStatus,
): void {
  if (!canTransitionAlertStatus(from, to)) {
    throw new Error(`Transition d’alerte invalide : ${from} → ${to}.`);
  }
}

const seeds: Array<{
  title: string;
  severity: AlertItem["severity"];
  status: AlertStatus;
  assignee?: string;
  establishmentName: string;
  description: string;
}> = [
  {
    title: "Pic de vérifications échouées",
    severity: "CRITICAL",
    status: "NEW",
    establishmentName: "CSRéf Bamako Centre",
    description: "Le taux d’échec dépasse trois fois la moyenne habituelle sur une fenêtre de 30 minutes.",
  },
  {
    title: "Appareil révoqué réutilisé",
    severity: "CRITICAL",
    status: "ASSIGNED",
    assignee: "Fatoumata Sangaré",
    establishmentName: "Hôpital du Mali",
    description: "Une tentative de vérification provient d’un appareil précédemment révoqué.",
  },
  {
    title: "Enrôlements multiples similaires",
    severity: "HIGH",
    status: "UNDER_REVIEW",
    assignee: "Moussa Coulibaly",
    establishmentName: "Clinique Pasteur",
    description: "Plusieurs dossiers partagent des attributs d’identité et des empreintes proches.",
  },
  {
    title: "Volume inhabituel de QR temporaires",
    severity: "HIGH",
    status: "ESCALATED",
    assignee: "Aminata Traoré",
    establishmentName: "CSRéf Kati",
    description: "Le volume d’émission dépasse le seuil quotidien défini pour cet établissement.",
  },
  {
    title: "Vérifications nocturnes répétées",
    severity: "MEDIUM",
    status: "CONFIRMED",
    assignee: "Fatoumata Sangaré",
    establishmentName: "Pharmacie du Fleuve",
    description: "Une série de vérifications a été réalisée hors des horaires d’ouverture.",
  },
  {
    title: "Tentatives sur bénéficiaire suspendu",
    severity: "MEDIUM",
    status: "DISMISSED",
    assignee: "Moussa Coulibaly",
    establishmentName: "Hôpital Gabriel Touré",
    description: "Des vérifications concernent un dossier suspendu, expliquées par une régularisation en cours.",
  },
];

const alerts: AlertDetail[] = seeds.map((seed, index) => {
  const createdAt = daysAgo(index, index + 1);
  return {
    id: `ALT-2026-${String(index + 1).padStart(3, "0")}`,
    ...seed,
    createdAt,
    updatedAt: daysAgo(Math.max(0, index - 1)),
    timeline: [
      {
        id: `timeline-${index}-1`,
        label: "Alerte générée par le moteur de signaux",
        actor: "Système",
        createdAt,
      },
      ...(seed.assignee
        ? [{
            id: `timeline-${index}-2`,
            label: `Alerte affectée à ${seed.assignee}`,
            actor: "Supervision fraude",
            createdAt: daysAgo(Math.max(0, index - 1), 2),
          }]
        : []),
    ],
    comments: [],
  };
});

function requireAlert(id: string): AlertDetail {
  const alert = alerts.find((item) => item.id === id);
  if (!alert) throw new Error("Alerte introuvable.");
  return alert;
}

export async function listAlerts(
  query: ListQuery,
): Promise<PaginatedResponse<AlertItem>> {
  const searched = filterByQuery(alerts, query.q, [
    (alert) => alert.title,
    (alert) => alert.assignee ?? "",
    (alert) => alert.establishmentName ?? "",
  ]);
  return toPaginated(filterByStatus(searched, query.status), query.page, query.pageSize);
}

export async function getAlertDetail(id: string): Promise<AlertDetail | undefined> {
  return alerts.find((alert) => alert.id === id);
}

export async function assignAlert(id: string, assignee: string): Promise<AlertDetail> {
  const alert = requireAlert(id);
  if (!assignee.trim()) throw new Error("Le nom de l’analyste est obligatoire.");
  if (alert.status !== "NEW" && alert.status !== "ASSIGNED") {
    throw new Error("Seule une alerte nouvelle ou affectée peut être réaffectée.");
  }
  if (alert.status === "NEW") assertAlertStatusTransition(alert.status, "ASSIGNED");
  alert.assignee = assignee.trim();
  alert.status = "ASSIGNED";
  alert.updatedAt = new Date().toISOString();
  alert.timeline.unshift({
    id: crypto.randomUUID(),
    label: `Alerte affectée à ${alert.assignee}`,
    actor: "Administrateur",
    createdAt: alert.updatedAt,
  });
  return alert;
}

export async function addAlertComment(id: string, body: string): Promise<AlertDetail> {
  const alert = requireAlert(id);
  if (!body.trim()) throw new Error("Le commentaire ne peut pas être vide.");
  const createdAt = new Date().toISOString();
  alert.comments.unshift({
    id: crypto.randomUUID(),
    body: body.trim(),
    actor: "Administrateur",
    createdAt,
  });
  alert.updatedAt = createdAt;
  return alert;
}

export async function updateAlertStatus(
  id: string,
  status: AlertStatus,
  reason: string,
): Promise<AlertDetail> {
  const alert = requireAlert(id);
  if (!reason.trim()) throw new Error("Le motif de la décision est obligatoire.");
  assertAlertStatusTransition(alert.status, status);
  const createdAt = new Date().toISOString();
  alert.status = status;
  alert.updatedAt = createdAt;
  alert.timeline.unshift({
    id: crypto.randomUUID(),
    label: `${status.replaceAll("_", " ")} — ${reason.trim()}`,
    actor: "Administrateur",
    createdAt,
  });
  return alert;
}
