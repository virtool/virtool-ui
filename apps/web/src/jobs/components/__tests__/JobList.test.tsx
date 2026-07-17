import { screen } from "@testing-library/react";
import { createFakeServerJobMinimal } from "@tests/fake/jobs";
import { mockFindJobs } from "@tests/server-fn/jobs";
import { renderRoute } from "@tests/setup";
import { describe, expect, it } from "vitest";

describe("<JobsList />", () => {
	it("should render", async () => {
		const findJobs = mockFindJobs([
			createFakeServerJobMinimal({
				progress: 100,
				state: "succeeded",
				workflow: "create_sample",
			}),
		]);

		await renderRoute("/jobs");

		expect(await screen.findByText("Create Sample")).toBeInTheDocument();

		expect(findJobs).toHaveBeenCalled();
	});

	it("should show message when there are no unarchived jobs", async () => {
		const findJobs = mockFindJobs([]);

		await renderRoute("/jobs");

		expect(await screen.findByText("No jobs found")).toBeInTheDocument();

		expect(findJobs).toHaveBeenCalled();
	});

	it("should show message when no jobs match filters", async () => {
		const findJobs = mockFindJobs(
			[createFakeServerJobMinimal({ progress: 100, state: "succeeded" })],
			0,
		);

		await renderRoute("/jobs");

		expect(
			await screen.findByText("No jobs match your filters."),
		).toBeInTheDocument();

		expect(findJobs).toHaveBeenCalled();
	});
});
