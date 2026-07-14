import SampleRights from "@samples/components/Detail/SampleRights";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
	mockApiGetSampleDetail,
	mockApiUpdateSampleRights,
} from "@tests/api/samples";
import { createFakeAccount } from "@tests/fake/account";
import { createFakeGroup } from "@tests/fake/groups";
import { createFakeSample } from "@tests/fake/samples";
import { mockListGroups } from "@tests/server-fn/groups";
import { mockGetAccount } from "@tests/server-fn/users";
import { renderWithProviders } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("<SampleRights />", () => {
	let sample: ReturnType<typeof createFakeSample>;
	let group: ReturnType<typeof createFakeGroup>;

	beforeEach(() => {
		sample = createFakeSample({
			all_read: false,
			all_write: false,
			group_read: false,
			group_write: false,
		});
		group = createFakeGroup();
		mockApiGetSampleDetail(sample);
		mockListGroups([group]);
	});

	afterEach(() => nock.cleanAll());

	it("should render", async () => {
		mockGetAccount(createFakeAccount({ administrator_role: "full" }));
		renderWithProviders(<SampleRights sampleId={sample.id} />);

		expect(await screen.findByText("Sample Rights")).toBeInTheDocument();
		expect(screen.getByText("Group")).toBeInTheDocument();
		expect(screen.getByText("Group Rights")).toBeInTheDocument();
		expect(screen.getByText("All Users' Rights")).toBeInTheDocument();
	});

	it("should return Not allowed panel when [canModifyRights=false]", async () => {
		mockGetAccount(createFakeAccount({ administrator_role: null }));
		renderWithProviders(<SampleRights sampleId={sample.id} />);

		expect(await screen.findByText("Not allowed")).toBeInTheDocument();
	});

	it("should handle group change when input is changed", async () => {
		mockGetAccount(createFakeAccount({ administrator_role: "full" }));
		const scope = mockApiUpdateSampleRights(sample, { group: group.id });
		renderWithProviders(<SampleRights sampleId={sample.id} />);

		expect(await screen.findByText("Sample Rights")).toBeInTheDocument();
		await userEvent.click(screen.getByLabelText("Group"));
		await userEvent.click(screen.getByRole("option", { name: group.name }));

		await scope.done();
	});

	it("should handle group rights change when input is changed", async () => {
		mockGetAccount(createFakeAccount({ administrator_role: "full" }));
		const scope = mockApiUpdateSampleRights(sample, {
			group_read: true,
			group_write: true,
		});
		renderWithProviders(<SampleRights sampleId={sample.id} />);

		expect(await screen.findByText("Sample Rights")).toBeInTheDocument();
		await userEvent.click(screen.getByLabelText("Group Rights"));
		await userEvent.click(screen.getByRole("option", { name: "Read & write" }));

		await scope.done();
	});

	it("should handle all users' rights change when input is changed", async () => {
		mockGetAccount(createFakeAccount({ administrator_role: "full" }));
		const scope = mockApiUpdateSampleRights(sample, {
			all_read: true,
			all_write: true,
		});
		renderWithProviders(<SampleRights sampleId={sample.id} />);

		expect(await screen.findByText("Sample Rights")).toBeInTheDocument();
		await userEvent.click(screen.getByLabelText("All Users' Rights"));
		await userEvent.click(screen.getByRole("option", { name: "Read & write" }));

		await scope.done();
	});
});
