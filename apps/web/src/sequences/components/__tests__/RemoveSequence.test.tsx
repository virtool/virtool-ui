import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeOtu, mockApiRemoveSequence } from "@tests/fake/otus";
import { renderWithProviders } from "@tests/setup";
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
		const firstIsolate = otu.isolates[0];
		if (!firstIsolate) {
			throw new Error("expected an isolate");
		}
		isolate = firstIsolate;
		const firstSequence = isolate.sequences[0];
		if (!firstSequence) {
			throw new Error("expected a sequence");
		}
		sequence = firstSequence;
		const sourceTypeInitial = isolate.source_type[0];
		if (!sourceTypeInitial) {
			throw new Error("expected a source type");
		}
		const sourceType =
			sourceTypeInitial.toUpperCase() + isolate.source_type.slice(1);
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

		expect(screen.getByText("Remove Sequence")).toBeInTheDocument();
		expect(
			screen.getByText(/Are you sure you want to remove the sequence/),
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

		expect(screen.queryByText("Remove Sequence")).toBeNull();
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
