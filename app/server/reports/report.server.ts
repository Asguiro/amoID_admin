import { hasPermission, permissions } from "~/config/permissions";
import {
  createExportJob,
  getBiometricsReport,
  getExportJob,
  getFraudReport,
  getOperationsReport,
  getQrReport,
  listReports,
} from "~/services/reports/report.service";

import { requirePermission } from "../auth/require-permission.server";
import { requireCsrfToken } from "../security/csrf.server";

export async function loadReportsHub(request: Request) {
  const user = await requirePermission(request, permissions.reportRead);
  const reports = await listReports();
  return {
    reports: reports.filter(
      (report) =>
        report.id !== "costs" ||
        hasPermission(user.permissions, permissions.beneficiaryReadCosts),
    ),
  };
}

export async function loadOperationsReport(request: Request) {
  const user = await requirePermission(request, permissions.reportRead);
  return { report: await getOperationsReport(), permissions: user.permissions };
}

export async function loadBiometricsReport(request: Request) {
  const user = await requirePermission(request, permissions.reportRead);
  return { report: await getBiometricsReport(), permissions: user.permissions };
}

export async function loadQrReport(request: Request) {
  const user = await requirePermission(request, permissions.reportRead);
  return { report: await getQrReport(), permissions: user.permissions };
}

export async function loadFraudReport(request: Request) {
  const user = await requirePermission(request, permissions.reportRead);
  return { report: await getFraudReport(), permissions: user.permissions };
}

export async function createReportExport(request: Request, reportId: string) {
  await requireCsrfToken(request);
  await requirePermission(request, permissions.reportExport);
  return { ok: true as const, job: await createExportJob(reportId) };
}

export async function loadExportJob(request: Request, id: string) {
  await requirePermission(request, permissions.reportRead);
  const job = await getExportJob(id);
  if (!job) throw new Response("Export introuvable.", { status: 404 });
  return { job };
}
