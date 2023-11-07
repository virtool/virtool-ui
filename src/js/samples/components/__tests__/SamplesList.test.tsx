import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import nock from "nock";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { createFakeAccount, mockGetAccountAPI } from "../../../../tests/fake/account";
import { mockCreateSample } from "../../../../tests/fake/sample";
import { renderWithRouter } from "../../../../tests/setupTests";
import { AdministratorRoles } from "../../../administration/types";
import SamplesList from "../SamplesList";
import SamplesToolbar from "../SamplesToolbar";

describe("<SamplesList />", () => {
    const history = createBrowserHistory();
    const props = {
        onChange: vi.fn(),
        term: "",
    };

    beforeEach(() => {
        mockCreateSample();
        nock("http://localhost").get("/api/labels").query(true).reply(200, { labels: [] });
    });

    it("should render correctly", async () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ key: "test", pathname: "/samples" }]}>
                <SamplesList />
            </MemoryRouter>,
            {},
            history,
        );
        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());

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
        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());

        const inputElement = screen.getByPlaceholderText("Sample name");
        expect(inputElement).toHaveValue("");

        await userEvent.type(inputElement, "Foo");
        expect(inputElement).toHaveValue("Foo");
    });

    it("should render create button when [canModify=true]", async () => {
        const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
        mockGetAccountAPI(account);
        renderWithRouter(<SamplesToolbar {...props} />, {}, history);

        expect(await screen.findByLabelText("create")).toBeInTheDocument();
    });

    it("should not render create button when [canModify=false]", () => {
        const account = createFakeAccount({ administrator_role: null });
        mockGetAccountAPI(account);

        renderWithRouter(<SamplesToolbar {...props} />, {}, history);

        const createButton = screen.queryByLabelText("create");
        expect(createButton).toBeNull();
    });
});
