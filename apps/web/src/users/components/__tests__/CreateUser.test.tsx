import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiCreateUser } from "@tests/api/users";
import { createFakeUser } from "@tests/fake/user";
import { renderWithRouter } from "@tests/setup";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import CreateUser from "../CreateUser";

function CreateUserHarness() {
	const [open, setOpen] = useState(false);

	return <CreateUser open={open} setOpen={setOpen} />;
}

describe("<CreateUser />", () => {
	it("creates user once form is submitted", async () => {
		const usernameInput = "Username";
		const passwordInput = "Password";
		const scope = mockApiCreateUser(createFakeUser({ handle: usernameInput }));
		await renderWithRouter(<CreateUserHarness />);

		await userEvent.click(screen.getByRole("button"));

		const usernameField = screen.getByLabelText("Username");
		await userEvent.type(usernameField, usernameInput);
		expect(usernameField).toHaveValue(usernameInput);

		const passwordField = screen.getByLabelText("Password");
		await userEvent.type(passwordField, passwordInput);
		expect(passwordField).toHaveValue(passwordInput);

		await userEvent.click(screen.getByRole("button", { name: "Save" }));

		await waitFor(() => scope.done());
	});

	it("should render correct username error message", async () => {
		await renderWithRouter(<CreateUserHarness />);
		await userEvent.click(screen.getByRole("button"));

		await userEvent.click(screen.getByRole("button", { name: "Save" }));

		expect(screen.getByText("Please specify a username")).toBeInTheDocument();
		expect(
			screen.getByText("Password does not meet minimum length requirement (8)"),
		).toBeInTheDocument();
	});
});
