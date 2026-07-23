import { redirect } from "react-router";

import { permissions } from "~/config/permissions";
import {
  createEstablishment,
  getEstablishment,
  listEstablishments,
  updateEstablishment,
  type EstablishmentInput,
} from "~/services/establishments/establishments.service";
import type { EstablishmentType } from "~/types/admin";
import { parseListSearchParams } from "~/utils/search-params";

import { requirePermission } from "../auth/require-permission.server";
import { requireCsrfToken } from "../security/csrf.server";
import { requireAccessToken } from "../session.server";

function notFound(): never {
  throw new Response("Établissement introuvable", { status: 404 });
}

function readInput(formData: FormData): EstablishmentInput {
  return {
    name: String(formData.get("name") ?? "").trim(),
    type: String(formData.get("type") ?? "HOSPITAL") as EstablishmentType,
    region: String(formData.get("region") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    status: String(formData.get("status") ?? "ACTIVE") as EstablishmentInput["status"],
    regionId: String(formData.get("regionId") ?? "").trim() || undefined,
  };
}

export async function loadEstablishmentsList(request: Request) {
  await requirePermission(request, permissions.establishmentRead);
  const accessToken = await requireAccessToken(request);
  const query = parseListSearchParams(new URL(request.url).searchParams);
  return {
    establishments: await listEstablishments(query, accessToken),
    query,
  };
}

export async function loadEstablishmentDetail(request: Request, id: string) {
  await requirePermission(request, permissions.establishmentRead);
  const accessToken = await requireAccessToken(request);
  const establishment = await getEstablishment(id, accessToken);
  if (!establishment) notFound();
  return { establishment };
}

export async function loadEstablishmentCreate(request: Request) {
  await requirePermission(request, permissions.establishmentCreate);
  return {};
}

export async function loadEstablishmentEdit(request: Request, id: string) {
  await requirePermission(request, permissions.establishmentUpdate);
  const accessToken = await requireAccessToken(request);
  const establishment = await getEstablishment(id, accessToken);
  if (!establishment) notFound();
  return { establishment };
}

export async function createEstablishmentAction(request: Request) {
  await requireCsrfToken(request);
  await requirePermission(request, permissions.establishmentCreate);
  const accessToken = await requireAccessToken(request);
  const establishment = await createEstablishment(
    readInput(await request.formData()),
    accessToken,
  );
  return redirect(`/establishments/${establishment.id}`);
}

export async function updateEstablishmentAction(request: Request, id: string) {
  await requireCsrfToken(request);
  await requirePermission(request, permissions.establishmentUpdate);
  const accessToken = await requireAccessToken(request);
  const establishment = await updateEstablishment(
    id,
    readInput(await request.formData()),
    accessToken,
  );
  if (!establishment) notFound();
  return redirect(`/establishments/${establishment.id}`);
}
