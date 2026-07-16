import { describe, expect, it } from "vitest";

import {
  buildListHref,
  countActiveListFilters,
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
      coverageStatus: undefined,
      dossierStatus: undefined,
      beneficiaryType: undefined,
      channel: undefined,
      decision: undefined,
      reason: undefined,
    });
  });

  it("parses domain filters", () => {
    expect(
      parseListSearchParams(
        new URLSearchParams(
          "coverageStatus=ACTIVE&dossierStatus=INCOMPLETE&channel=QR",
        ),
      ),
    ).toMatchObject({
      coverageStatus: "ACTIVE",
      dossierStatus: "INCOMPLETE",
      channel: "QR",
    });
  });

  it("keeps valid filters when pagination is invalid", () => {
    expect(
      parseListSearchParams(new URLSearchParams("q=agent&page=invalid&status=ACTIVE")),
    ).toMatchObject({
      q: "agent",
      page: 1,
      pageSize: 10,
      status: "ACTIVE",
    });
  });

  it("builds list links while preserving filters and changing pagination", () => {
    const query = parseListSearchParams(
      new URLSearchParams("q=bamako&status=ACTIVE&page=2&pageSize=10"),
    );
    expect(buildListHref("/agents", query, { page: 1, pageSize: 20 })).toBe(
      "/agents?q=bamako&page=1&pageSize=20&status=ACTIVE",
    );
    expect(countActiveListFilters(query)).toBe(2);
  });
});