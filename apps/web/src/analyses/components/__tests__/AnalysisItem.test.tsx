import AnalysisItem from "@analyses/components/AnalysisItem";
import { screen } from "@testing-library/react";
import { createFakeAccount } from "@tests/fake/account";
import { createFakeAnalysisMinimal } from "@tests/fake/analyses";
import { mockGetAccount } from "@tests/server-fn/users";
import { MemoryRouter, renderWithProviders } from "@tests/setup";
import type { AnalysisMinimal, JobState } from "@virtool/contracts";
import { beforeEach, describe, expect, it } from "vitest";

describe("<AnalysisItem />", () => {
	beforeEach(() => {
		mockGetAccount(createFakeAccount({ administrator_role: "full" }));
	});

	function renderItem(overrides: Partial<AnalysisMinimal>) {
		renderWithProviders(
			<MemoryRouter>
				<AnalysisItem analysis={createFakeAnalysisMinimal(overrides)} />
			</MemoryRouter>,
		);
	}

	function unreadyWith(state: JobState): Partial<AnalysisMinimal> {
		const { job } = createFakeAnalysisMinimal();

		return { ready: false, job: job && { ...job, state } };
	}

	it("offers removal for a finished analysis", async () => {
		renderItem({ ready: true });

		expect(
			await screen.findByRole("button", { name: "remove" }),
		).toBeInTheDocument();
	});

	it.each<JobState>(["pending", "running"])(
		"withholds removal while the job is %s",
		async (state) => {
			renderItem(unreadyWith(state));

			// The account query has to settle before the absence means anything.
			expect(await screen.findByRole("progressbar")).toBeInTheDocument();
			expect(
				screen.queryByRole("button", { name: "remove" }),
			).not.toBeInTheDocument();
		},
	);

	// An OOM-killed or evicted pod leaves the analysis unready forever. It has to
	// stay removable, or the user is stuck looking at it.
	it.each<JobState>(["cancelled", "failed", "succeeded"])(
		"offers removal for an unready analysis whose job is %s",
		async (state) => {
			renderItem(unreadyWith(state));

			expect(
				await screen.findByRole("button", { name: "remove" }),
			).toBeInTheDocument();
			// The failure itself stays on screen alongside the remove button.
			expect(screen.getByRole("progressbar")).toBeInTheDocument();
		},
	);

	it("offers removal for an unready analysis with no job", async () => {
		renderItem({ ready: false, job: null });

		expect(
			await screen.findByRole("button", { name: "remove" }),
		).toBeInTheDocument();
	});
});
