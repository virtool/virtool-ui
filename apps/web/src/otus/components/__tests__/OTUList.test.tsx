import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount } from "@tests/fake/account";
import { mockApiFindIndexes } from "@tests/fake/indexes";
import { createFakeOTUMinimal, mockApiFindOtus } from "@tests/fake/otus";
import {
	createFakeReference,
	mockApiGetReferenceDetail,
} from "@tests/fake/references";
import { renderRoute } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("<OTUsList />", () => {
	let reference;
	let OTUs;
	let path;

	beforeEach(() => {
		reference = createFakeReference();
		OTUs = [createFakeOTUMinimal(), createFakeOTUMinimal()];
		mockApiGetReferenceDetail(reference);
		mockApiFindIndexes(reference.id, 1, {
			documents: [],
			total_otu_count: 0,
			change_count: 0,
		});
		path = `/refs/${reference.id}/otus`;
	});

	afterEach(() => nock.cleanAll());

	describe("<OTUList />", () => {
		it("should render correctly", async () => {
			const scope = mockApiFindOtus(OTUs, reference.id);
			await renderRoute(path);

			expect(await screen.findByText(OTUs[0].name)).toBeInTheDocument();
			expect(screen.getByText(OTUs[0].abbreviation)).toBeInTheDocument();
			expect(screen.getByText(OTUs[1].name)).toBeInTheDocument();
			expect(screen.getByText(OTUs[1].abbreviation)).toBeInTheDocument();
			expect(screen.getByRole("textbox")).toHaveAttribute(
				"placeholder",
				"Name or abbreviation",
			);

			scope.done();
		});

		it("should render when no items are found", async () => {
			const scope = mockApiFindOtus([], reference.id);
			await renderRoute(path);

			expect(await screen.findByText("No OTUs found.")).toBeInTheDocument();
			expect(screen.queryByText(OTUs[0].name)).toBeNull();
			expect(screen.queryByText(OTUs[0].abbreviation)).toBeNull();

			scope.done();
		});
	});

	describe("<OTUToolbar />", () => {
		it("should render properly", async () => {
			const scope = mockApiFindOtus(OTUs, reference.id);
			await renderRoute(path);

			expect(await screen.findByRole("textbox")).toBeInTheDocument();

			scope.done();
		});

		it("should not render creation button when [canCreate=true]", async () => {
			const scope = mockApiFindOtus(OTUs, reference.id);
			const account = createFakeAccount({
				administrator_role: "full",
			});
			await renderRoute(path, { account });

			expect(await screen.findByText("Create")).toBeInTheDocument();

			scope.done();
		});

		it("should not render creation button when [canCreate=false]", async () => {
			const scope = mockApiFindOtus(OTUs, reference.id);
			const account = createFakeAccount({
				administrator_role: null,
			});
			await renderRoute(path, { account });

			expect(await screen.findByRole("textbox")).toBeInTheDocument();
			expect(screen.queryByText("Create")).toBeNull();

			scope.done();
		});

		it("should handle toolbar updates correctly", async () => {
			const _scope = mockApiFindOtus(OTUs, reference.id).persist();
			const { router } = await renderRoute(path);

			expect(await screen.findByRole("textbox")).toBeInTheDocument();
			const inputElement = screen.getByPlaceholderText("Name or abbreviation");
			expect(inputElement).toHaveValue("");

			await userEvent.type(inputElement, "Foobar");

			expect(inputElement).toHaveValue("Foobar");

			await waitFor(() =>
				expect(router.state.location.search).toEqual(
					expect.objectContaining({ find: "Foobar" }),
				),
			);

			nock.cleanAll();
		});
	});

	describe("<OTUItem />", () => {
		it("should render when [verified=true]", async () => {
			const scope = mockApiFindOtus(OTUs, reference.id);
			await renderRoute(path);

			expect(await screen.findByText(OTUs[0].name)).toBeInTheDocument();
			expect(screen.queryByText("Unverified")).toBeNull();

			scope.done();
		});

		it("should render when [verified=false]", async () => {
			const scope = mockApiFindOtus(
				[createFakeOTUMinimal({ verified: false })],
				reference.id,
			);
			await renderRoute(path);

			expect(await screen.findByText("Unverified")).toBeInTheDocument();
			scope.done();
		});
	});
});
