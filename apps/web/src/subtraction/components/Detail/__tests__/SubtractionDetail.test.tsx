import type { SubtractionMinimal } from "@subtraction/types";
import { screen } from "@testing-library/react";
import { createFakeAccount } from "@tests/fake/account";
import { createFakePermissions } from "@tests/fake/permissions";
import {
	createFakeSubtraction,
	mockApiGetSubtractionDetail,
} from "@tests/fake/subtractions";
import { renderRoute } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

function formatSubtractionPath(subtraction: SubtractionMinimal) {
	return `/subtractions/${subtraction.id}`;
}

describe("<SubtractionDetail />", () => {
	let subtraction: ReturnType<typeof createFakeSubtraction>;
	let path: string;

	beforeEach(() => {
		subtraction = createFakeSubtraction();
		path = formatSubtractionPath(subtraction);
	});

	afterEach(() => nock.cleanAll());

	it("should render", async () => {
		const scope = mockApiGetSubtractionDetail(subtraction);
		await renderRoute(path);

		expect(await screen.findByText(subtraction.name)).toBeInTheDocument();
		expect(await screen.findByText(subtraction.nickname)).toBeInTheDocument();
		expect(
			await screen.findByText(subtraction.linked_samples.length),
		).toBeInTheDocument();

		const fastaName = `${subtraction.name
			.toLowerCase()
			.replace(/\s+/g, "_")}.fa.gz`;
		const download = await screen.findByRole("link", { name: fastaName });
		expect(download).toHaveAttribute(
			"href",
			`/api${subtraction.files[0]?.download_url}`,
		);

		scope.done();
	});

	it("should render loading when [detail=null]", async () => {
		await renderRoute(path);

		expect(screen.getByLabelText("loading")).toBeInTheDocument();
		expect(screen.queryByText(subtraction.name)).not.toBeInTheDocument();
	});

	it("should render pending message when subtraction is not ready", async () => {
		const unreadySubtraction = createFakeSubtraction({ ready: false });
		const scope = mockApiGetSubtractionDetail(unreadySubtraction);
		await renderRoute(formatSubtractionPath(unreadySubtraction));

		expect(
			await screen.findByText("Subtraction is still being imported"),
		).toBeInTheDocument();

		scope.done();
	});

	it("should not render icons when [canModify=true]", async () => {
		const permissions = createFakePermissions({ modify_subtraction: true });
		const account = createFakeAccount({ permissions });
		const scope = mockApiGetSubtractionDetail(subtraction);
		await renderRoute(path, { account });

		expect(await screen.findByText(subtraction.name)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "modify" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "delete" })).toBeInTheDocument();

		scope.done();
	});

	it("should not render icons when [canModify=false]", async () => {
		const permissions = createFakePermissions({
			modify_subtraction: false,
		});
		const account = createFakeAccount({ permissions });
		const scope = mockApiGetSubtractionDetail(subtraction);
		await renderRoute(path, { account });

		expect(await screen.findByText(subtraction.name)).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "modify" })).toBeNull();
		expect(screen.queryByRole("button", { name: "delete" })).toBeNull();

		scope.done();
	});
});
