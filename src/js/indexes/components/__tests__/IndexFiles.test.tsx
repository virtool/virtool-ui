import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup";
import React from "react";
import { describe, expect, it } from "vitest";
import { createFakeIndexFile } from "../../../../tests/fake/indexes";
import IndexFiles from "../IndexFiles";

describe("<IndexFiles />", () => {
    it("should render", () => {
        const files = [
            createFakeIndexFile({ download_url: "/testUrl/foo", name: "foo", size: 1024 }),
            createFakeIndexFile({ download_url: "/testUrl/bar", name: "bar", size: 2048 }),
        ];

        renderWithProviders(<IndexFiles files={files} />);

        const heading = screen.getByRole("heading", {
            level: 2,
        });

        expect(heading).toHaveTextContent("Files");
        expect(heading).toHaveTextContent("2");

        const foo = screen.getByText("foo");

        expect(foo.closest("div")).toHaveTextContent("1.0KB");
        expect(foo.closest("div")).toHaveTextContent("foo");
        expect(foo.closest("a")).toHaveAttribute("href", "/api/testUrl/foo");

        const bar = screen.getByText("bar");

        expect(bar.closest("div")).toHaveTextContent("2.0KB");
        expect(bar.closest("div")).toHaveTextContent("bar");
        expect(bar.closest("a")).toHaveAttribute("href", "/api/testUrl/bar");
    });
});
