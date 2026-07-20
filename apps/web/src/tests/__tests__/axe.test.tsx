import { renderWithProviders } from "@tests/setup";
import type { Result } from "axe-core";
import { describe, expect, it } from "vitest";
import { expectNoViolations, formatViolations } from "../axe";

describe("expectNoViolations", () => {
	it("passes an accessible tree", async () => {
		const { container } = renderWithProviders(
			<main>
				<h1>Samples</h1>
				<button type="button">Create</button>
				<label>
					Name
					<input type="text" />
				</label>
			</main>,
		);

		await expectNoViolations(container);
	});

	it("rejects when a barrier is present", async () => {
		// An input with no associated label is a well-known axe barrier.
		const { container } = renderWithProviders(<input type="text" />);

		await expect(expectNoViolations(container)).rejects.toThrow(
			/expected no accessibility violations, found \d+/,
		);
	});

	it("does not flag colour contrast, which jsdom cannot compute", async () => {
		const { container } = renderWithProviders(
			<main>
				<h1>Low contrast heading</h1>
				<p style={{ color: "#eee", background: "#fff" }}>Barely visible</p>
			</main>,
		);

		await expectNoViolations(container);
	});

	it("formats multiple nodes, unknown impact, and multi-line summaries", () => {
		const violations = [
			{
				id: "image-alt",
				impact: null,
				help: "Images must have alternate text",
				helpUrl: "https://example.com/image-alt",
				nodes: [
					{
						html: "<img src=first>",
						failureSummary: "Fix any of the following:\n  Element has no alt",
					},
					{ html: "<img src=second>" },
				],
			},
		] as unknown as Result[];

		const output = formatViolations(violations);

		// Unknown impact falls back to "unknown".
		expect(output).toContain("image-alt (unknown):");
		// Every offending node appears.
		expect(output).toContain("<img src=first>");
		expect(output).toContain("<img src=second>");
		// The multi-line failure summary is indented under its node.
		expect(output).toContain(
			"    Fix any of the following:\n      Element has no alt",
		);
	});
});
