import { describe, expect, it } from "vitest";

import {
  ensureCsrfToken,
  requireCsrfToken,
} from "~/server/security/csrf.server";

describe("csrf.server", () => {
  it("issues a csrf token cookie", async () => {
    const { token, setCookieHeader } = await ensureCsrfToken(
      new Request("http://localhost/dashboard"),
    );

    expect(token.length).toBeGreaterThan(16);
    expect(setCookieHeader).toContain("__amo_admin_csrf");
  });

  it("rejects missing csrf token on mutation", async () => {
    const { token, setCookieHeader } = await ensureCsrfToken(
      new Request("http://localhost/dashboard"),
    );

    const body = new FormData();
    body.set("intent", "suspend");
    // deliberately omit _csrf

    const request = new Request("http://localhost/agents/1", {
      method: "POST",
      headers: {
        Cookie: setCookieHeader!.split(";")[0]!,
      },
      body,
    });

    await expect(requireCsrfToken(request)).rejects.toBeInstanceOf(Response);

    const okBody = new FormData();
    okBody.set("_csrf", token);
    const okRequest = new Request("http://localhost/agents/1", {
      method: "POST",
      headers: {
        Cookie: setCookieHeader!.split(";")[0]!,
      },
      body: okBody,
    });

    await expect(requireCsrfToken(okRequest)).resolves.toBeUndefined();
  });
});
