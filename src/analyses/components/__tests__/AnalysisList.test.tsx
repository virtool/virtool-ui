import { formatPath } from "@app/hooks";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount } from "@tests/fake/account";
import {
	createFakeAnalysisMinimal,
	mockApiGetAnalyses,
} from "@tests/fake/analyses";
import { createFakeHmmSearchResults, mockApiGetHmms } from "@tests/fake/hmm";
import { createFakeSample, mockApiGetSampleDetail } from "@tests/fake/samples";
import { renderRoute } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("<AnalysesList />", () => {
	let analyses;
	let sample;
	let basePath;

	beforeEach(() => {
		sample = createFakeSample();

		analyses = [
			createFakeAnalysisMinimal({ sample: { id: sample.id } }),
			createFakeAnalysisMinimal({
				sample: { id: sample.id },
				workflow: "nuvs",
			}),
		];
		mockApiGetAnalyses(analyses);
		mockApiGetHmms(createFakeHmmSearchResults());
		basePath = `/samples/${sample.id}/analyses/`;
	});

	afterEach(() => nock.cleanAll());

	describe("<AnalysesList />", () => {
		it("should render", async () => {
			mockApiGetSampleDetail(sample);
			await renderRoute(basePath);

			expect(await screen.findByText("Pathoscope")).toBeInTheDocument();
			expect(
				screen.getByText(`${analyses[0].user.handle} created`),
			).toBeInTheDocument();
			expect(screen.getByText("Nuvs")).toBeInTheDocument();
			expect(
				screen.getByText(`${analyses[1].user.handle} created`),
			).toBeInTheDocument();
		});
	});

	describe("<AnalysesToolbar />", () => {
		it("should show analysis creation when user is full admin", async () => {
			const account = createFakeAccount({
				administrator_role: "full",
			});
			mockApiGetSampleDetail(sample);
			await renderRoute(basePath, { account });

			expect(await screen.findByText("Create")).toBeInTheDocument();
		});

		it("should show analysis creation when user is the owner of the sample", async () => {
			const account = createFakeAccount({ administrator_role: null });
			sample.user.id = account.id;
			mockApiGetSampleDetail(sample);
			await renderRoute(basePath, { account });

			expect(await screen.findByText("Create")).toBeInTheDocument();
		});

		it("should show analysis creation when user is in the correct group and write is enabled", async () => {
			const account = createFakeAccount({ administrator_role: null });
			sample.group = account.groups[0];
			sample.group_write = true;
			mockApiGetSampleDetail(sample);
			await renderRoute(basePath, { account });

			expect(await screen.findByText("Create")).toBeInTheDocument();
		});

		it("should show analysis creation when all users editing a sample is permitted", async () => {
			const account = createFakeAccount({ administrator_role: null });

			sample.all_write = true;
			mockApiGetSampleDetail(sample);

			await renderRoute(basePath, { account });

			expect(await screen.findByText("Create")).toBeInTheDocument();
		});

		it("should not render analysis creation option when user has no permissions", async () => {
			const account = createFakeAccount({ administrator_role: null });
			mockApiGetSampleDetail(sample);
			await renderRoute(`/samples/${sample.id}/analyses/`, { account });

			expect(await screen.findByText("Pathoscope")).toBeInTheDocument();
			expect(screen.queryByText("Create")).not.toBeInTheDocument();
		});

		it("should change state once create analysis is clicked", async () => {
			const account = createFakeAccount({
				administrator_role: "full",
			});
			mockApiGetSampleDetail(sample);

			const { history } = await renderRoute(`/samples/${sample.id}/analyses`, {
				account,
			});

			expect(await screen.findByText("Create")).toBeInTheDocument();

			await userEvent.click(screen.getByText("Create"));

			await waitFor(() =>
				expect(history[0]).toEqual(
					formatPath(`/samples/${sample.id}/analyses`, {
						openCreateAnalysis: true,
					}),
				),
			);
		});
	});
});
