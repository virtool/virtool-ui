import { configureStore } from "@reduxjs/toolkit";
import { screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { createFakeAccount, mockGetAccountAPI } from "../../../../tests/fake/account";
import { createFakeFile, mockApiListFiles } from "../../../../tests/fake/files";
import { createFakeSubtractions, mockApiGetSubtractions } from "../../../../tests/fake/subtractions";
import { renderWithProviders } from "../../../../tests/setupTests";
import { AdministratorRoles } from "../../../administration/types";
import Subtraction from "../Subtraction";

function createAppStore(state) {
    return () =>
        configureStore({
            reducer: state => state,
            preloadedState: state,
        });
}

describe("<Subtraction />", () => {
    const history = createMemoryHistory();
    const state = {
        account: { administrator_role: AdministratorRoles.FULL },
    };

    it("should render /subtractions route", async () => {
        history.push("/subtractions");

        const subtractions = createFakeSubtractions();
        mockApiGetSubtractions([subtractions]);
        renderWithProviders(
            <MemoryRouter initialEntries={[{ pathname: history.location.pathname }]}>
                <Subtraction />
            </MemoryRouter>,
            createAppStore(state),
        );

        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());
        expect(screen.getByText("Subtractions")).toBeInTheDocument();
    });

    it("should render /subtractions/files route", async () => {
        history.push("/subtractions/files");

        const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
        mockGetAccountAPI(account);
        const file = createFakeFile({ name: "subtraction.fq.gz" });
        mockApiListFiles([file]);
        renderWithProviders(
            <MemoryRouter initialEntries={[{ pathname: history.location.pathname }]}>
                <Subtraction />
            </MemoryRouter>,
            createAppStore(state),
        );

        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());
        expect(screen.getByText("Subtraction Files")).toBeInTheDocument();
    });

    it("should render /subtractions/create route", async () => {
        history.push("/subtractions/create");

        mockApiListFiles([]);
        renderWithProviders(
            <MemoryRouter initialEntries={[{ pathname: history.location.pathname }]}>
                <Subtraction />
            </MemoryRouter>,
            createAppStore(state),
        );

        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());
        expect(screen.getByText("Create Subtraction")).toBeInTheDocument();
    });

    it("should render /subtractions/:subtractionId route", async () => {
        const subtractions = createFakeSubtractions();
        history.push(`/subtractions/${subtractions.id}`);
        mockApiGetSubtractions([subtractions]);
        renderWithProviders(
            <MemoryRouter initialEntries={[{ pathname: history.location.pathname }]}>
                <Subtraction />
            </MemoryRouter>,
            createAppStore(state),
        );

        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());
        expect(screen.getByText("Files")).toBeInTheDocument();
    });
});
