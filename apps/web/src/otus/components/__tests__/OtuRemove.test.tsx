import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiRemoveOtu } from "@tests/api/otus";
import { createFakeOtu } from "@tests/fake/otus";
import { renderWithProviders } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import OtuRemove from "../OtuRemove";

describe("<OtuRemove />", () => {
	let otu: ReturnType<typeof createFakeOtu>;

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

		expect(screen.getByText("Delete OTU")).toBeInTheDocument();
		expect(
			screen.getByText(/Are you sure you want to delete/),
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

		expect(screen.queryByText("Delete OTU")).toBeNull();
		expect(screen.queryByText(/Are you sure you want to delete/)).toBeNull();
		expect(screen.queryByRole("button", { name: "Confirm" })).toBeNull();
	});

	it("should call onRemoved after successful removal", async () => {
		const scope = mockApiRemoveOtu(otu.id);
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
