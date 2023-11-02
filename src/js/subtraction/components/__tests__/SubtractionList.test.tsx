import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import nock from "nock";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { createFakeAccount, mockGetAccountAPI } from "../../../../tests/fake/account";
import { renderWithRouter } from "../../../../tests/setupTests";
import { AdministratorRoles } from "../../../administration/types";
import SubtractionList from "../SubtractionList";
import SubtractionToolbar from "../SubtractionToolbar";

const subtractions = {
    documents: [{ id: "foo", name: "bar", user: { handle: "test" } }],
    total_count: 1,
};

describe("<SubtractionList />", () => {
    const history = createBrowserHistory();
    const props = {
        term: "",
        handleChange: vi.fn(),
    };

    it("renders correctly", async () => {
        const scope = nock("http://localhost").get("/api/subtractions").query(true).reply(200, subtractions);
        renderWithRouter(<SubtractionList />, {}, history);
        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());
        const subtractionHeader = screen.getByText("Subtractions");
        expect(subtractionHeader).toBeInTheDocument();

        const subtractionCount = screen.getByText("1");
        expect(subtractionCount).toBeInTheDocument();

        const document = screen.getByText("bar");
        expect(document).toBeInTheDocument();

        scope.isDone();
    });

    it("should call handleChange when search input changes in toolbar", async () => {
        const scope = nock("http://localhost").get("/api/subtractions").query(true).reply(200, subtractions);
        renderWithRouter(<SubtractionList />, {}, history);
        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());

        const inputElement = screen.getByPlaceholderText("Name");
        expect(inputElement).toHaveValue("");

        await userEvent.type(inputElement, "Foo");
        expect(inputElement).toHaveValue("Foo");

        scope.isDone();
    });

    it("should render create button when [canModify=true]", async () => {
        const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
        mockGetAccountAPI(account);
        renderWithRouter(<SubtractionToolbar {...props} />, {}, history);

        expect(await screen.findByLabelText("plus-square")).toBeInTheDocument();
    });

    it("should not render create button when [canModify=false]", () => {
        const account = createFakeAccount({ administrator_role: null });
        mockGetAccountAPI(account);

        renderWithRouter(<SubtractionToolbar {...props} />, {}, history);

        const createButton = screen.queryByLabelText("plus-square");
        expect(createButton).toBeNull();
    });
});
