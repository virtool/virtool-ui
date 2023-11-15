import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import nock from "nock";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { createFakeAccount, mockGetAccountAPI } from "../../../../tests/fake/account";
import { mockCreateSample } from "../../../../tests/fake/sample";
import { renderWithRouter } from "../../../../tests/setupTests";
import { AdministratorRoles } from "../../../administration/types";
import SamplesList from "../SamplesList";

describe("<SamplesList />", () => {
    const history = createBrowserHistory();

    beforeEach(() => {
        mockCreateSample();
        nock("http://localhost").get("/api/labels").reply(200, []);
    });

    it("should render correctly", async () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ key: "test", pathname: "/samples" }]}>
                <SamplesList />
            </MemoryRouter>,
            {},
            history,
        );
        expect(await screen.findByText("Samples")).toBeInTheDocument();

        expect(screen.getByText("sample1")).toBeInTheDocument();
        expect(screen.getByText("Normal")).toBeInTheDocument();
    });

    it("should call onChange when search input changes in toolbar", async () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ key: "test", pathname: "/samples" }]}>
                <SamplesList />
            </MemoryRouter>,
            {},
            history,
        );
        expect(await screen.findByText("Samples")).toBeInTheDocument();

        const inputElement = screen.getByPlaceholderText("Sample name");
        expect(inputElement).toHaveValue("");

        await userEvent.type(inputElement, "Foo");
        expect(inputElement).toHaveValue("Foo");
    });

    it("should render create button when [canModify=true]", async () => {
        const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
        mockGetAccountAPI(account);
        renderWithRouter(<SamplesList />, {}, history);

        expect(await screen.findByLabelText("create")).toBeInTheDocument();
    });

    it("should not render create button when [canModify=false]", async () => {
        const account = createFakeAccount({ administrator_role: null });
        mockGetAccountAPI(account);

        renderWithRouter(<SamplesList />, {}, history);

        const createButton = screen.queryByLabelText("create");
        expect(createButton).toBeNull();
    });
});
