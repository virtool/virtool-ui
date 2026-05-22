import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeOtu, mockApiRemoveOTU } from "@tests/fake/otus";
import { renderWithProviders } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import OtuRemove from "../OtuRemove";

describe("<OtuRemove />", () => {
	let otu;

	beforeEach(() => {
		otu = createFakeOtu();
	});

	afterEach(() => nock.cleanAll());

	it("should render when [open=true]", () => {
		renderWithProviders(
			<OtuRemove
				id={otu.id}
				name={otu.name}
				open
				onRemoved={vi.fn()}
				setOpen={vi.fn()}
			/>,
		);

		expect(screen.getByText("Remove OTU")).toBeInTheDocument();
		expect(
			screen.getByText(/Are you sure you want to remove/),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
	});

	it("should not render when [open=false]", () => {
		renderWithProviders(
			<OtuRemove
				id={otu.id}
				name={otu.name}
				onRemoved={vi.fn()}
				setOpen={vi.fn()}
			/>,
		);

		expect(screen.queryByText("Remove OTU")).toBeNull();
		expect(screen.queryByText(/Are you sure you want to remove/)).toBeNull();
		expect(screen.queryByRole("button", { name: "Confirm" })).toBeNull();
	});

	it("should call onRemoved after successful removal", async () => {
		const scope = mockApiRemoveOTU(otu.id);
		const onRemoved = vi.fn();

		renderWithProviders(
			<OtuRemove
				id={otu.id}
				name={otu.name}
				open
				onRemoved={onRemoved}
				setOpen={vi.fn()}
			/>,
		);

		await userEvent.click(screen.getByRole("button", { name: "Confirm" }));

		await waitFor(() => expect(onRemoved).toHaveBeenCalledOnce());
		scope.done();
	});
});
