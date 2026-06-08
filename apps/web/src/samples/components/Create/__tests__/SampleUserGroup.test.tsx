import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeGroupMinimal } from "@tests/fake/groups";
import { renderWithProviders } from "@tests/setup";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SampleUserGroup from "../SampleUserGroup";

describe("SampleUserGroup", () => {
	let props: ComponentProps<typeof SampleUserGroup>;
	beforeEach(() => {
		props = {
			groups: [createFakeGroupMinimal({ name: "bar" })],
			onChange: vi.fn(),
			selected: "",
		};
	});

	it("should render", () => {
		renderWithProviders(<SampleUserGroup {...props} />);

		expect(screen.getByLabelText("User Group")).toBeInTheDocument();
		expect(screen.getByText("None")).toBeInTheDocument();
		expect(screen.getByText("bar")).toBeInTheDocument();
	});
	it("should call onChange input is changed", async () => {
		renderWithProviders(<SampleUserGroup {...props} />);

		await userEvent.selectOptions(screen.getByLabelText("User Group"), "bar");

		expect(props.onChange).toHaveBeenCalled();
	});
});
