import { apiRequest } from "~/server/api/client.server";
import type { Establishment, ListQuery, PaginatedResponse } from "~/types/admin";

export type EstablishmentInput = Pick<
  Establishment,
  "name" | "type" | "region" | "city" | "status"
> & {
  regionId?: string;
};

function buildQuery(query: ListQuery) {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  if (query.q) params.set("q", query.q);
  if (query.status) params.set("status", query.status);
  return params;
}

export async function listEstablishments(
  query: ListQuery,
  accessToken: string,
): Promise<PaginatedResponse<Establishment>> {
  return apiRequest<PaginatedResponse<Establishment>>(
    `/admin/establishments?${buildQuery(query)}`,
    { accessToken },
  );
}

export async function getEstablishment(
  id: string,
  accessToken: string,
): Promise<Establishment | undefined> {
  try {
    return await apiRequest<Establishment>(`/admin/establishments/${id}`, {
      accessToken,
    });
  } catch (error) {
    if (error && typeof error === "object" && "status" in error && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

export async function createEstablishment(
  input: EstablishmentInput,
  accessToken: string,
): Promise<Establishment> {
  if (!input.regionId) {
    throw new Error(
      "regionId est requis pour créer un établissement via l’API.",
    );
  }
  return apiRequest<Establishment>("/admin/establishments", {
    method: "POST",
    accessToken,
    body: {
      name: input.name,
      type: input.type,
      city: input.city,
      regionId: input.regionId,
    },
  });
}

export async function updateEstablishment(
  id: string,
  input: EstablishmentInput,
  accessToken: string,
): Promise<Establishment | undefined> {
  try {
    return await apiRequest<Establishment>(`/admin/establishments/${id}`, {
      method: "PATCH",
      accessToken,
      body: {
        name: input.name,
        type: input.type,
        city: input.city,
      },
    });
  } catch (error) {
    if (error && typeof error === "object" && "status" in error && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}
