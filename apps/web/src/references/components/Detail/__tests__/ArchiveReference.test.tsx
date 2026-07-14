import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
	mockApiArchiveReference,
	mockApiUnarchiveReference,
} from "@tests/api/references";
import { createFakeReference } from "@tests/fake/references";
import { renderWithRouter } from "@tests/setup";
import nock from "nock";
import { afterEach, describe, expect, it } from "vitest";
import ArchiveReference from "../ArchiveReference";

function getDialogTitle(verb: "Archive" | "Unarchive", name: string) {
	return screen.queryByRole("heading", {
		name: `${verb} ${name}?`,
	});
}

describe("<ArchiveReference />", () => {
	afterEach(() => nock.cleanAll());

	it("should archive an active reference and close the dialog on success", async () => {
		const detail = createFakeReference({ archived: false });
		const archived = { ...detail, archived: true };
		const scope = mockApiArchiveReference(detail.id, archived);

		await renderWithRouter(<ArchiveReference detail={detail} />);

		await userEvent.click(screen.getByRole("button", { name: "archive" }));
		expect(getDialogTitle("Archive", detail.name)).toBeInTheDocument();

		await userEvent.click(screen.getByRole("button", { name: "Archive" }));

		await waitFor(() => {
			expect(getDialogTitle("Archive", detail.name)).toBeNull();
		});

		scope.done();
	});

	it("should unarchive an archived reference", async () => {
		const detail = createFakeReference({ archived: true });
		const unarchived = { ...detail, archived: false };
		const scope = mockApiUnarchiveReference(detail.id, unarchived);

		await renderWithRouter(<ArchiveReference detail={detail} />);

		await userEvent.click(screen.getByRole("button", { name: "unarchive" }));
		expect(getDialogTitle("Unarchive", detail.name)).toBeInTheDocument();

		await userEvent.click(screen.getByRole("button", { name: "Unarchive" }));

		await waitFor(() => {
			expect(getDialogTitle("Unarchive", detail.name)).toBeNull();
		});

		scope.done();
	});

	it("should surface a server-provided error message when one is returned", async () => {
		const detail = createFakeReference({ archived: false });
		const scope = nock("http://localhost")
			.post(`/api/refs/${detail.id}/archive`)
			.reply(409, { message: "The official reference cannot be archived." });

		await renderWithRouter(<ArchiveReference detail={detail} />);

		await userEvent.click(screen.getByRole("button", { name: "archive" }));
		await userEvent.click(screen.getByRole("button", { name: "Archive" }));

		expect(
			await screen.findByText("The official reference cannot be archived."),
		).toBeInTheDocument();
		expect(getDialogTitle("Archive", detail.name)).toBeInTheDocument();

		scope.done();
	});

	it("should fall back to the official-reference message on 409 with no body", async () => {
		const detail = createFakeReference({ archived: false });
		const scope = nock("http://localhost")
			.post(`/api/refs/${detail.id}/archive`)
			.reply(409);

		await renderWithRouter(<ArchiveReference detail={detail} />);

		await userEvent.click(screen.getByRole("button", { name: "archive" }));
		await userEvent.click(screen.getByRole("button", { name: "Archive" }));

		expect(
			await screen.findByText("The official reference cannot be archived."),
		).toBeInTheDocument();

		scope.done();
	});

	it("should surface a generic message when the server returns no message", async () => {
		const detail = createFakeReference({ archived: false });
		const scope = mockApiArchiveReference(detail.id, detail, 500);

		await renderWithRouter(<ArchiveReference detail={detail} />);

		await userEvent.click(screen.getByRole("button", { name: "archive" }));
		await userEvent.click(screen.getByRole("button", { name: "Archive" }));

		expect(
			await screen.findByText(/Failed to archive reference/i),
		).toBeInTheDocument();

		scope.done();
	});

	it("should close without mutating when the Cancel button is clicked", async () => {
		const detail = createFakeReference({ archived: false });
		const scope = mockApiArchiveReference(detail.id, detail);

		await renderWithRouter(<ArchiveReference detail={detail} />);

		await userEvent.click(screen.getByRole("button", { name: "archive" }));
		await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

		await waitFor(() => {
			expect(getDialogTitle("Archive", detail.name)).toBeNull();
		});
		expect(scope.isDone()).toBe(false);
	});
});
