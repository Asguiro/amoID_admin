import { redirect } from "react-router";

import { permissions } from "~/config/permissions";
import {
  createAgent,
  getAgent,
  listAgentActivity,
  listAgents,
  reactivateAgent,
  suspendAgent,
  updateAgent,
  type AgentInput,
} from "~/services/agents/agents.service";
import { listDevices } from "~/services/devices/devices.service";
import { listEstablishments } from "~/services/establishments/establishments.service";
import type { AgentStatus } from "~/types/admin";
import { parseListSearchParams } from "~/utils/search-params";

import { requirePermission } from "../auth/require-permission.server";
import { requireCsrfToken } from "../security/csrf.server";
import { requireAccessToken } from "../session.server";

function notFound(): never {
  throw new Response("Agent introuvable", { status: 404 });
}

function readInput(formData: FormData): AgentInput {
  const [establishmentId = "", establishmentName = "", region = ""] = String(
    formData.get("establishment") ?? "",
  ).split("|");
  return {
    displayName: String(formData.get("displayName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    status: String(formData.get("status") ?? "PENDING") as AgentStatus,
    establishmentId,
    establishmentName,
    region,
    password: String(formData.get("password") ?? "").trim() || undefined,
  };
}

async function establishmentOptions(accessToken: string) {
  return (await listEstablishments({ page: 1, pageSize: 100 }, accessToken))
    .items;
}

export async function loadAgentsList(request: Request) {
  await requirePermission(request, permissions.agentRead);
  const accessToken = await requireAccessToken(request);
  const query = parseListSearchParams(new URL(request.url).searchParams);
  return { agents: await listAgents(query, accessToken), query };
}

export async function loadAgentDetail(request: Request, id: string) {
  await requirePermission(request, permissions.agentRead);
  const accessToken = await requireAccessToken(request);
  const agent = await getAgent(id, accessToken);
  if (!agent) notFound();
  const activity = await listAgentActivity(id, accessToken);
  return { agent, activity };
}

export async function loadAgentCreate(request: Request) {
  await requirePermission(request, permissions.agentCreate);
  const accessToken = await requireAccessToken(request);
  return { establishments: await establishmentOptions(accessToken) };
}

export async function loadAgentEdit(request: Request, id: string) {
  await requirePermission(request, permissions.agentUpdate);
  const accessToken = await requireAccessToken(request);
  const agent = await getAgent(id, accessToken);
  if (!agent) notFound();
  return { agent, establishments: await establishmentOptions(accessToken) };
}

export async function loadAgentDevices(request: Request, id: string) {
  await requirePermission(request, permissions.deviceRead);
  const accessToken = await requireAccessToken(request);
  const agent = await getAgent(id, accessToken);
  if (!agent) notFound();
  const query = parseListSearchParams(new URL(request.url).searchParams);
  return {
    agent,
    devices: await listDevices({ ...query, agentId: id }, accessToken),
    query,
  };
}

export async function createAgentAction(request: Request) {
  await requireCsrfToken(request);
  await requirePermission(request, permissions.agentCreate);
  const accessToken = await requireAccessToken(request);
  const agent = await createAgent(readInput(await request.formData()), accessToken);
  return redirect(`/agents/${agent.id}`);
}

export async function updateAgentAction(request: Request, id: string) {
  await requireCsrfToken(request);
  await requirePermission(request, permissions.agentUpdate);
  const accessToken = await requireAccessToken(request);
  const agent = await updateAgent(
    id,
    readInput(await request.formData()),
    accessToken,
  );
  if (!agent) notFound();
  return redirect(`/agents/${agent.id}`);
}

export async function agentStatusAction(request: Request, id: string) {
  await requireCsrfToken(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  const accessToken = await requireAccessToken(request);
  if (intent === "suspend") {
    await requirePermission(request, permissions.agentSuspend);
    if (!(await suspendAgent(id, reason, accessToken))) notFound();
  } else if (intent === "reactivate") {
    await requirePermission(request, permissions.agentReactivate);
    if (!(await reactivateAgent(id, reason, accessToken))) notFound();
  } else {
    throw new Response("Action invalide", { status: 400 });
  }
  return redirect(`/agents/${id}`);
}
