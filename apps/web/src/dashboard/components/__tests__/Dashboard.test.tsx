import { screen, waitFor } from "@testing-library/react";
import { createFakeAccount } from "@tests/fake/account";
import { createFakeAnalysisMinimal } from "@tests/fake/analyses";
import { createFakeServerJobMinimal } from "@tests/fake/jobs";
import { createFakeSampleMinimal } from "@tests/fake/samples";
import { mockFindAnalyses } from "@tests/server-fn/analyses";
import { mockFindJobs } from "@tests/server-fn/jobs";
import { mockFindSamples } from "@tests/server-fn/samples";
import { mockGetAccount } from "@tests/server-fn/users";
import { renderWithRouter } from "@tests/setup";
import { beforeEach, describe, expect, it } from "vitest";
import Dashboard from "../Dashboard";

describe("<Dashboard />", () => {
	const account = createFakeAccount({ handle: "bob" });

	beforeEach(() => {
		mockGetAccount(account);
		mockFindSamples([]);
		mockFindAnalyses([]);
		mockFindJobs([]);
	});

	it("greets the signed-in user and renders every card", async () => {
		await renderWithRouter(<Dashboard />);

		expect(
			await screen.findByRole("heading", { name: "Welcome back, bob" }),
		).toBeInTheDocument();

		expect(
			await screen.findByRole("heading", { name: "My samples" }),
		).toBeInTheDocument();
		expect(
			await screen.findByRole("heading", { name: "My analyses" }),
		).toBeInTheDocument();
		expect(
			await screen.findByRole("heading", { name: "Active jobs" }),
		).toBeInTheDocument();
	});

	it("scopes samples and analyses to the signed-in user", async () => {
		const findSamples = mockFindSamples([]);
		const findAnalyses = mockFindAnalyses([]);

		await renderWithRouter(<Dashboard />);

		await waitFor(() => {
			expect(findSamples).toHaveBeenCalledWith({
				data: expect.objectContaining({ users: [account.id] }),
			});
		});

		await waitFor(() => {
			expect(findAnalyses).toHaveBeenCalledWith({
				data: { userId: account.id, page: 1, perPage: 10 },
			});
		});
	});

	it("asks for the pending and running jobs, account-wide", async () => {
		const findJobs = mockFindJobs([]);

		await renderWithRouter(<Dashboard />);

		await waitFor(() => {
			expect(findJobs).toHaveBeenCalledWith({
				data: { page: 1, perPage: 10, states: ["pending", "running"] },
			});
		});
	});

	it("lists the recent samples, analyses, and active jobs", async () => {
		mockFindSamples([createFakeSampleMinimal({ name: "Foo sample" })]);
		mockFindAnalyses([
			createFakeAnalysisMinimal({ id: 12, workflow: "pathoscope" }),
		]);
		mockFindJobs([createFakeServerJobMinimal({ id: 7, workflow: "nuvs" })]);

		await renderWithRouter(<Dashboard />);

		expect(
			await screen.findByRole("link", { name: "Foo sample" }),
		).toBeInTheDocument();
		expect(
			await screen.findByRole("link", { name: "Pathoscope" }),
		).toBeInTheDocument();
		expect(await screen.findByRole("link", { name: "Nuvs" })).toHaveAttribute(
			"href",
			"/jobs/7",
		);
	});

	it("sends View all to the unfiltered list views", async () => {
		await renderWithRouter(<Dashboard />);

		const [samples, jobs] = await screen.findAllByRole("link", {
			name: "View all",
		});

		expect(samples).toHaveAttribute("href", "/samples");
		expect(jobs).toHaveAttribute("href", "/jobs");
	});

	it("accounts for the rows a card has no room for", async () => {
		mockFindSamples([createFakeSampleMinimal()], { foundCount: 14 });
		mockFindAnalyses([createFakeAnalysisMinimal()], 3);
		mockFindJobs([createFakeServerJobMinimal()], 2);

		await renderWithRouter(<Dashboard />);

		expect(
			await screen.findByRole("link", {
				name: "View 13 more samples of yours",
			}),
		).toHaveAttribute("href", `/samples?users=%5B${account.id}%5D`);

		// No global analyses list to send the reader to, so this one is not a link.
		expect(
			await screen.findByText("2 more analyses are not shown"),
		).toBeInTheDocument();

		expect(
			await screen.findByRole("link", { name: "View 1 more active job" }),
		).toBeInTheDocument();
	});

	it("omits the overflow row when a card is showing everything", async () => {
		mockFindSamples([createFakeSampleMinimal()]);
		mockFindAnalyses([createFakeAnalysisMinimal()]);
		mockFindJobs([createFakeServerJobMinimal()]);

		await renderWithRouter(<Dashboard />);

		expect(
			await screen.findByRole("heading", { name: "My samples" }),
		).toBeInTheDocument();
		expect(screen.queryByText(/more/)).toBeNull();
	});

	it("shows an empty state per card when there is nothing to list", async () => {
		await renderWithRouter(<Dashboard />);

		expect(await screen.findByText("No samples yet")).toBeInTheDocument();
		expect(await screen.findByText("No analyses yet")).toBeInTheDocument();
		expect(await screen.findByText("Nothing running")).toBeInTheDocument();
	});

	it("contains a failed card without taking down the rest of the dashboard", async () => {
		mockFindAnalyses([]).mockRejectedValue(new Error("boom"));
		mockFindSamples([createFakeSampleMinimal({ name: "Foo sample" })]);

		await renderWithRouter(<Dashboard />);

		expect(
			await screen.findByText("Couldn't load analyses."),
		).toBeInTheDocument();
		expect(
			await screen.findByRole("link", { name: "Foo sample" }),
		).toBeInTheDocument();
	});
});
