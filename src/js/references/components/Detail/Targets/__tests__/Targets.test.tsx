import { AdministratorRoles } from "@administration/types";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { createFakeReference, mockApiEditReference, mockApiGetReferenceDetail } from "@tests/fake/references";
import { renderWithRouter } from "@tests/setupTests";
import { createMemoryHistory } from "history";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import Targets from "../Targets";

describe("<Targets />", () => {
    let props;
    let history;

    beforeEach(() => {
        const reference = createFakeReference({ data_type: "barcode" });
        mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        mockApiGetReferenceDetail(reference);
        props = {
            reference: reference,
        };
        history = createMemoryHistory();
    });

    it("should render with no description", () => {
        props.reference = createFakeReference({
            data_type: "barcode",
            targets: [
                {
                    name: "test",
                    description: "",
                    length: 10,
                    required: false,
                },
            ],
        });
        renderWithRouter(<Targets {...props} />, history);

        expect(screen.getByText("No description")).toBeInTheDocument();
    });

    it("should render when [canModify=true]", async () => {
        renderWithRouter(<Targets {...props} />, history);

        expect(await screen.findByRole("button", { name: "modify" })).toBeInTheDocument();
    });

    it("should render when [canModify=false]", () => {
        mockApiGetAccount(createFakeAccount({ administrator_role: null }));
        renderWithRouter(<Targets {...props} />, history);

        expect(screen.queryByRole("button", { name: "modify" })).toBeNull();
    });

    it("should render null when [dataType!=barcode]", () => {
        props.reference = createFakeReference({ data_type: "genome" });
        renderWithRouter(<Targets {...props} />, history);

        expect(screen.queryByText("Targets")).toBeNull();
    });

    it("should show modal when add target is called", async () => {
        renderWithRouter(<Targets {...props} />, history);

        expect(await screen.findByText("Add Target")).toBeInTheDocument();
        await userEvent.click(screen.getByRole("link", { name: "Add Target" }));
        expect(history.location.state.addTarget).toBe(true);
    });

    it("should show modal when edit target is called", async () => {
        renderWithRouter(<Targets {...props} />, history);

        expect(await screen.findByRole("button", { name: "modify" })).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: "modify" }));
        expect(history.location.state.editTarget).toBe(props.reference.targets[0].name);
    });

    it("should call onRemove() when TargetItem removed", async () => {
        const scope = mockApiEditReference(props.reference, { targets: [] });
        renderWithRouter(<Targets {...props} />, history);

        expect(await screen.findByRole("button", { name: "remove" })).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: "remove" }));

        scope.done();
    });
});
