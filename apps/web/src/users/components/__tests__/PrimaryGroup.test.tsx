import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiEditUser } from "@tests/api/users";
import { createFakeUser } from "@tests/fake/user";
import { renderWithProviders } from "@tests/setup";
import { beforeEach, describe, expect, it } from "vitest";
import PrimaryGroup, { type PrimaryGroupProps } from "../PrimaryGroup";

describe("<PrimaryGroup />", () => {
	let props: PrimaryGroupProps;

	beforeEach(() => {
		props = {
			groups: [
				{ id: 1, legacy_id: null, name: "foo" },
				{ id: 2, legacy_id: null, name: "bar" },
				{ id: 3, legacy_id: null, name: "baz" },
			],
			id: 1,
			primaryGroup: { id: 2, legacy_id: null, name: "bar" },
		};
	});

	it("should render correctly when 3 groups exist", () => {
		renderWithProviders(<PrimaryGroup {...props} />);

		expect(screen.getByText("Primary Group")).toBeInTheDocument();
		expect(screen.getByRole("combobox")).toHaveValue("2");
		expect(screen.getByRole("combobox")).not.toHaveValue("3");
		expect(screen.getByRole("option", { name: "None" })).toBeInTheDocument();
		expect(screen.getByRole("option", { name: "Foo" })).toBeInTheDocument();
		expect(screen.getByRole("option", { name: "Baz" })).toBeInTheDocument();
		expect(screen.getByRole("option", { name: "Bar" })).toBeInTheDocument();
	});

	it("should render when [primaryGroup = null]", () => {
		props.primaryGroup = null;

		renderWithProviders(<PrimaryGroup {...props} />);

		expect(screen.getByText("Primary Group")).toBeInTheDocument();
		expect(screen.getByRole("combobox")).toHaveValue("none");
		expect(screen.getByRole("option", { name: "Foo" })).toBeInTheDocument();
		expect(screen.getByRole("option", { name: "Bar" })).toBeInTheDocument();
	});

	it("should render correctly when groups = []", () => {
		props.groups = [];

		renderWithProviders(<PrimaryGroup {...props} />);

		expect(screen.getByText("Primary Group")).toBeInTheDocument();
		expect(screen.getByRole("combobox")).toHaveValue("none");
		expect(
			screen.queryByRole("option", { name: "Foo" }),
		).not.toBeInTheDocument();
	});

	it("should call onSetPrimaryGroup() when selection changes", async () => {
		const userDetails = createFakeUser({
			id: props.id,
			groups: props.groups,
			primary_group: props.primaryGroup,
		});

		const scope = mockApiEditUser(
			props.id,
			200,
			{ primary_group: { id: 1, name: "foo" } },
			userDetails,
		);
		renderWithProviders(<PrimaryGroup {...props} />);

		expect(screen.getByText("Primary Group")).toBeInTheDocument();

		await userEvent.selectOptions(screen.getByRole("combobox"), "Bar");

		scope.done();
	});
});
