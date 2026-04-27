import { formatPath } from "@app/hooks";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiFindIndexes } from "@tests/fake/indexes";
import {
	createFakeOTUMinimal,
	mockApiCreateOTU,
	mockApiFindOtus,
} from "@tests/fake/otus";
import {
	createFakeReference,
	mockApiGetReferenceDetail,
} from "@tests/fake/references";
import { renderRoute } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("<OTUForm />", () => {
	let path;
	let reference;

	beforeEach(() => {
		reference = createFakeReference();
		mockApiGetReferenceDetail(reference);
		mockApiFindOtus([createFakeOTUMinimal()], reference.id);
		mockApiFindIndexes(reference.id, 1, {
			documents: [],
			total_otu_count: 0,
			change_count: 0,
		});

		path = formatPath(`/refs/${reference.id}/otus`, {
			openCreateOTU: true,
		});
	});

	afterEach(() => nock.cleanAll());

	it("should render", async () => {
		await renderRoute(path);

		expect(await screen.findByText("Create OTU")).toBeInTheDocument();
		expect(screen.getByLabelText("Name")).toBeInTheDocument();
		expect(screen.getByLabelText("Abbreviation")).toBeInTheDocument();
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("should render error once submitted with no name", async () => {
		await renderRoute(path);

		await screen.findByText("Create OTU");
		await userEvent.click(screen.getByRole("button"));
		expect(await screen.findByText("Name required")).toBeInTheDocument();
	});

	it("should create OTU without abbreviation", async () => {
		const scope = mockApiCreateOTU(reference.id, "TestName", "");
		await renderRoute(path);

		await userEvent.type(await screen.findByLabelText("Name"), "TestName");
		await userEvent.click(screen.getByRole("button"));

		scope.done();
	});

	it("should create OTU with abbreviation", async () => {
		const scope = mockApiCreateOTU(
			reference.id,
			"TestName",
			"TestAbbreviation",
		);
		await renderRoute(path);

		await userEvent.type(await screen.findByLabelText("Name"), "TestName");
		await userEvent.type(
			screen.getByLabelText("Abbreviation"),
			"TestAbbreviation",
		);
		await userEvent.click(screen.getByRole("button"));

		scope.done();
	});
});
