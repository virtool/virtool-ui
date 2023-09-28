import { createBrowserHistory } from "history";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { logout } from "../../../account/actions";
import { AdministratorRoles } from "../../../administration/types";
import { Bar, mapDispatchToProps, mapStateToProps } from "../NavBar";

describe("<Bar />", () => {
    const props = {
        administrator_role: AdministratorRoles.FULL,
        dev: false,
        handle: "Bob",
        onLogout: vi.fn(),
        userId: "user_id_bob",
    };
    it("should render", async () => {
        renderWithRouter(<Bar {...props} />, {}, createBrowserHistory());
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

describe("mapDispatchToProps", () => {
    const dispatch = vi.fn();

    window.virtool = {
        b2c: {
            enabled: false,
        },
    };

    it("should return onLogout in props", () => {
        const props = mapDispatchToProps(dispatch);
        props.onLogout();
        expect(dispatch).toHaveBeenCalledWith(logout());
    });
});
