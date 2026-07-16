import {
  Activity,
  Building2,
  FileBarChart,
  Fingerprint,
  LayoutDashboard,
  QrCode,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  UserRoundCheck,
  Users,
} from "lucide-react";

import { permissions, type Permission } from "./permissions";

export interface NavigationItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  permissions: readonly Permission[];
}

export const navigationItems: NavigationItem[] = [
  {
    label: "Vue d'ensemble",
    to: "/dashboard",
    icon: LayoutDashboard,
    permissions: [
      permissions.dashboardReadGlobal,
      permissions.dashboardReadRegion,
      permissions.dashboardReadEstablishment,
    ],
  },
  {
    label: "Bénéficiaires",
    to: "/beneficiaries",
    icon: Users,
    permissions: [permissions.beneficiaryReadBasic],
  },
  {
    label: "Enrôlements",
    to: "/enrollments",
    icon: UserRoundCheck,
    permissions: [permissions.enrollmentRead],
  },
  {
    label: "Vérifications",
    to: "/verifications",
    icon: Fingerprint,
    permissions: [permissions.verificationRead],
  },
  {
    label: "Agents",
    to: "/agents",
    icon: ShieldCheck,
    permissions: [permissions.agentRead],
  },
  {
    label: "Établissements",
    to: "/establishments",
    icon: Building2,
    permissions: [permissions.establishmentRead],
  },
  {
    label: "Appareils",
    to: "/devices",
    icon: Smartphone,
    permissions: [permissions.deviceRead],
  },
  {
    label: "QR temporaires",
    to: "/temporary-qr",
    icon: QrCode,
    permissions: [permissions.temporaryQrRead],
  },
  {
    label: "Alertes & fraude",
    to: "/alerts",
    icon: ShieldAlert,
    permissions: [permissions.alertRead],
  },
  {
    label: "Rapports",
    to: "/reports",
    icon: FileBarChart,
    permissions: [permissions.reportRead],
  },
  {
    label: "Audit",
    to: "/audit",
    icon: Activity,
    permissions: [permissions.auditRead],
  },
  {
    label: "Paramètres",
    to: "/settings/access",
    icon: Settings,
    permissions: [permissions.settingsRead],
  },
];
