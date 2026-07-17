import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SkipLink from "../SkipLink";

describe("<SkipLink />", () => {
	it("links to the main content region", () => {
		render(<SkipLink />);

		const link = screen.getByRole("link", { name: "Skip to main content" });

		expect(link).toHaveAttribute("href", "#main-content");
	});
});
