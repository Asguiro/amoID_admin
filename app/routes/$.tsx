import { NotFoundPage } from "~/pages/errors/NotFoundPage";

export function meta() {
  return [{ title: "Page introuvable — AMO ID Admin" }];
}

export function loader() {
  throw new Response("Not Found", { status: 404 });
}

export default function NotFoundRoute() {
  return <NotFoundPage />;
}

export function ErrorBoundary() {
  return <NotFoundPage />;
}
