import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiListGroups } from "@tests/api/groups";
import { createFakeAccount } from "@tests/fake/account";
import { createFakeGroup } from "@tests/fake/groups";
import {
	createFakeUser,
	mockApiEditUser,
	mockApiGetUser,
} from "@tests/fake/user";
import { renderRoute } from "@tests/setup";
import type { User } from "@users/types";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { Account } from "@/account/types";
import type { Group } from "@/groups/types";

function formatUserPath(user: User) {
	return `/administration/users/${user.id}`;
}

describe("<UserDetail />", () => {
	let groups: Group[];
	let user: User;
	let account: Account;

	beforeEach(() => {
		groups = Array.from({ length: 5 }, (_, index) =>
			createFakeGroup({ name: `Group ${index}` }),
		);
		user = createFakeUser({
			groups: groups.map(({ id, name, legacy_id }) => ({
				id,
				name,
				legacy_id,
			})),
			active: true,
		});
		account = createFakeAccount({
			administrator_role: "full",
		});
	});

	afterEach(() => nock.cleanAll());

	describe("<UserDetail />", () => {
		it("should render correctly when administrator_role = AdministratorRoles.FULL, canModifyUser=true and 5 groups exist", async () => {
			mockApiListGroups(groups);

			const userDetail = createFakeUser({
				administrator_role: "full",
				groups,
			});

			const scope = mockApiGetUser(userDetail.id, userDetail);

			await renderRoute(formatUserPath(userDetail), { account });

			expect(await screen.findByText("Change Password")).toBeInTheDocument();

			expect(screen.getByText(userDetail.handle)).toBeInTheDocument();
			expect(screen.getByLabelText("Administrator")).toBeInTheDocument();

			expect(
				screen.getByText("Force user to reset password on next login"),
			).toBeInTheDocument();
			expect(screen.getByText("Change Password")).toBeInTheDocument();

			expect(await screen.findByText("Groups")).toBeInTheDocument();
			expect(screen.getByText("Group 0")).toBeInTheDocument();
			expect(screen.getByText("Group 1")).toBeInTheDocument();
			expect(screen.getByText("Group 2")).toBeInTheDocument();
			expect(screen.getByText("Group 3")).toBeInTheDocument();

			expect(screen.getByText("Primary Group")).toBeInTheDocument();
			expect(screen.getByRole("option", { name: "None" })).toBeInTheDocument();
			expect(
				screen.getByRole("option", { name: "Group 1" }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("option", { name: "Group 4" }),
			).toBeInTheDocument();

			expect(screen.getByText("Permissions")).toBeInTheDocument();
			expect(
				screen.getByText("Change group membership to modify permissions"),
			).toBeInTheDocument();
			expect(screen.getByText("cancel_job")).toBeInTheDocument();
			expect(screen.getByText("create_sample")).toBeInTheDocument();

			scope.done();
		});

		it("should render loading when the user details hasn't loaded", async () => {
			await renderRoute(`/administration/users/${user.id}`, { account });

			expect(screen.getByLabelText("loading")).toBeInTheDocument();
			expect(screen.queryByText("bob")).not.toBeInTheDocument();
		});

		it("should render correctly when [administrator_role=null] and canModifyUser=false", async () => {
			mockApiListGroups(groups);
			const scope = mockApiGetUser(user.id, user);

			await renderRoute(formatUserPath(user), { account });

			expect(await screen.findByText("Change Password")).toBeInTheDocument();
			expect(screen.queryByLabelText("Administrator")).not.toBeInTheDocument();
			expect(screen.queryByText("User Role")).not.toBeInTheDocument();
			expect(screen.getByText("Group 4")).toBeInTheDocument();
			expect(screen.getByText("create_sample")).toBeInTheDocument();

			scope.done();
		});

		it("should render correctly when user has insufficient permissions", async () => {
			const account = createFakeAccount({ administrator_role: "users" });
			const adminUser = createFakeUser({ administrator_role: "full" });
			const scope = mockApiGetUser(adminUser.id, adminUser);

			await renderRoute(formatUserPath(adminUser), { account });

			expect(
				await screen.findByText(
					"You do not have permission to manage this user.",
				),
			).toBeInTheDocument();

			expect(screen.getByText("Contact an administrator.")).toBeInTheDocument();
			expect(screen.queryByText(adminUser.handle)).not.toBeInTheDocument();
			expect(screen.queryByText("Permissions")).not.toBeInTheDocument();

			scope.done();
		});

		it("should handle user deactivation", async () => {
			mockApiListGroups(groups);
			mockApiGetUser(user.id, user);
			const scope = mockApiEditUser(user.id, 200, { active: false });
			await renderRoute(formatUserPath(user), { account });

			await userEvent.click(
				await screen.findByRole("button", { name: "Deactivate" }),
			);

			scope.done();
		});

		it("should handle user reactivation", async () => {
			mockApiListGroups(groups);
			const inactiveUser = createFakeUser({ active: false });
			mockApiGetUser(inactiveUser.id, inactiveUser);
			const scope = mockApiEditUser(inactiveUser.id, 200, {
				active: true,
			});
			await renderRoute(formatUserPath(inactiveUser), { account });

			await userEvent.click(
				await screen.findByRole("button", { name: "Activate" }),
			);

			scope.done();
		});
	});

	describe("<UserGroups />", () => {
		it("should render correctly", async () => {
			const groupScope = mockApiListGroups(groups);
			const scope = mockApiGetUser(user.id, user);

			await renderRoute(formatUserPath(user), { account });

			await waitFor(() => {
				scope.done();
				groupScope.done();
			});

			expect(await screen.findByLabelText("Group 1")).toBeInTheDocument();
			expect(screen.getByLabelText("Group 3")).toBeInTheDocument();
		});
		it("should render loading when groups haven't loaded", async () => {
			const scope = mockApiGetUser(user.id, user);

			await renderRoute(formatUserPath(user), { account });

			expect(await screen.findByText("Change Password")).toBeInTheDocument();

			expect(screen.getByLabelText("loading")).toBeInTheDocument();
			expect(screen.queryByLabelText("Group 1")).not.toBeInTheDocument();
			expect(screen.queryByLabelText("Group 3")).not.toBeInTheDocument();
			expect(screen.getByText("Permissions")).toBeInTheDocument();

			scope.done();
		});
		it("should render NoneFound when items = []", async () => {
			const user = createFakeUser({ groups: [] });

			mockApiListGroups([]);

			const scope = mockApiGetUser(user.id, user);

			await renderRoute(formatUserPath(user), { account });

			expect(await screen.findByText("Groups")).toBeInTheDocument();
			expect(await screen.findByText("No groups found")).toBeInTheDocument();
			expect(screen.queryByLabelText("group3")).not.toBeInTheDocument();
			expect(screen.getByText("Primary Group")).toBeInTheDocument();
			expect(screen.getByRole("option", { name: "None" })).toBeInTheDocument();

			scope.done();
		});
	});

	describe("<Password />", () => {
		it("should render correctly when forceReset = false", async () => {
			mockApiListGroups(groups);
			const scope = mockApiGetUser(user.id, user);

			await renderRoute(formatUserPath(user), { account });

			expect(await screen.findByText("Change Password")).toBeInTheDocument();

			expect(screen.getByText("Change Password")).toBeInTheDocument();
			expect(screen.getByText(/Last changed/)).toBeInTheDocument();
			expect(
				screen.getByText("Force user to reset password on next login"),
			).toBeInTheDocument();
			expect(screen.getByLabelText("password")).toBeInTheDocument();
			expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();

			scope.done();
		});

		it("should render correctly when forceReset = false", async () => {
			mockApiListGroups(groups);

			const user = createFakeUser({ force_reset: true });

			const scope = mockApiGetUser(user.id, user);

			await renderRoute(formatUserPath(user), { account });

			expect(await screen.findByText("Change Password")).toBeInTheDocument();
			expect(screen.getByText("Last changed")).toBeInTheDocument();
			expect(screen.getByLabelText("password")).toBeInTheDocument();
			expect(
				screen.getByText("Force user to reset password on next login"),
			).toBeInTheDocument();
			expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();

			scope.done();
		});

		it("should submit when password is long enough", async () => {
			mockApiListGroups(groups);
			mockApiEditUser(user.id, 200, { password: "newPassword" }, user);
			const scope = mockApiGetUser(user.id, user);

			await renderRoute(formatUserPath(user), { account });

			expect(await screen.findByText("Change Password")).toBeInTheDocument();

			await userEvent.type(screen.getByLabelText("password"), "newPassword");
			await userEvent.click(screen.getByRole("button", { name: "Save" }));

			scope.done();
		});

		it("should display error when password is not long enough", async () => {
			mockApiListGroups(groups);
			mockApiEditUser(user.id, 400, {
				id: "bad_request",
				message: "Password does not meet minimum length requirement (8)",
			});
			const scope = mockApiGetUser(user.id, user);

			await renderRoute(formatUserPath(user), { account });

			expect(await screen.findByText("Change Password")).toBeInTheDocument();

			await userEvent.click(screen.getByRole("button", { name: "Save" }));

			await waitFor(() =>
				expect(
					screen.getByText(
						"Password does not meet minimum length requirement (8)",
					),
				).toBeInTheDocument(),
			);

			scope.done();
		});
	});

	describe("<UserPermissions />", () => {
		it("should render permissions correctly", async () => {
			mockApiListGroups(groups);

			const permissions = {
				cancel_job: true,
				create_ref: true,
				create_sample: true,
				modify_hmm: true,
				modify_subtraction: true,
				remove_file: false,
				remove_job: false,
				upload_file: false,
			};

			const user = createFakeUser({ permissions });

			const scope = mockApiGetUser(user.id, user);

			await renderRoute(formatUserPath(user), { account });

			expect(await screen.findByText("Permissions")).toBeInTheDocument();
			expect(
				await screen.findByText(
					"Change group membership to modify permissions",
				),
			).toBeInTheDocument();
			expect(screen.getByLabelText("cancel_job:true")).toBeInTheDocument();
			expect(screen.getByLabelText("create_sample:true")).toBeInTheDocument();
			expect(screen.getByLabelText("remove_file:false")).toBeInTheDocument();
			expect(screen.getByLabelText("upload_file:false")).toBeInTheDocument();

			scope.done();
		});
	});
});
