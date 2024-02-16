import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import React from "react";
import { describe, expect, it } from "vitest";
import { createFakeAccount, mockAPIGetAccount } from "../../../../tests/fake/account";
import { createFakeSubtractionMinimal, mockApiGetSubtractions } from "../../../../tests/fake/subtractions";
import { renderWithRouter } from "../../../../tests/setupTests";
import { AdministratorRoles } from "../../../administration/types";
import SubtractionList from "../SubtractionList";

describe("<SubtractionList />", () => {
    let history;
    let subtractions;

    beforeEach(() => {
        subtractions = createFakeSubtractionMinimal();
        history = createBrowserHistory();
    });

    it("renders correctly", async () => {
        const scope = mockApiGetSubtractions([subtractions]);
        renderWithRouter(<SubtractionList />, {}, history);

        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());
        expect(screen.getByText("Subtractions")).toBeInTheDocument();
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText(subtractions.name)).toBeInTheDocument();

        scope.done();
    });

    it("should call handleChange when search input changes in toolbar", async () => {
        const scope = mockApiGetSubtractions([subtractions]);
        renderWithRouter(<SubtractionList />, {}, history);
        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());

        const inputElement = screen.getByPlaceholderText("Name");
        expect(inputElement).toHaveValue("");

        await userEvent.type(inputElement, "Foo");
        expect(inputElement).toHaveValue("Foo");

        await userEvent.clear(inputElement);
        scope.done();
    });

    it("should render create button when [canModify=true]", async () => {
        const scope = mockApiGetSubtractions([subtractions]);
        const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
        mockAPIGetAccount(account);
        renderWithRouter(<SubtractionList />, {}, history);
        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());

        expect(await screen.findByLabelText("plus-square")).toBeInTheDocument();

        scope.done();
    });

    it("should not render create button when [canModify=false]", async () => {
        const scope = mockApiGetSubtractions([subtractions]);
        const account = createFakeAccount({ administrator_role: null });
        mockAPIGetAccount(account);
        renderWithRouter(<SubtractionList />, {}, history);
        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());

        const createButton = screen.queryByLabelText("plus-square");
        expect(createButton).toBeNull();

        scope.done();
    });

    it("should handle toolbar updates correctly", async () => {
        const scope = mockApiGetSubtractions([subtractions]);
        renderWithRouter(<SubtractionList />, {}, history);
        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());

        const inputElement = screen.getByPlaceholderText("Name");
        expect(inputElement).toHaveValue("");

        await userEvent.type(inputElement, "Foobar");
        expect(inputElement).toHaveValue("Foobar");
        expect(screen.getByPlaceholderText("Name")).toHaveValue("Foobar");

        expect(history.location.search).toEqual("?find=Foobar");

        scope.done();
    });
});
