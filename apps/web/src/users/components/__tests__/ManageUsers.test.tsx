import { screen } from "@testing-library/react";
import { createFakeAccount } from "@tests/fake/account";
import { createFakeUsers } from "@tests/fake/user";
import { mockFindUsers, mockGetAccount } from "@tests/server-fn/users";
import { at, renderWithRouter } from "@tests/setup";
import { describe, expect, it } from "vitest";
import { ManageUsers } from "../ManageUsers";

describe("<ManageUsers />", () => {
	it("should render correctly with 3 users", async () => {
		const users = createFakeUsers(3);
		at(users, 0).administrator_role = "full";
		await mockFindUsers(users);
		const account = createFakeAccount({
			administrator_role: "full",
		});
		mockGetAccount(account);

		await renderWithRouter(<ManageUsers />);

		expect(await screen.findByLabelText("search")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
		expect(await screen.findByText(/Administrator/)).toBeInTheDocument();
		users.forEach((user) => {
			expect(screen.getByText(user.handle)).toBeInTheDocument();
		});
	});

	it("should render correctly when items = null", async () => {
		const account = createFakeAccount({
			administrator_role: "full",
		});
		mockGetAccount(account);

		await renderWithRouter(<ManageUsers />);

		expect(await screen.findByLabelText("search")).toBeInTheDocument();
		expect(screen.getByRole("button")).toBeInTheDocument();
		expect(screen.getByLabelText("loading")).toBeInTheDocument();
		expect(screen.queryByText("Administrator")).not.toBeInTheDocument();
	});

	it("should render correctly if account has insufficient permissions", async () => {
		const users = createFakeUsers(3);

		mockFindUsers(users);
		mockGetAccount(createFakeAccount({ administrator_role: null }));

		await renderWithRouter(<ManageUsers />);

		expect(
			await screen.findByText("You do not have permission to manage users."),
		).toBeInTheDocument();
		expect(screen.getByText("Contact an administrator.")).toBeInTheDocument();
		for (const user of users) {
			expect(screen.queryByText(user.handle)).not.toBeInTheDocument();
		}
		expect(
			screen.queryByRole("button", { name: "Create" }),
		).not.toBeInTheDocument();
		expect(screen.queryByLabelText("search")).not.toBeInTheDocument();
		expect(screen.queryByText("Administrator")).not.toBeInTheDocument();
	});
});
