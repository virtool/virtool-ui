import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
	createFakeReference,
	mockApiArchiveReference,
	mockApiUnarchiveReference,
} from "@tests/fake/references";
import { renderWithRouter } from "@tests/setup";
import nock from "nock";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import ArchiveReference from "../ArchiveReference";

function ArchiveReferenceHarness({
	detail,
}: {
	detail: ReturnType<typeof createFakeReference>;
}) {
	const [open, setOpen] = useState(true);
	return <ArchiveReference detail={detail} open={open} setOpen={setOpen} />;
}

describe("<ArchiveReference />", () => {
	afterEach(() => nock.cleanAll());

	it("should archive an active reference and close the dialog on success", async () => {
		const detail = createFakeReference({ archived: false });
		const archived = { ...detail, archived: true };
		const scope = mockApiArchiveReference(detail.id, archived);

		await renderWithRouter(<ArchiveReferenceHarness detail={detail} />);

		expect(screen.getByText("Archive reference")).toBeInTheDocument();

		await userEvent.click(screen.getByRole("button", { name: "Archive" }));

		await waitFor(() => {
			expect(screen.queryByText("Archive reference")).toBeNull();
		});

		scope.done();
	});

	it("should unarchive an archived reference", async () => {
		const detail = createFakeReference({ archived: true });
		const unarchived = { ...detail, archived: false };
		const scope = mockApiUnarchiveReference(detail.id, unarchived);

		await renderWithRouter(<ArchiveReferenceHarness detail={detail} />);

		expect(screen.getByText("Unarchive reference")).toBeInTheDocument();

		await userEvent.click(screen.getByRole("button", { name: "Unarchive" }));

		await waitFor(() => {
			expect(screen.queryByText("Unarchive reference")).toBeNull();
		});

		scope.done();
	});

	it("should surface the official-reference message on a 409 response", async () => {
		const detail = createFakeReference({
			archived: false,
			name: "Plant Viruses",
		});
		const scope = mockApiArchiveReference(detail.id, detail, 409);

		await renderWithRouter(<ArchiveReferenceHarness detail={detail} />);

		await userEvent.click(screen.getByRole("button", { name: "Archive" }));

		expect(
			await screen.findByText("The official reference cannot be archived."),
		).toBeInTheDocument();
		expect(screen.getByText("Archive reference")).toBeInTheDocument();

		scope.done();
	});

	it("should surface a generic message on other errors", async () => {
		const detail = createFakeReference({ archived: false });
		const scope = mockApiArchiveReference(detail.id, detail, 500);

		await renderWithRouter(<ArchiveReferenceHarness detail={detail} />);

		await userEvent.click(screen.getByRole("button", { name: "Archive" }));

		expect(
			await screen.findByText(/Failed to archive reference/i),
		).toBeInTheDocument();

		scope.done();
	});
});
