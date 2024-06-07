import { screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../../../tests/setupTests";
import { DownloadLink } from "../DownloadLink";

describe("<DownloadLink />", () => {
    it("should render", () => {
        renderWithProviders(<DownloadLink href="/downloads/tmv.fa">Download It</DownloadLink>);
        expect(screen.getByText("Download It").closest("a")).toHaveAttribute("href", "/downloads/tmv.fa");
    });
});
