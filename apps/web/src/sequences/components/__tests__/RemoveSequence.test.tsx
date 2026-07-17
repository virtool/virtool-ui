import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiRemoveSequence } from "@tests/api/otus";
import { createFakeOtu } from "@tests/fake/otus";
import { at, renderWithProviders } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import RemoveSequence from "../RemoveSequence";

describe("<RemoveSequence />", () => {
	let otu: ReturnType<typeof createFakeOtu>;
	let isolate: ReturnType<typeof createFakeOtu>["isolates"][number];
	let sequence: (typeof isolate)["sequences"][number];
	let isolateName: string;

	beforeEach(() => {
		otu = createFakeOtu();
		isolate = at(otu.isolates, 0);
		sequence = at(isolate.sequences, 0);
		const sourceType =
			isolate.source_type.charAt(0).toUpperCase() +
			isolate.source_type.slice(1);
		isolateName = `${sourceType} ${isolate.source_name}`;
	});

	afterEach(() => nock.cleanAll());

	it("should render when [open=true]", () => {
		renderWithProviders(
			<RemoveSequence
				isolateId={isolate.id}
				isolateName={isolateName}
				otuId={otu.id}
				open
				sequence={sequence}
				setOpen={vi.fn()}
			/>,
		);

		expect(screen.getByText("Delete Sequence")).toBeInTheDocument();
		expect(
			screen.getByText(/Are you sure you want to delete the sequence/),
		).toBeInTheDocument();
		expect(screen.getByText(sequence.accession)).toBeInTheDocument();
		expect(screen.getByText(isolateName)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
	});

	it("should not render when [open=false]", () => {
		renderWithProviders(
			<RemoveSequence
				isolateId={isolate.id}
				isolateName={isolateName}
				otuId={otu.id}
				sequence={sequence}
				setOpen={vi.fn()}
			/>,
		);

		expect(screen.queryByText("Delete Sequence")).toBeNull();
		expect(screen.queryByRole("button", { name: "Confirm" })).toBeNull();
	});

	it("should call API and close dialog when Confirm is clicked", async () => {
		const scope = mockApiRemoveSequence(otu.id, isolate.id, sequence.id);
		const setOpen = vi.fn();

		renderWithProviders(
			<RemoveSequence
				isolateId={isolate.id}
				isolateName={isolateName}
				otuId={otu.id}
				open
				sequence={sequence}
				setOpen={setOpen}
			/>,
		);

		await userEvent.click(screen.getByRole("button", { name: "Confirm" }));

		await waitFor(() => expect(setOpen).toHaveBeenCalledWith(false));
		scope.done();
	});
});
