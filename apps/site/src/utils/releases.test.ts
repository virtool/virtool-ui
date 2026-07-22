import { describe, expect, it } from "vitest";
import { filterReleases, formatRelease } from "./releases";

function makeRelease(overrides = {}) {
  return {
    id: 1,
    name: "v1.0.0",
    body: "Release notes",
    prerelease: false,
    published_at: "2024-01-01T00:00:00Z",
    html_url: "https://github.com/virtool/virtool/releases/tag/v1.0.0",
    draft: false,
    assets: [
      {
        content_type: "application/gzip",
        browser_download_url: "https://example.com/file.tar.gz",
        name: "file.tar.gz",
        size: 12345,
      },
    ],
    ...overrides,
  };
}

describe("filterReleases", () => {
  it("should include releases with assets that are not drafts", () => {
    const releases = [makeRelease()];
    expect(filterReleases(releases)).toHaveLength(1);
  });

  it("should exclude releases with empty assets array", () => {
    const releases = [makeRelease({ assets: [] })];
    expect(filterReleases(releases)).toHaveLength(0);
  });

  it("should exclude releases with null assets", () => {
    const releases = [makeRelease({ assets: null })];
    expect(filterReleases(releases)).toHaveLength(0);
  });

  it("should exclude releases with undefined assets", () => {
    const releases = [makeRelease({ assets: undefined })];
    expect(filterReleases(releases)).toHaveLength(0);
  });

  it("should exclude draft releases", () => {
    const releases = [makeRelease({ draft: true })];
    expect(filterReleases(releases)).toHaveLength(0);
  });
});

describe("formatRelease", () => {
  it("should return asset fields with asset_error false for valid asset", () => {
    const result = formatRelease(makeRelease());

    expect(result).toEqual({
      id: 1,
      name: "v1.0.0",
      body: "Release notes",
      prerelease: false,
      published_at: "2024-01-01T00:00:00Z",
      html_url: "https://github.com/virtool/virtool/releases/tag/v1.0.0",
      asset_error: false,
      content_type: "application/gzip",
      download_url: "https://example.com/file.tar.gz",
      filename: "file.tar.gz",
      size: 12345,
    });
  });

  it("should return asset_error true for empty assets array", () => {
    const result = formatRelease(makeRelease({ assets: [] }));

    expect(result.asset_error).toBe(true);
    expect(result).not.toHaveProperty("content_type");
    expect(result).not.toHaveProperty("download_url");
    expect(result).not.toHaveProperty("filename");
    expect(result).not.toHaveProperty("size");
  });
});
