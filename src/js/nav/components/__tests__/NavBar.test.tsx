import { AdministratorRoles } from "@administration/types";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import React from "react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "../../../../tests/setupTests";
import { mapStateToProps, NavBar } from "../NavBar";

describe("<NavBar />", () => {
    const props = {
        administrator_role: AdministratorRoles.FULL,
        dev: false,
        handle: "Bob",
    };

    it("should render", async () => {
        renderWithRouter(<NavBar {...props} />, {}, createBrowserHistory());
        expect(screen.getByRole("link", { name: "Jobs" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Samples" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "References" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "HMM" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Subtractions" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "ML" })).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button"));

        expect(screen.getByRole("menuitem", { name: "Signed in as Bob" })).toBeInTheDocument();
        expect(screen.getByRole("menuitem", { name: "Account" })).toBeInTheDocument();
        expect(screen.getByRole("menuitem", { name: "Administration" })).toBeInTheDocument();
        expect(screen.getByRole("menuitem", { name: "Documentation" })).toBeInTheDocument();
        expect(screen.getByRole("menuitem", { name: "Logout" })).toBeInTheDocument();
    });
});

describe("mapStateToProps", () => {
    const state = {
        account: { foo: "bar" },
        app: {
            pending: false,
        },
    };
    it("should return props", () => {
        const result = mapStateToProps(state);
        expect(result).toEqual({
            foo: "bar",
            pending: false,
        });
    });
});
