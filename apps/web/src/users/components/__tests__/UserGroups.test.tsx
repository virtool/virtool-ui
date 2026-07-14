import type { Group } from "@groups/types";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeGroup } from "@tests/fake/groups";
import { createFakeUser } from "@tests/fake/user";
import { mockListGroups } from "@tests/server-fn/groups";
import { mockUpdateUser, userServerFnMocks } from "@tests/server-fn/users";
import { renderWithProviders, renderWithRouter } from "@tests/setup";
import { beforeEach, describe, expect, it } from "vitest";
import UserGroups from "../UserGroups";

describe("<UserGroups />", () => {
	let allGroups: Group[];
	let member: Group;
	let other: Group;
	let userId: number;

	beforeEach(() => {
		member = createFakeGroup({ id: 1, name: "foo" });
		other = createFakeGroup({ id: 2, name: "bar" });
		allGroups = [member, other];
		userId = createFakeUser().id;
	});

	it("renders members as radios with remove buttons", async () => {
		mockListGroups(allGroups);

		renderWithProviders(
			<UserGroups
				userId={userId}
				memberGroups={[member]}
				primaryGroup={member}
			/>,
		);

		expect(await screen.findByText("Groups")).toBeInTheDocument();
		expect(screen.getByRole("radio", { name: "foo" })).toBeChecked();
		expect(
			screen.getByRole("button", { name: "Remove foo" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("radio", { name: "No primary group" }),
		).not.toBeChecked();
	});

	it("shows an empty message when the user has no groups", async () => {
		mockListGroups(allGroups);

		renderWithProviders(
			<UserGroups userId={userId} memberGroups={[]} primaryGroup={null} />,
		);

		expect(
			await screen.findByText("This user is not a member of any groups."),
		).toBeInTheDocument();
	});

	it("hides the combobox when the user is in every group", async () => {
		mockListGroups(allGroups);

		renderWithProviders(
			<UserGroups
				userId={userId}
				memberGroups={[member, other]}
				primaryGroup={member}
			/>,
		);

		expect(
			await screen.findByText("This user is a member of every group."),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: /add group/i }),
		).not.toBeInTheDocument();
		expect(screen.getByRole("radio", { name: "foo" })).toBeInTheDocument();
	});

	it("points to group creation when no groups exist", async () => {
		mockListGroups([]);

		await renderWithRouter(
			<UserGroups userId={userId} memberGroups={[]} primaryGroup={null} />,
		);

		expect(
			await screen.findByText(/No groups have been created yet/),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Manage groups" })).toHaveAttribute(
			"href",
			"/administration/groups",
		);
		expect(
			screen.queryByText("This user is not a member of any groups."),
		).not.toBeInTheDocument();
	});

	it("adds a group through the combobox", async () => {
		mockListGroups(allGroups);
		mockUpdateUser(userId, 200, {});

		renderWithProviders(
			<UserGroups
				userId={userId}
				memberGroups={[member]}
				primaryGroup={member}
			/>,
		);

		await userEvent.click(
			await screen.findByRole("button", { name: /add group/i }),
		);
		await userEvent.click(screen.getByRole("option", { name: "bar" }));

		await waitFor(() =>
			expect(userServerFnMocks.updateUser).toHaveBeenCalledWith({
				data: { userId, groups: [1, 2] },
			}),
		);
	});

	it("selects 'No primary group' by default when there is no primary group", async () => {
		mockListGroups(allGroups);

		renderWithProviders(
			<UserGroups
				userId={userId}
				memberGroups={[member, other]}
				primaryGroup={null}
			/>,
		);

		expect(
			await screen.findByRole("radio", { name: "No primary group" }),
		).toBeChecked();
		expect(screen.getByRole("radio", { name: "foo" })).not.toBeChecked();
		expect(screen.getByRole("radio", { name: "bar" })).not.toBeChecked();
	});

	it("sets the primary group when a radio is selected", async () => {
		mockListGroups(allGroups);
		mockUpdateUser(userId, 200, {});

		renderWithProviders(
			<UserGroups
				userId={userId}
				memberGroups={[member, other]}
				primaryGroup={member}
			/>,
		);

		await userEvent.click(await screen.findByRole("radio", { name: "bar" }));

		await waitFor(() =>
			expect(userServerFnMocks.updateUser).toHaveBeenCalledWith({
				data: { userId, primary_group: 2 },
			}),
		);
	});

	it("clears the primary group when 'No primary group' is selected", async () => {
		mockListGroups(allGroups);
		mockUpdateUser(userId, 200, {});

		renderWithProviders(
			<UserGroups
				userId={userId}
				memberGroups={[member, other]}
				primaryGroup={member}
			/>,
		);

		await userEvent.click(
			await screen.findByRole("radio", { name: "No primary group" }),
		);

		await waitFor(() =>
			expect(userServerFnMocks.updateUser).toHaveBeenCalledWith({
				data: { userId, primary_group: null },
			}),
		);
	});

	it("removes a group and clears the primary when the primary is removed", async () => {
		mockListGroups(allGroups);
		mockUpdateUser(userId, 200, {});

		renderWithProviders(
			<UserGroups
				userId={userId}
				memberGroups={[member, other]}
				primaryGroup={member}
			/>,
		);

		await userEvent.click(
			await screen.findByRole("button", { name: "Remove foo" }),
		);

		await waitFor(() =>
			expect(userServerFnMocks.updateUser).toHaveBeenCalledWith({
				data: { userId, groups: [2], primary_group: null },
			}),
		);
	});

	it("removes a non-primary group without touching the primary", async () => {
		mockListGroups(allGroups);
		mockUpdateUser(userId, 200, {});

		renderWithProviders(
			<UserGroups
				userId={userId}
				memberGroups={[member, other]}
				primaryGroup={member}
			/>,
		);

		await userEvent.click(
			await screen.findByRole("button", { name: "Remove bar" }),
		);

		await waitFor(() =>
			expect(userServerFnMocks.updateUser).toHaveBeenCalledWith({
				data: { userId, groups: [1] },
			}),
		);
	});
});
