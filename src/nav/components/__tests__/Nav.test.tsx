import { AdministratorRoles } from "../../../administration/types";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "@tests/setup";
import React from "react";
import { describe, expect, it } from "vitest";
import Nav from "../Nav";

describe("<Nav />", () => {
    const props = {
        administrator_role: AdministratorRoles.FULL,
        dev: false,
        handle: "Bob",
    };

    it("should render", async () => {
        renderWithRouter(<Nav {...props} />);
        expect(screen.getByRole("link", { name: "Jobs" })).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: "Samples" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: "References" }),
        ).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "HMM" })).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: "Subtractions" }),
        ).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "ML" })).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button"));

        expect(
            screen.getByRole("menuitem", { name: "Signed in as Bob" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("menuitem", { name: "Account" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("menuitem", { name: "Administration" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("menuitem", { name: "Documentation" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("menuitem", { name: "Logout" }),
        ).toBeInTheDocument();
    });
});
