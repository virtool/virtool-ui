import AnalysesList from "@analyses/components/AnalysisList";
import { screen } from "@testing-library/react";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import {
	createFakeAnalysisMinimal,
	mockApiGetAnalyses,
} from "@tests/fake/analyses";
import { createFakeHmmSearchResults, mockApiGetHmms } from "@tests/fake/hmm";
import { createFakeSample, mockApiGetSampleDetail } from "@tests/fake/samples";
import { MemoryRouter, renderWithProviders } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("<AnalysesToolbar />", () => {
	let sample;

	beforeEach(() => {
		sample = createFakeSample();
		mockApiGetAnalyses([
			createFakeAnalysisMinimal({ sample: { id: sample.id } }),
		]);
		mockApiGetHmms(createFakeHmmSearchResults());
	});

	afterEach(() => nock.cleanAll());

	function renderList() {
		renderWithProviders(
			<MemoryRouter>
				<AnalysesList
					openCreateAnalysis={false}
					page={1}
					sampleId={sample.id}
					setSearch={() => {}}
				/>
			</MemoryRouter>,
		);
	}

	it("should show analysis creation when user is full admin", async () => {
		mockApiGetAccount(createFakeAccount({ administrator_role: "full" }));
		mockApiGetSampleDetail(sample);
		renderList();

		expect(await screen.findByText("Create")).toBeInTheDocument();
	});

	it("should show analysis creation when user is the owner of the sample", async () => {
		const account = createFakeAccount({ administrator_role: null });
		sample.user.id = account.id;
		mockApiGetAccount(account);
		mockApiGetSampleDetail(sample);
		renderList();

		expect(await screen.findByText("Create")).toBeInTheDocument();
	});

	it("should show analysis creation when user is in the correct group and write is enabled", async () => {
		const account = createFakeAccount({ administrator_role: null });
		sample.group = account.groups[0];
		sample.group_write = true;
		mockApiGetAccount(account);
		mockApiGetSampleDetail(sample);
		renderList();

		expect(await screen.findByText("Create")).toBeInTheDocument();
	});

	it("should show analysis creation when all users editing a sample is permitted", async () => {
		const account = createFakeAccount({ administrator_role: null });
		sample.all_write = true;
		mockApiGetAccount(account);
		mockApiGetSampleDetail(sample);
		renderList();

		expect(await screen.findByText("Create")).toBeInTheDocument();
	});

	it("should not render analysis creation option when user has no permissions", async () => {
		sample.all_write = false;
		sample.group_write = false;
		mockApiGetAccount(createFakeAccount({ administrator_role: null }));
		mockApiGetSampleDetail(sample);
		renderList();

		expect(await screen.findByText("Pathoscope")).toBeInTheDocument();
		expect(screen.queryByText("Create")).not.toBeInTheDocument();
	});
});
