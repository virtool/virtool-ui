import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiListGroups } from "@tests/api/groups";
import {
	mockApiEditUser,
	mockApiGetUser,
	mockApiListAdministratorRoles,
	mockApiSetAdministratorRole,
} from "@tests/api/users";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { administratorRoles } from "@tests/fake/administrator";
import { createFakeGroup } from "@tests/fake/groups";
import { createFakeUser } from "@tests/fake/user";
import { renderWithProviders, renderWithRouter } from "@tests/setup";
import UserDetail from "@users/components/UserDetail";
import type { User } from "@users/types";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { Group } from "@/groups/types";

describe("<UserDetail />", () => {
	let groups: Group[];
	let user: User;

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
		mockApiGetAccount(createFakeAccount({ administrator_role: "full" }));
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

			renderWithProviders(<UserDetail userId={userDetail.id} />);

			expect(await screen.findByText("Change Password")).toBeInTheDocument();

			expect(screen.getByText(userDetail.handle)).toBeInTheDocument();
			expect(screen.getByLabelText("Administrator")).toBeInTheDocument();

			expect(
				screen.getByText("Force user to reset password on next login"),
			).toBeInTheDocument();
			expect(screen.getByText("Change Password")).toBeInTheDocument();

			expect(await screen.findByText("Groups")).toBeInTheDocument();
			expect(screen.getByLabelText("Group 0")).toBeInTheDocument();
			expect(screen.getByLabelText("Group 1")).toBeInTheDocument();
			expect(screen.getByLabelText("Group 2")).toBeInTheDocument();
			expect(screen.getByLabelText("Group 3")).toBeInTheDocument();

			expect(
				screen.getByRole("radiogroup", { name: "Primary group" }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("radio", { name: "No primary group" }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("radio", { name: "Group 1" }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("radio", { name: "Group 4" }),
			).toBeInTheDocument();

			expect(screen.getByText("Permissions")).toBeInTheDocument();
			expect(
				screen.getByText("Change group membership to modify permissions"),
			).toBeInTheDocument();
			expect(screen.getByText("cancel_job")).toBeInTheDocument();
			expect(screen.getByText("create_sample")).toBeInTheDocument();

			scope.done();
		});

		it("should render correctly when [administrator_role=null] and canModifyUser=false", async () => {
			mockApiListGroups(groups);
			const scope = mockApiGetUser(user.id, user);

			renderWithProviders(<UserDetail userId={user.id} />);

			expect(await screen.findByText("Change Password")).toBeInTheDocument();
			expect(screen.queryByLabelText("Administrator")).not.toBeInTheDocument();
			expect(screen.queryByText("User Role")).not.toBeInTheDocument();
			expect(screen.getByText("Group 4")).toBeInTheDocument();
			expect(screen.getByText("create_sample")).toBeInTheDocument();

			scope.done();
		});

		it("should render correctly when user has insufficient permissions", async () => {
			nock.cleanAll();
			mockApiGetAccount(createFakeAccount({ administrator_role: "users" }));
			const adminUser = createFakeUser({ administrator_role: "full" });
			const scope = mockApiGetUser(adminUser.id, adminUser);

			renderWithProviders(<UserDetail userId={adminUser.id} />);

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
			renderWithProviders(<UserDetail userId={user.id} />);

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
			renderWithProviders(<UserDetail userId={inactiveUser.id} />);

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

			renderWithProviders(<UserDetail userId={user.id} />);

			await waitFor(() => {
				scope.done();
				groupScope.done();
			});

			expect(await screen.findByLabelText("Group 1")).toBeInTheDocument();
			expect(screen.getByLabelText("Group 3")).toBeInTheDocument();
		});
		it("should point to group creation when no groups exist", async () => {
			const user = createFakeUser({ groups: [], primary_group: null });

			mockApiListGroups([]);

			const scope = mockApiGetUser(user.id, user);

			await renderWithRouter(<UserDetail userId={user.id} />);

			expect(await screen.findByText("Groups")).toBeInTheDocument();
			expect(
				await screen.findByText(/No groups have been created yet/),
			).toBeInTheDocument();
			expect(
				screen.getByRole("link", { name: "Manage groups" }),
			).toBeInTheDocument();
			expect(screen.queryByLabelText("group3")).not.toBeInTheDocument();
			expect(
				screen.queryByRole("radiogroup", { name: "Primary group" }),
			).not.toBeInTheDocument();

			scope.done();
		});
	});

	describe("<Handle />", () => {
		it("should render with the current handle", async () => {
			mockApiListGroups(groups);
			const scope = mockApiGetUser(user.id, user);

			renderWithProviders(<UserDetail userId={user.id} />);

			expect(await screen.findByText("Change Handle")).toBeInTheDocument();
			expect(screen.getByLabelText("handle")).toHaveValue(user.handle);

			scope.done();
		});

		it("should submit a new handle", async () => {
			mockApiListGroups(groups);
			mockApiGetUser(user.id, user);
			const scope = mockApiEditUser(user.id, 200, { handle: "new_handle" });

			renderWithProviders(<UserDetail userId={user.id} />);

			const input = await screen.findByLabelText("handle");
			await userEvent.clear(input);
			await userEvent.type(input, "new_handle");

			const form = input.closest("form") as HTMLElement;
			await userEvent.click(within(form).getByRole("button", { name: "Save" }));

			await waitFor(() => scope.done());
		});

		it("should show a conflict error when the handle is taken", async () => {
			mockApiListGroups(groups);
			mockApiGetUser(user.id, user);
			mockApiEditUser(user.id, 409, { message: "User already exists." });

			renderWithProviders(<UserDetail userId={user.id} />);

			const input = await screen.findByLabelText("handle");
			await userEvent.clear(input);
			await userEvent.type(input, "taken_handle");

			const form = input.closest("form") as HTMLElement;
			await userEvent.click(within(form).getByRole("button", { name: "Save" }));

			await waitFor(() =>
				expect(screen.getByText("User already exists.")).toBeInTheDocument(),
			);
		});

		it("should show an error when the handle is reserved", async () => {
			mockApiListGroups(groups);
			mockApiGetUser(user.id, user);
			mockApiEditUser(user.id, 400, {
				message: "Reserved user name: virtool",
			});

			renderWithProviders(<UserDetail userId={user.id} />);

			const input = await screen.findByLabelText("handle");
			await userEvent.clear(input);
			await userEvent.type(input, "virtool");

			const form = input.closest("form") as HTMLElement;
			await userEvent.click(within(form).getByRole("button", { name: "Save" }));

			await waitFor(() =>
				expect(
					screen.getByText("Reserved user name: virtool"),
				).toBeInTheDocument(),
			);
		});
	});

	describe("<Password />", () => {
		it("should render correctly", async () => {
			mockApiListGroups(groups);
			const scope = mockApiGetUser(user.id, user);

			renderWithProviders(<UserDetail userId={user.id} />);

			expect(await screen.findByText("Change Password")).toBeInTheDocument();
			expect(screen.getByText(/Last changed/)).toBeInTheDocument();
			expect(
				screen.getByText("Force user to reset password on next login"),
			).toBeInTheDocument();
			expect(screen.getByLabelText("password")).toBeInTheDocument();
			const passwordForm = screen
				.getByLabelText("password")
				.closest("form") as HTMLElement;
			expect(
				within(passwordForm).getByRole("button", { name: "Save" }),
			).toBeInTheDocument();

			scope.done();
		});

		it("should submit when password is long enough", async () => {
			mockApiListGroups(groups);
			mockApiEditUser(user.id, 200, { password: "newPassword" }, user);
			const scope = mockApiGetUser(user.id, user);

			renderWithProviders(<UserDetail userId={user.id} />);

			expect(await screen.findByText("Change Password")).toBeInTheDocument();

			const passwordInput = screen.getByLabelText("password");
			await userEvent.type(passwordInput, "newPassword");
			const passwordForm = passwordInput.closest("form") as HTMLElement;
			await userEvent.click(
				within(passwordForm).getByRole("button", { name: "Save" }),
			);

			scope.done();
		});

		it("should display error when password is not long enough", async () => {
			mockApiListGroups(groups);
			mockApiEditUser(user.id, 400, {
				id: "bad_request",
				message: "Password does not meet minimum length requirement (8)",
			});
			const scope = mockApiGetUser(user.id, user);

			renderWithProviders(<UserDetail userId={user.id} />);

			expect(await screen.findByText("Change Password")).toBeInTheDocument();

			const passwordForm = screen
				.getByLabelText("password")
				.closest("form") as HTMLElement;
			await userEvent.click(
				within(passwordForm).getByRole("button", { name: "Save" }),
			);

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

			renderWithProviders(<UserDetail userId={user.id} />);

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

	describe("<UserAdministratorRole />", () => {
		beforeEach(() => {
			mockApiListGroups(groups);
			mockApiGetAccount(
				createFakeAccount({ id: 1, administrator_role: "full" }),
			);
			mockApiListAdministratorRoles(administratorRoles);
		});

		it("shows the role selector when managing another user", async () => {
			const target = createFakeUser({ id: 2, administrator_role: null });
			mockApiGetUser(target.id, target);

			renderWithProviders(<UserDetail userId={target.id} />);

			expect(await screen.findByText("Administrator Role")).toBeInTheDocument();
			expect(screen.getByText("Select administrator role")).toBeInTheDocument();
		});

		it("lets a full administrator remove a user's role", async () => {
			const target = createFakeUser({ id: 2, administrator_role: "users" });
			mockApiGetUser(target.id, target);
			const scope = mockApiSetAdministratorRole(target);

			renderWithProviders(<UserDetail userId={target.id} />);

			await userEvent.click(
				await screen.findByRole("button", {
					name: "remove administrator role",
				}),
			);

			await waitFor(() => scope.done());
		});

		it("is hidden for a full administrator viewing their own account", async () => {
			const self = createFakeUser({ id: 1, administrator_role: "full" });
			const scope = mockApiGetUser(self.id, self);

			renderWithProviders(<UserDetail userId={self.id} />);

			expect(await screen.findByText("Change Password")).toBeInTheDocument();
			expect(screen.queryByText("Administrator Role")).not.toBeInTheDocument();

			scope.done();
		});
	});
});
