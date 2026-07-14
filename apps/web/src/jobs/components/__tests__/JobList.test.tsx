import { screen, waitFor } from "@testing-library/react";
import { createFakeServerJobMinimal } from "@tests/fake/jobs";
import { mockFindJobs } from "@tests/server-fn/jobs";
import { renderWithRouter } from "@tests/setup";
import { describe, expect, it } from "vitest";
import JobsList from "../JobList";

describe("<JobsList />", () => {
	it("should render", async () => {
		const findJobs = mockFindJobs([
			createFakeServerJobMinimal({
				progress: 100,
				state: "succeeded",
				workflow: "create_sample",
			}),
		]);

		await renderWithRouter(<JobsList />);

		await waitFor(() =>
			expect(screen.queryByLabelText("loading")).not.toBeInTheDocument(),
		);
		expect(screen.getByText("Create Sample")).toBeInTheDocument();

		expect(findJobs).toHaveBeenCalled();
	});

	it("should show spinner while loading", async () => {
		await renderWithRouter(<JobsList />);
		expect(screen.getByLabelText("loading")).toBeInTheDocument();
	});

	it("should show message when there are no unarchived jobs", async () => {
		const findJobs = mockFindJobs([]);
		await renderWithRouter(<JobsList />);

		await waitFor(() =>
			expect(screen.queryByLabelText("loading")).not.toBeInTheDocument(),
		);
		expect(screen.getByText("No jobs found")).toBeInTheDocument();

		expect(findJobs).toHaveBeenCalled();
	});

	it("should show message when no jobs match filters", async () => {
		const findJobs = mockFindJobs(
			[createFakeServerJobMinimal({ progress: 100, state: "succeeded" })],
			0,
		);

		await renderWithRouter(<JobsList />);

		await waitFor(() =>
			expect(screen.queryByLabelText("loading")).not.toBeInTheDocument(),
		);
		expect(
			await screen.findByText("No jobs match your filters."),
		).toBeInTheDocument();

		expect(findJobs).toHaveBeenCalled();
	});
});
