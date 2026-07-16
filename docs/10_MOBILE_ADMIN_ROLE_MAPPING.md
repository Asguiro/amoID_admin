# Mapping rôles mobile agent ↔ dash admin

Référence stable — **ne pas renommer** les rôles admin déjà câblés au RBAC.

| Rôle mobile (`src` agent) | Rôle admin | Label FR |
|---------------------------|------------|----------|
| `ADMIN` | `ADMIN_CENTRAL` | Administrateur CANAM / AMO |
| `SUPERVISOR_REGIONAL` | `REGIONAL_SUPERVISOR` | Superviseur régional |
| `SUPERVISOR_ESTABLISHMENT` | `ESTABLISHMENT_SUPERVISOR` | Superviseur établissement |
| `AGENT_ENROLLMENT` | `ENROLLMENT_AGENT` | Agent d’enrôlement |
| `AGENT_CARE_POINT` | `CARE_POINT_AGENT` | Agent point de soin |
| `AUDITOR` | `AUDITOR` | Auditeur / contrôleur |

Constantes TypeScript : `MOBILE_TO_ADMIN_ROLE_MAP` et `ADMIN_ROLE_LABELS` dans `app/types/admin.ts`.
