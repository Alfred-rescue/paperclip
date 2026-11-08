import { describe, expect, it } from "vitest";
import { summarizeProbeDetail } from "./test.js";

const pathAliasWarning =
  'WARNING: proceeding, even though we could not create PATH aliases: Refusing to create helper binaries under temporary dir "C:\\Users\\fantom\\AppData\\Local\\Temp\\"';

describe("summarizeProbeDetail", () => {
  it("prefers a parsed provider error over startup warnings", () => {
    expect(
      summarizeProbeDetail("", pathAliasWarning, "workspace routing discovery unauthorized (401)"),
    ).toBe("workspace routing discovery unauthorized (401)");
  });

  it("skips the Windows PATH-alias warning when stderr contains an actionable error", () => {
    expect(
      summarizeProbeDetail(
        "",
        `${pathAliasWarning}\nworkspace routing discovery unauthorized (401)`,
        null,
      ),
    ).toBe("workspace routing discovery unauthorized (401)");
  });

  it("uses stdout when the PATH-alias warning is the only stderr line", () => {
    expect(summarizeProbeDetail("model unavailable", pathAliasWarning, null)).toBe(
      "model unavailable",
    );
  });

  it("keeps the warning as a last-resort diagnostic", () => {
    expect(summarizeProbeDetail("", pathAliasWarning, null)).toBe(pathAliasWarning);
  });
});
