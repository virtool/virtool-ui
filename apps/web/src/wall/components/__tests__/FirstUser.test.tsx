import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "@tests/setup";
import nock from "nock";
import { describe, expect, it } from "vitest";
import FirstUser from "../FirstUser";

describe("<FirstUser />", () => {
	it("creates first user and redirects to / on success", async () => {
		const usernameInput = "Username";
		const passwordInput = "Password";
		const scope = nock("http://localhost")
			.put("/api/users/first", {
				handle: usernameInput,
				password: passwordInput,
				force_reset: false,
			})
			.reply(201, {
				handle: usernameInput,
				password: passwordInput,
			});

		const { router } = await renderWithRouter(<FirstUser />, "/setup");

		const usernameField = screen.getByLabelText("username");
		const passwordField = screen.getByLabelText("password");

		expect(usernameField).toHaveValue("");
		expect(passwordField).toHaveValue("");

		await userEvent.type(usernameField, usernameInput);
		expect(usernameField).toHaveValue(usernameInput);

		await userEvent.type(passwordField, passwordInput);
		expect(passwordField).toHaveValue(passwordInput);

		await userEvent.click(screen.getByRole("button", { name: /Create User/i }));

		await waitFor(() => {
			expect(router.state.location.pathname).toBe("/");
		});
		expect(scope.isDone()).toBe(true);
	});
});
