import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiCreateOtu } from "@tests/api/otus";
import { mockApiGetReferenceDetail } from "@tests/api/references";
import { createFakeReference } from "@tests/fake/references";
import { renderWithProviders } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import OtuCreate from "../OtuCreate";

describe("<OtuCreate />", () => {
	let reference: ReturnType<typeof createFakeReference>;

	beforeEach(() => {
		reference = createFakeReference();
		mockApiGetReferenceDetail(reference);
	});

	afterEach(() => nock.cleanAll());

	it("should render", () => {
		renderWithProviders(
			<OtuCreate open refId={reference.id} setOpen={vi.fn()} />,
		);

		expect(screen.getByText("Create OTU")).toBeInTheDocument();
		expect(screen.getByLabelText("Name")).toBeInTheDocument();
		expect(screen.getByLabelText("Abbreviation")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
	});

	it("should render error once submitted with no name", async () => {
		renderWithProviders(
			<OtuCreate open refId={reference.id} setOpen={vi.fn()} />,
		);

		await userEvent.click(screen.getByRole("button", { name: "Save" }));
		expect(await screen.findByText("Name required")).toBeInTheDocument();
	});

	it("should create OTU without abbreviation", async () => {
		const scope = mockApiCreateOtu(reference.id, "TestName", "");
		renderWithProviders(
			<OtuCreate open refId={reference.id} setOpen={vi.fn()} />,
		);

		await userEvent.type(screen.getByLabelText("Name"), "TestName");
		await userEvent.click(screen.getByRole("button", { name: "Save" }));

		await scope.done();
	});

	it("should create OTU with abbreviation", async () => {
		const scope = mockApiCreateOtu(
			reference.id,
			"TestName",
			"TestAbbreviation",
		);
		renderWithProviders(
			<OtuCreate open refId={reference.id} setOpen={vi.fn()} />,
		);

		await userEvent.type(screen.getByLabelText("Name"), "TestName");
		await userEvent.type(
			screen.getByLabelText("Abbreviation"),
			"TestAbbreviation",
		);
		await userEvent.click(screen.getByRole("button", { name: "Save" }));

		await scope.done();
	});
});
