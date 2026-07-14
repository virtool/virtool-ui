import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiEditOtu } from "@tests/api/otus";
import { createFakeOtu } from "@tests/fake/otus";
import { at, renderWithProviders } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import RemoveSegment from "../RemoveSegment";

describe("<RemoveSegment />", () => {
	let otu: ReturnType<typeof createFakeOtu>;
	let segmentName: string;

	beforeEach(() => {
		otu = createFakeOtu();
		segmentName = at(otu.schema, 0).name;
	});

	afterEach(() => nock.cleanAll());

	it("should render when [open=true]", () => {
		renderWithProviders(
			<RemoveSegment
				abbreviation={otu.abbreviation}
				name={otu.name}
				open
				otuId={otu.id}
				schema={otu.schema}
				segmentName={segmentName}
				setOpen={vi.fn()}
			/>,
		);

		expect(screen.getByText("Remove Segment")).toBeInTheDocument();
		expect(
			screen.getByText(/Are you sure you want to remove/),
		).toBeInTheDocument();
		expect(screen.getByText(segmentName)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
	});

	it("should not render when [open=false]", () => {
		renderWithProviders(
			<RemoveSegment
				abbreviation={otu.abbreviation}
				name={otu.name}
				otuId={otu.id}
				schema={otu.schema}
				segmentName={segmentName}
				setOpen={vi.fn()}
			/>,
		);

		expect(screen.queryByText("Remove Segment")).toBeNull();
		expect(screen.queryByText(/Are you sure you want to remove/)).toBeNull();
		expect(screen.queryByRole("button", { name: "Confirm" })).toBeNull();
	});

	it("should call API and close dialog when Confirm is clicked", async () => {
		const scope = mockApiEditOtu(otu, {
			abbreviation: otu.abbreviation,
			name: otu.name,
			otuId: otu.id,
			schema: otu.schema.filter((s) => s.name !== segmentName),
		});
		const setOpen = vi.fn();

		renderWithProviders(
			<RemoveSegment
				abbreviation={otu.abbreviation}
				name={otu.name}
				open
				otuId={otu.id}
				schema={otu.schema}
				segmentName={segmentName}
				setOpen={setOpen}
			/>,
		);

		await userEvent.click(screen.getByRole("button", { name: "Confirm" }));

		await waitFor(() => expect(setOpen).toHaveBeenCalledWith(false));
		scope.done();
	});

	it("should call setOpen(false) when dialog is dismissed", async () => {
		const setOpen = vi.fn();

		renderWithProviders(
			<RemoveSegment
				abbreviation={otu.abbreviation}
				name={otu.name}
				open
				otuId={otu.id}
				schema={otu.schema}
				segmentName={segmentName}
				setOpen={setOpen}
			/>,
		);

		await userEvent.keyboard("{Escape}");

		await waitFor(() => expect(setOpen).toHaveBeenCalledWith(false));
	});
});
