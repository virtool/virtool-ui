import { configureStore } from "@reduxjs/toolkit";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeFile, mockApiListFiles } from "../../../../tests/fake/files";
import { renderWithProviders } from "../../../../tests/setupTests";
import { FileType } from "../../../files/types";
import CreateSubtraction from "../CreateSubtraction";
function routerRenderWithProviders(ui, store) {
    const routerUi = <BrowserRouter> {ui} </BrowserRouter>;
    return renderWithProviders(routerUi, store);
}

function createAppStore(state) {
    return () => {
        const mockReducer = state => {
            return state;
        };
        return configureStore({
            reducer: mockReducer,
            preloadedState: state,
        });
    };
}

describe("<CreateSubtraction />", () => {
    let state;

    beforeEach(() => {
        window.sessionStorage.clear();
        state = {
            forms: { formState: {} },
        };
    });

    it("should render when no files available", async () => {
        mockApiListFiles([]);
        routerRenderWithProviders(
            <BrowserRouter>
                <CreateSubtraction />
            </BrowserRouter>,
            createAppStore(state),
        );

        expect(await screen.findByText(/no files found/i)).toBeInTheDocument();
    });

    it("should render error when submitted with no name or file entered", async () => {
        const file = createFakeFile({ name: "subtraction.fq.gz", type: FileType.subtraction });
        mockApiListFiles([file]);
        routerRenderWithProviders(
            <BrowserRouter>
                <CreateSubtraction />
            </BrowserRouter>,
            createAppStore(state),
        );

        expect(await screen.findByText(file.name)).toBeInTheDocument();
        await userEvent.click(await screen.findByText(/save/i));

        expect(screen.getByText("A name is required")).toBeInTheDocument();
        expect(screen.getByText("Please select a file")).toBeInTheDocument();
    });

    it("should submit correct values when all fields selected", async () => {
        const file = createFakeFile({ name: "testsubtraction1", type: FileType.subtraction });
        mockApiListFiles([file]);
        routerRenderWithProviders(
            <BrowserRouter>
                <CreateSubtraction />
            </BrowserRouter>,
            createAppStore(state),
        );

        const name = "testSubtractionname";
        const nickname = "testSubtractionNickname";

        await userEvent.type(await screen.findByLabelText("Name"), name);
        await userEvent.type(screen.getByLabelText("Nickname"), nickname);
        await userEvent.click(screen.getByText(/testsubtraction1/i));
        await userEvent.click(screen.getByText(/save/i));
    });
});
