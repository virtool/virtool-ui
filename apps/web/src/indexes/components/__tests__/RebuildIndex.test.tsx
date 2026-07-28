import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeIndex } from "@tests/fake/indexes";
import {
	indexServerFnMocks,
	mockCreateIndex,
	mockFindUnbuiltChanges,
} from "@tests/server-fn/indexes";
import { renderWithProviders } from "@tests/setup";
import type { OtuHistory } from "@virtool/contracts";
import { describe, expect, it } from "vitest";
import RebuildIndex from "../RebuildIndex";

function createChange(overrides: Partial<OtuHistory> = {}): OtuHistory {
	return {
		id: "abc.1",
		createdAt: new Date("2024-01-01"),
		description: "Created Tobacco mosaic virus",
		methodName: "create",
		index: null,
		otu: { id: "abc", name: "Tobacco mosaic virus", version: 1 },
		reference: { id: 1, name: "Plant Viruses" },
		user: { id: 1, handle: "alice" },
		...overrides,
	};
}

async function openDialog() {
	await userEvent.click(screen.getByRole("button", { name: "Create" }));
}

describe("<RebuildIndex />", () => {
	it("lists the changes the build would include", async () => {
		mockFindUnbuiltChanges([
			createChange(),
			createChange({
				id: "def.2",
				description: "Edited Potato virus X",
				otu: { id: "def", name: "Potato virus X", version: 2 },
			}),
		]);

		renderWithProviders(<RebuildIndex referenceId={1} />);
		await openDialog();

		expect(
			await screen.findByText("Created Tobacco mosaic virus"),
		).toBeInTheDocument();
		expect(screen.getByText("Edited Potato virus X")).toBeInTheDocument();
		expect(screen.getByText("Potato virus X")).toBeInTheDocument();
	});

	it("counts the changes a page does not show", async () => {
		mockFindUnbuiltChanges([createChange()], {
			foundCount: 40,
			pageCount: 2,
			perPage: 25,
		});

		renderWithProviders(<RebuildIndex referenceId={1} />);
		await openDialog();

		expect(await screen.findByText("+ 15 more changes")).toBeInTheDocument();
	});

	it("starts the build and closes", async () => {
		mockFindUnbuiltChanges([createChange()]);
		mockCreateIndex(createFakeIndex());

		renderWithProviders(<RebuildIndex referenceId={1} />);
		await openDialog();

		await userEvent.click(await screen.findByRole("button", { name: "Start" }));

		expect(indexServerFnMocks.createIndexFn).toHaveBeenCalledWith({
			data: { referenceId: 1 },
		});
		await waitFor(() => {
			expect(screen.queryByText("Rebuild Index")).toBeNull();
		});
	});

	// A `ClientError` crosses the server-function boundary as a plain `Error`, so
	// the dialog reads its `message` — the unverified case gets extra guidance.
	it("explains a build refused for unverified OTUs", async () => {
		mockFindUnbuiltChanges([createChange()]);
		indexServerFnMocks.createIndexFn.mockRejectedValue(
			Object.assign(new Error("There are unverified OTUs"), { status: 400 }),
		);

		renderWithProviders(<RebuildIndex referenceId={1} />);
		await openDialog();

		await userEvent.click(await screen.findByRole("button", { name: "Start" }));

		expect(
			await screen.findByText("There are unverified OTUs."),
		).toBeInTheDocument();
		expect(
			screen.getByText("Fix the unverified OTUs before rebuilding the index."),
		).toBeInTheDocument();
	});

	it("surfaces a failed changes read", async () => {
		indexServerFnMocks.findUnbuiltChangesFn.mockRejectedValue(
			new Error("boom"),
		);

		renderWithProviders(<RebuildIndex referenceId={1} />);
		await openDialog();

		expect(
			await screen.findByText("Couldn't load unbuilt changes."),
		).toBeInTheDocument();
	});
});
