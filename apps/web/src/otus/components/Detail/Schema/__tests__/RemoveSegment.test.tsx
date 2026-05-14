import { formatPath } from "@app/hooks";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount } from "@tests/fake/account";
import { createFakeOtu, mockApiEditOTU, mockApiGetOtu } from "@tests/fake/otus";
import {
	createFakeReference,
	mockApiGetReferenceDetail,
} from "@tests/fake/references";
import { renderRoute } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("<RemoveSegment />", () => {
	let path;
	let reference;
	let searchParams;
	let otu;
	let otuScope;
	let account;

	beforeEach(() => {
		reference = createFakeReference({ name: "Foo" });
		mockApiGetReferenceDetail(reference);
		otu = createFakeOtu();
		otuScope = mockApiGetOtu(otu);
		account = createFakeAccount({ administrator_role: "full" });

		path = `/refs/${reference.id}/otus/${otu.id}/schema`;
		searchParams = { removeSegmentName: otu.schema[0].name };
	});

	afterEach(() => nock.cleanAll());

	it("should render when [show=true]", async () => {
		await renderRoute(formatPath(path, searchParams), { account });

		expect(await screen.findByText("Remove Segment")).toBeInTheDocument();
		expect(
			screen.getByText(/Are you sure you want to remove/),
		).toBeInTheDocument();
		expect(screen.getAllByText(`${otu.schema[0].name}`)).toHaveLength(2);
		expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
	});

	it("should render when [show=false]", async () => {
		await renderRoute(path, { account });

		await waitFor(() => otuScope.done());

		expect(
			await screen.findByText(`${otu.schema[0].name}`),
		).toBeInTheDocument();

		expect(screen.queryByText("Remove Segment")).toBeNull();
		expect(screen.queryByText(/Are you sure you want to remove/)).toBeNull();
		expect(screen.queryByRole("button", { name: "Confirm" })).toBeNull();
	});

	it("should call onSubmit() when onConfirm() called on <RemoveDialog />", async () => {
		const scope = mockApiEditOTU(otu, {
			abbreviation: otu.abbreviation,
			name: otu.name,
			otuId: otu.id,
			schema: [otu.schema[1]],
		});
		await renderRoute(formatPath(path, searchParams), { account });

		await userEvent.click(
			await screen.findByRole("button", { name: "Confirm" }),
		);

		scope.done();
	});

	it("should call onHide() when onHide() called on <RemoveDialog />", async () => {
		await renderRoute(formatPath(path, searchParams), { account });

		expect(await screen.findByText("Remove Segment")).toBeInTheDocument();

		await userEvent.keyboard("{Escape}");

		await waitFor(() =>
			expect(screen.queryByText("Remove Segment")).toBeNull(),
		);
	});
});
