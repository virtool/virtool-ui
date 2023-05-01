import { screen } from "@testing-library/react";
import nock from "nock";
import React from "react";
import { createFakeAccount } from "../../../../account/types";
import { ManageAdministrators } from "../Administrators";
describe("<EditLabel>", () => {
    let props;

    beforeEach(() => {
        props = {
            id: 1,
            name: "Foo",
            description: "This is a description",
            color: "#1DAD57"
        };
    });

    it("should render", async () => {
        const account = createFakeAccount();
        const account_scope = nock("http://localhost").patch("/api/account").reply(200, account);

        const user_scope = nock("http://localhost").patch("/api/admin/users").reply(200);
        const set_role_scope = nock("http://localhost").patch("/api/admin/users/{#####id}/roles").reply(200);
        const roles_acope = nock("http://localhost").patch("/api/admin/roles").reply(200);

        renderWithProviders(<ManageAdministrators />);

        expect(screen.getByRole("textbox")).toBeInTheDocument();

        scope.isDone();
    });
});
