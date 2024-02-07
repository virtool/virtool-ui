import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeAccount, mockGetAccountAPI } from "../../../../../../tests/fake/account";
import { createFakeReference, mockApiEditReference } from "../../../../../../tests/fake/references";
import { renderWithRouter } from "../../../../../../tests/setupTests";
import { AdministratorRoles } from "../../../../../administration/types";
import Targets from "../Targets";

describe("<Targets />", () => {
    let props;
    let history;

    beforeEach(() => {
        mockGetAccountAPI(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        props = {
            reference: createFakeReference({ data_type: "barcode" }),
        };
        history = createBrowserHistory();
    });

    it("should render when [canModify=true]", async () => {
        renderWithRouter(<Targets {...props} />, {}, history);

        expect(await screen.findByRole("button", { name: "edit" })).toBeInTheDocument();
    });

    it("should render when [canModify=false]", () => {
        mockGetAccountAPI(createFakeAccount({ administrator_role: null }));
        renderWithRouter(<Targets {...props} />, {}, history);

        expect(screen.queryByRole("button", { name: "edit" })).toBeNull();
    });

    it("should render null when [dataType!=barcode]", () => {
        props.reference = createFakeReference({ data_type: "genome" });
        renderWithRouter(<Targets {...props} />, {}, history);

        expect(screen.queryByText("Targets")).toBeNull();
    });

    it("should show modal when add target is called", async () => {
        renderWithRouter(<Targets {...props} />, {}, history);

        expect(await screen.findByText("Add target")).toBeInTheDocument();
        await userEvent.click(screen.getByRole("link", { name: "Add target" }));
        expect(history.location.state.addTarget).toBe(true);
    });

    it("should show modal when edit target is called", async () => {
        renderWithRouter(<Targets {...props} />, {}, history);

        expect(await screen.findByRole("button", { name: "edit" })).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: "edit" }));
        expect(history.location.state.editTarget).toBe(props.reference.targets[0].name);
    });

    it("should call onRemove() when TargetItem removed", async () => {
        const scope = mockApiEditReference(props.reference, { targets: [] });
        renderWithRouter(<Targets {...props} />, {}, history);

        expect(await screen.findByRole("button", { name: "remove" })).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: "remove" }));

        scope.done();
    });
});
