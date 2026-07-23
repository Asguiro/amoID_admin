export type AgentActivityItem = {
  id: string;
  action: string;
  actorId: string;
  actorRole: string;
  reason?: string | null;
  createdAt: string;
};

const ACTIVITY_LABELS: Record<string, string> = {
  AGENT_CREATE: "Création du compte agent",
  AGENT_UPDATE: "Modification du profil",
  AGENT_SUSPEND: "Suspension du compte",
  AGENT_REACTIVATE: "Réactivation du compte",
  AUTH_LOGIN: "Connexion",
  AUTH_LOGOUT: "Déconnexion",
};

export function labelAgentActivity(action: string): string {
  return ACTIVITY_LABELS[action] ?? action;
}
