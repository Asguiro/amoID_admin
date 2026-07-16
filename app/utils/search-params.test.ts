import { describe, expect, it } from "vitest";

import {
  parseDashboardSearchParams,
  parseListSearchParams,
} from "~/utils/search-params";

describe("parseDashboardSearchParams", () => {
  it("defaults to 7d when period is missing", () => {
    expect(parseDashboardSearchParams(new URLSearchParams())).toEqual({
      period: "7d",
      empty: false,
      forceError: false,
    });
  });

  it("accepts valid periods", () => {
    expect(
      parseDashboardSearchParams(new URLSearchParams("period=30d")),
    ).toEqual({ period: "30d", empty: false, forceError: false });
  });

  it("falls back to 7d for invalid values", () => {
    expect(
      parseDashboardSearchParams(new URLSearchParams("period=year")),
    ).toEqual({ period: "7d", empty: false, forceError: false });
  });

  it("parses empty and error QA flags", () => {
    expect(
      parseDashboardSearchParams(new URLSearchParams("empty=1&error=1")),
    ).toEqual({ period: "7d", empty: true, forceError: true });
  });
});

describe("parseListSearchParams", () => {
  it("parses pagination and query", () => {
    expect(
      parseListSearchParams(new URLSearchParams("q=bamako&page=2&pageSize=20")),
    ).toEqual({
      q: "bamako",
      page: 2,
      pageSize: 20,
      status: undefined,
      sort: undefined,
    });
  });
});
