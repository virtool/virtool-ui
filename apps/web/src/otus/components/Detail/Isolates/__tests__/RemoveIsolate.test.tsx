import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiRemoveIsolate } from "@tests/api/otus";
import { renderWithProviders } from "@tests/setup";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RemoveIsolate from "../RemoveIsolate";

describe("<RemoveIsolate />", () => {
	let props: ComponentProps<typeof RemoveIsolate>;

	beforeEach(() => {
		props = {
			id: "foo",
			name: "Foo",
			onHide: vi.fn(),
			otuId: "baz",
			show: true,
		};
	});

	it("should render with [show=true]", () => {
		renderWithProviders(<RemoveIsolate {...props} />);

		expect(screen.getByText("Delete Isolate")).toBeInTheDocument();
		expect(
			screen.getByText(/Are you sure you want to delete/),
		).toBeInTheDocument();
		expect(screen.getByText(/Foo?/)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
	});

	it("should render with [show=false]", () => {
		props.show = false;
		renderWithProviders(<RemoveIsolate {...props} />);

		expect(screen.queryByText("Delete Isolate")).toBeNull();
		expect(screen.queryByText(/Are you sure you want to delete/)).toBeNull();
		expect(screen.queryByText(/Foo?/)).toBeNull();
		expect(screen.queryByRole("button", { name: "Confirm" })).toBeNull();
	});

	it("should handle submit when the confirm button is clicked", async () => {
		const scope = mockApiRemoveIsolate(props.otuId, props.id);
		renderWithProviders(<RemoveIsolate {...props} />);

		await userEvent.click(screen.getByRole("button", { name: "Confirm" }));
		await waitFor(() => expect(props.onHide).toHaveBeenCalled());

		scope.done();
	});
});
