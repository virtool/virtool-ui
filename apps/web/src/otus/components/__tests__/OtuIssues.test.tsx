import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import OtuIssues from "../OtuIssues";

describe("<OTUIssues />", () => {
	it("renders correctly without issues", () => {
		const props: ComponentProps<typeof OtuIssues> = {
			issues: {
				empty_otu: false,
				isolate_inconsistency: false,
				empty_isolate: false,
				empty_sequence: false,
			},
			isolates: [],
		};
		renderWithProviders(<OtuIssues {...props} />);

		expect(
			screen.getByText(
				"There are some issues that must be resolved before this OTU can be included in the next index build",
			),
		).toBeInTheDocument();
	});

	it("renders correctly with issues", () => {
		const props: ComponentProps<typeof OtuIssues> = {
			issues: {
				empty_otu: true,
				isolate_inconsistency: true,
				empty_isolate: ["test-isolate"],
				empty_sequence: [
					{
						_id: "test-sequence",
						isolate_id: "test-isolate",
					},
				],
			},
			isolates: [
				{
					default: false,
					id: "test-isolate",
					sequences: [],
					source_type: "isolate",
					source_name: "test",
				},
			],
		};
		renderWithProviders(<OtuIssues {...props} />);

		expect(
			screen.getByText(
				"There are some issues that must be resolved before this OTU can be included in the next index build",
			),
		).toBeInTheDocument();
		expect(
			screen.getByText("There are no isolates associated with this OTU"),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				"Some isolates have different numbers of sequences than other isolates",
			),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				"There are no sequences associated with the following isolates:",
			),
		).toBeInTheDocument();

		expect(screen.getByText("test-sequence")).toBeInTheDocument();
		expect(screen.getByText("in isolate")).toBeInTheDocument();

		const isolateName = screen.getAllByText("Isolate test");
		expect(isolateName.length).toBe(2);
	});
});
