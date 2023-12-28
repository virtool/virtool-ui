import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import { times } from "lodash-es";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeAccount, mockGetAccountAPI } from "../../../../tests/fake/account";
import { createFakeGroupMinimal, mockApiListGroups } from "../../../../tests/fake/groups";
import { createFakeUser, mockApiEditUser, mockApiGetUser } from "../../../../tests/fake/user";
import { renderWithRouter } from "../../../../tests/setupTests";
import { AdministratorRoles } from "../../../administration/types";
import UserDetail from "../UserDetail";

describe("<UserDetail />", () => {
    const history = createBrowserHistory();
    const groups = times(5, index => createFakeGroupMinimal({ name: `group${index}` }));
    const userDetail = createFakeUser({ groups });
    const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });

    let props;

    beforeEach(() => {
        props = {
            match: {
                params: {
                    userId: userDetail.id,
                },
            },
        };
    });

    afterEach(() => nock.cleanAll());

    describe("<UserDetail />", () => {
        it("should render correctly when administrator_role = AdministratorRoles.FULL, canModifyUser=true and 5 groups exist", async () => {
            mockApiListGroups(groups);
            mockGetAccountAPI(account);

            const userDetail = createFakeUser({ administrator_role: AdministratorRoles.FULL, groups });
            props.match.params.userId = userDetail.id;

            const scope = mockApiGetUser(props.match.params.userId, userDetail);

            renderWithRouter(<UserDetail {...props} />, {}, history);

            expect(await screen.findByText("Change Password")).toBeInTheDocument();

            expect(screen.getByText(userDetail.handle)).toBeInTheDocument();
            expect(screen.getByLabelText("admin")).toBeInTheDocument();
            expect(screen.getByText("Back To List")).toBeInTheDocument();

            expect(screen.getByText("Force user to reset password on next login")).toBeInTheDocument();
            expect(screen.getByText("Change Password")).toBeInTheDocument();

            expect(await screen.findByText("Groups")).toBeInTheDocument();
            expect(screen.getByText("Group0")).toBeInTheDocument();
            expect(screen.getByText("Group1")).toBeInTheDocument();
            expect(screen.getByText("Group2")).toBeInTheDocument();
            expect(screen.getByText("Group3")).toBeInTheDocument();

            expect(screen.getByText("Primary Group")).toBeInTheDocument();
            expect(screen.getByRole("option", { name: "None" })).toBeInTheDocument();
            expect(screen.getByRole("option", { name: "Group1" })).toBeInTheDocument();
            expect(screen.getByRole("option", { name: "Group4" })).toBeInTheDocument();

            expect(screen.getByText("Permissions")).toBeInTheDocument();
            expect(screen.getByText("Change group membership to modify permissions")).toBeInTheDocument();
            expect(screen.getByText("cancel_job")).toBeInTheDocument();
            expect(screen.getByText("create_sample")).toBeInTheDocument();

            scope.done();
        });

        it("should render loading when the user details hasn't loaded", () => {
            renderWithRouter(<UserDetail {...props} />, {}, history);

            expect(screen.getByLabelText("loading")).toBeInTheDocument();
            expect(screen.queryByText("Groups")).not.toBeInTheDocument();
            expect(screen.queryByText("bob")).not.toBeInTheDocument();
        });

        it("should render correctly when [administrator_role=null] and canModifyUser=false", async () => {
            mockApiListGroups(groups);
            mockGetAccountAPI(account);
            const scope = mockApiGetUser(props.match.params.userId, userDetail);

            renderWithRouter(<UserDetail {...props} />, {}, history);

            expect(await screen.findByText("Change Password")).toBeInTheDocument();

            expect(screen.queryByLabelText("admin")).not.toBeInTheDocument();
            expect(screen.queryByText("User Role")).not.toBeInTheDocument();
            expect(screen.getByText("Group4")).toBeInTheDocument();
            expect(screen.getByText("create_sample")).toBeInTheDocument();

            scope.done();
        });

        it("should render correctly when user has insufficient permissions", async () => {
            const account = createFakeAccount({ administrator_role: null });
            mockGetAccountAPI(account);
            const scope = mockApiGetUser(props.match.params.userId, userDetail);

            renderWithRouter(<UserDetail {...props} />, {}, history);

            expect(await screen.findByText("You do not have permission to manage this user.")).toBeInTheDocument();

            expect(screen.getByText("Contact an administrator.")).toBeInTheDocument();
            expect(screen.queryByText(userDetail.handle)).not.toBeInTheDocument();
            expect(screen.queryByText("Groups")).not.toBeInTheDocument();
            expect(screen.queryByText("Permissions")).not.toBeInTheDocument();

            scope.done();
        });
    });

    describe("<UserGroups />", () => {
        it("should render correctly", async () => {
            mockApiListGroups(groups);
            mockGetAccountAPI(account);
            const scope = mockApiGetUser(props.match.params.userId, userDetail);

            renderWithRouter(<UserDetail {...props} />, {}, history);

            expect(await screen.findByText("Groups")).toBeInTheDocument();
            expect(screen.getByLabelText("group1")).toBeInTheDocument();
            expect(screen.getByLabelText("group3")).toBeInTheDocument();

            scope.done();
        });
        it("should render loading when groups haven't loaded", async () => {
            mockGetAccountAPI(account);
            const scope = mockApiGetUser(props.match.params.userId, userDetail);

            renderWithRouter(<UserDetail {...props} />, {}, history);

            expect(await screen.findByText("Change Password")).toBeInTheDocument();

            expect(screen.getByLabelText("loading")).toBeInTheDocument();
            expect(screen.queryByText("Groups")).not.toBeInTheDocument();
            expect(screen.queryByLabelText("Group1")).not.toBeInTheDocument();
            expect(screen.queryByLabelText("Group3")).not.toBeInTheDocument();
            expect(screen.getByText("Permissions")).toBeInTheDocument();

            scope.done();
        });
        it("should render NoneFound when documents = []", async () => {
            mockGetAccountAPI(account);

            const userDetail = createFakeUser({ groups: [] });
            props.match.params.userId = userDetail.id;
            mockApiListGroups([]);

            const scope = mockApiGetUser(props.match.params.userId, userDetail);

            renderWithRouter(<UserDetail {...props} />, {}, history);

            expect(await screen.findByText("Groups")).toBeInTheDocument();
            expect(screen.getByText("No groups found")).toBeInTheDocument();
            expect(screen.queryByLabelText("group3")).not.toBeInTheDocument();
            expect(screen.getByText("Primary Group")).toBeInTheDocument();
            expect(screen.getByRole("option", { name: "None" })).toBeInTheDocument();

            scope.done();
        });
    });

    describe("<Password />", () => {
        it("should render correctly when forceReset = false", async () => {
            mockGetAccountAPI(account);
            mockApiListGroups(groups);
            const scope = mockApiGetUser(props.match.params.userId, userDetail);

            renderWithRouter(<UserDetail {...props} />, {}, history);

            expect(await screen.findByText("Change Password")).toBeInTheDocument();

            expect(screen.getByText("Change Password")).toBeInTheDocument();
            expect(screen.getByText(/Last changed/)).toBeInTheDocument();
            expect(screen.getByText("Force user to reset password on next login")).toBeInTheDocument();
            expect(screen.getByLabelText("password")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();

            scope.done();
        });

        it("should render correctly when forceReset = false", async () => {
            mockGetAccountAPI(account);
            mockApiListGroups(groups);

            const userDetail = createFakeUser({ force_reset: true });
            props.match.params.userId = userDetail.id;

            const scope = mockApiGetUser(props.match.params.userId, userDetail);

            renderWithRouter(<UserDetail {...props} />, {}, history);

            expect(await screen.findByText("Change Password")).toBeInTheDocument();
            expect(screen.getByText("Last changed")).toBeInTheDocument();
            expect(screen.getByLabelText("password")).toBeInTheDocument();
            expect(screen.getByText("Force user to reset password on next login")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();

            scope.done();
        });

        it("should submit when password is long enough", async () => {
            mockGetAccountAPI(account);
            mockApiListGroups(groups);
            mockApiEditUser(props.match.params.userId, 200, { password: "newPassword" }, userDetail);
            const scope = mockApiGetUser(props.match.params.userId, userDetail);

            renderWithRouter(<UserDetail {...props} />, {}, history);

            expect(await screen.findByText("Change Password")).toBeInTheDocument();

            await userEvent.type(screen.getByLabelText("password"), "newPassword");
            await userEvent.click(screen.getByRole("button", { name: "Save" }));

            scope.done();
        });

        it("should display error when password is not long enough", async () => {
            mockGetAccountAPI(account);
            mockApiListGroups(groups);
            mockApiEditUser(props.match.params.userId, 400, {
                id: "bad_request",
                message: "Password does not meet minimum length requirement (8)",
            });
            const scope = mockApiGetUser(props.match.params.userId, userDetail);

            renderWithRouter(<UserDetail {...props} />, {}, history);

            expect(await screen.findByText("Change Password")).toBeInTheDocument();

            await userEvent.click(screen.getByRole("button", { name: "Save" }));

            await waitFor(() =>
                expect(screen.getByText("Password does not meet minimum length requirement (8)")).toBeInTheDocument(),
            );

            scope.done();
        });
    });

    describe("<UserPermissions />", () => {
        it("should render permissions correctly", async () => {
            mockGetAccountAPI(account);
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

            const userDetail = createFakeUser({ permissions });
            props.match.params.userId = userDetail.id;

            const scope = mockApiGetUser(props.match.params.userId, userDetail);

            renderWithRouter(<UserDetail {...props} />, {}, history);

            expect(await screen.findByText("Permissions")).toBeInTheDocument();
            expect(screen.getByText("Change group membership to modify permissions")).toBeInTheDocument();
            expect(screen.getByLabelText("cancel_job:true")).toBeInTheDocument();
            expect(screen.getByLabelText("create_sample:true")).toBeInTheDocument();
            expect(screen.getByLabelText("remove_file:false")).toBeInTheDocument();
            expect(screen.getByLabelText("upload_file:false")).toBeInTheDocument();

            scope.done();
        });
    });
});
