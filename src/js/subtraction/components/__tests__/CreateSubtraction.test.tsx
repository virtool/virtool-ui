import { FileType } from "@files/types";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeFile, mockApiListFiles } from "@tests/fake/files";
import { renderWithMemoryRouter } from "@tests/setup";
import { getSessionStorage, setSessionStorage } from "@utils/utils";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { mockApiCreateSubtraction } from "../../../../tests/fake/subtractions";
import CreateSubtraction from "../CreateSubtraction";

describe("<CreateSubtraction />", () => {
    afterEach(() => {
        sessionStorage.clear();
    });

    beforeEach(() => {
        sessionStorage.clear();
    });

    it("should render when no files available", async () => {
        mockApiListFiles([]);
        renderWithMemoryRouter(<CreateSubtraction />, "?openCreateSubtraction=true");

        expect(await screen.findByText(/no files found/i)).toBeInTheDocument();
    });

    it("should render error when submitted with no name or file entered", async () => {
        const file = createFakeFile({ name: "subtraction.fq.gz", type: FileType.subtraction });
        mockApiListFiles([file]);
        renderWithMemoryRouter(<CreateSubtraction />, "?openCreateSubtraction=true");

        expect(await screen.findByText(file.name)).toBeInTheDocument();
        await userEvent.click(await screen.findByText(/save/i));

        expect(screen.getByText("A name is required")).toBeInTheDocument();
        expect(screen.getByText("Please select a file")).toBeInTheDocument();
    });

    it("should submit correct values when all fields selected", async () => {
        const file = createFakeFile({ name: "testsubtraction1", type: FileType.subtraction });
        const name = "testSubtractionname";
        const nickname = "testSubtractionNickname";

        mockApiListFiles([file]);
        const createSubtractionScope = mockApiCreateSubtraction(name, nickname, file.id);

        renderWithMemoryRouter(<CreateSubtraction />, "?openCreateSubtraction=true");

        await userEvent.type(await screen.findByLabelText("Name"), name);
        await userEvent.type(screen.getByLabelText("Nickname"), nickname);
        await userEvent.click(screen.getByText(/testsubtraction1/i));
        await userEvent.click(screen.getByText(/save/i));

        await waitFor(() => createSubtractionScope.done());
    });

    it("should restore form values from session storage", async () => {
        const file = createFakeFile({ name: "testSubtraction1", type: FileType.subtraction });
        const name = "testSubtractionName";
        const nickname = "testSubtractionNickname";

        setSessionStorage("createSubtractionFormValues", { name, nickname, uploadId: [file.id] });

        const createSubtractionScope = mockApiCreateSubtraction(name, nickname, file.id);
        mockApiListFiles([file]);

        renderWithMemoryRouter(<CreateSubtraction />, "?openCreateSubtraction=true");

        expect(await screen.findByDisplayValue(name)).toBeInTheDocument();
        expect(await screen.findByDisplayValue(nickname)).toBeInTheDocument();

        await userEvent.click(screen.getByText(/save/i));

        await waitFor(() => createSubtractionScope.done());
    });

    it("should persist values into session storage", async () => {
        const file = createFakeFile({ name: "ath.fa.gz", type: FileType.subtraction });
        const name = "Arabidopsis thaliana";
        const nickname = "Thale cress";

        mockApiListFiles([file]);
        const createSubtractionScope = mockApiCreateSubtraction(name, nickname, file.id);

        renderWithMemoryRouter(<CreateSubtraction />, "?openCreateSubtraction=true");

        await userEvent.type(await screen.findByLabelText("Name"), name);
        await userEvent.type(screen.getByLabelText("Nickname"), nickname);
        await userEvent.click(screen.getByText(/ath/i));

        expect(getSessionStorage("createSubtractionFormValues")).toEqual({ name, nickname, uploadId: [file.id] });

        await userEvent.click(screen.getByText(/save/i));
        await waitFor(() => createSubtractionScope.done());

        await waitFor(() =>
            expect(getSessionStorage("createSubtractionFormValues")).toEqual({ name: "", nickname: "", uploadId: [] }),
        );
    });
});
