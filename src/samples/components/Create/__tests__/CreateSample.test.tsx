import { LibraryType } from "@samples/types";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiListGroups } from "@tests/api/groups";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { createFakeFile, mockApiListFiles } from "@tests/fake/files";
import { createFakeLabelNested, mockApiGetLabels } from "@tests/fake/labels";
import { mockApiCreateSample } from "@tests/fake/samples";
import {
    createFakeShortlistSubtraction,
    mockApiGetShortlistSubtractions,
} from "@tests/fake/subtractions";
import { renderWithRouter } from "@tests/setup";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import CreateSample from "../CreateSample";

describe("<CreateSample>", () => {
    const labels = [createFakeLabelNested()];
    const subtractionShortlist = createFakeShortlistSubtraction();

    beforeEach(() => {
        window.sessionStorage.clear();

        mockApiGetLabels(labels);
        mockApiGetAccount(createFakeAccount({ primary_group: null }));
        mockApiListGroups([]);
    });

    afterEach(() => nock.cleanAll());

    async function submitForm() {
        await userEvent.click(screen.getByRole("button", { name: "Create" }));
    }

    it("should show loader when there are no subtractions", async () => {
        const file = createFakeFile();
        const filesScope = mockApiListFiles([file]);

        renderWithRouter(<CreateSample />);
        expect(await screen.findByLabelText("loading")).toBeInTheDocument();

        filesScope.done();
    });

    it("should show loader when there are no sample uploads to read", async () => {
        renderWithRouter(<CreateSample />);
        expect(await screen.findByLabelText("loading")).toBeInTheDocument();
    });

    it("should fail and show errors on empty submission", async () => {
        const file = createFakeFile();

        mockApiListFiles([file]);
        mockApiGetShortlistSubtractions([]);

        renderWithRouter(<CreateSample />);

        expect(await screen.findByText("Create Sample")).toBeInTheDocument();
        expect(screen.queryByText("Required Field")).not.toBeInTheDocument();
        expect(
            screen.queryByText(
                "At least one read file must be attached to the sample",
            ),
        ).not.toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: "Create" }));

        expect(screen.getByText("Required Field")).toBeInTheDocument();
        expect(
            screen.getByText(
                "At least one read file must be attached to the sample",
            ),
        ).toBeInTheDocument();
    });

    it("should submit when minimum fields are completed", async () => {
        const file = createFakeFile();

        mockApiListFiles([file]);
        mockApiGetShortlistSubtractions([]);

        const scope = mockApiCreateSample(
            "Sample A",
            "",
            "",
            "",
            LibraryType.normal,
            [file.id],
            [],
            [],
            null,
        );

        renderWithRouter(<CreateSample />);

        // Wait for the data to load.
        expect(await screen.findByText("Create Sample")).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: "Reset" }));

        await userEvent.type(await screen.findByLabelText("Name"), "Sample A");
        await userEvent.click(screen.getByText(file.name));

        await submitForm();

        scope.done();
    });

    it("should submit when all form fields complete", async () => {
        const files = [createFakeFile(), createFakeFile()];

        mockApiListFiles(files);
        mockApiGetShortlistSubtractions([subtractionShortlist]);

        const scope = mockApiCreateSample(
            "Sample T",
            "Clone AB",
            "Apple",
            "Earth",
            LibraryType.normal,
            [files[0].id, files[1].id],
            [labels[0].id],
            [subtractionShortlist.id],
            null,
        );

        renderWithRouter(<CreateSample />);

        // Wait for the data to load.
        expect(await screen.findByText("Create Sample")).toBeInTheDocument();

        // Fill out main form.
        await userEvent.type(screen.getByLabelText("Name"), "Sample T");
        await userEvent.type(
            await screen.findByLabelText("Isolate"),
            "Clone AB",
        );
        await userEvent.type(screen.getByLabelText("Host"), "Apple");
        await userEvent.type(screen.getByLabelText("Locale"), "Earth");
        await userEvent.click(screen.getByText("Normal"));

        // Select Files
        await userEvent.click(screen.getByText(files[0].name));
        await userEvent.click(screen.getByText(files[1].name));

        // Select Labels
        await userEvent.click(
            screen.getByRole("button", { name: "select labels" }),
        );
        await userEvent.click(screen.getByText(labels[0].name));

        // Select Subtractions
        await userEvent.click(
            screen.getByRole("button", { name: "select default subtractions" }),
        );
        await userEvent.click(screen.getByText(subtractionShortlist.name));

        // Submit.
        await userEvent.click(screen.getByRole("button", { name: "Create" }));

        scope.done();
    });

    it("should be able to autofill the sample name", async () => {
        const file = createFakeFile({ name: "14T81.fq.gz" });

        mockApiListFiles([file]);
        mockApiGetShortlistSubtractions([
            { name: "foo", ready: true, id: "test" },
        ]);

        renderWithRouter(<CreateSample />);

        const field = await screen.findByRole("textbox", { name: "Name" });
        expect(field).toHaveValue("");

        await userEvent.click(screen.getByText(file.name));
        await userEvent.click(
            screen.getByRole("button", { name: "Auto Fill" }),
        );

        expect(field).toHaveValue("14T81");
    });

    it("should clear selections when reset button is clicked", async () => {
        const file = createFakeFile({ name: "large.fastq.gz" });

        mockApiListFiles([file]);
        mockApiGetShortlistSubtractions([]);

        renderWithRouter(<CreateSample />);

        expect(await screen.findByText("Create Sample")).toBeInTheDocument();

        await userEvent.click(screen.getByText(file.name));
        expect(screen.getByText("1 of 1 selected")).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: "Reset" }));
        expect(screen.getByText("0 of 1 selected")).toBeInTheDocument();
    });

    it("should be able to swap read orientation", async () => {
        const files = [createFakeFile(), createFakeFile()];

        mockApiListFiles(files);
        mockApiGetShortlistSubtractions([]);

        renderWithRouter(<CreateSample />);

        expect(await screen.findByText("Create Sample")).toBeInTheDocument();

        await userEvent.click(screen.getByText(files[0].name));
        await userEvent.click(screen.getByText(files[1].name));

        expect(screen.getByText("2 of 2 selected")).toBeInTheDocument();

        await userEvent.click(
            await screen.getByRole("button", { name: "Swap" }),
        );
    });

    it("should show correct read orientations", async () => {
        const files = [createFakeFile(), createFakeFile()];

        mockApiListFiles(files);
        mockApiGetShortlistSubtractions([
            { name: "foo", ready: true, id: "test" },
        ]);

        renderWithRouter(<CreateSample />);

        await userEvent.type(await screen.findByLabelText("Name"), "Sample B");

        expect(screen.queryByText("LEFT")).not.toBeInTheDocument();
        expect(screen.queryByText("RIGHT")).not.toBeInTheDocument();

        await userEvent.click(screen.getByText(files[0].name));

        expect(screen.queryByText("LEFT")).toBeInTheDocument();
        expect(screen.queryByText("RIGHT")).not.toBeInTheDocument();

        await userEvent.click(screen.getByText(files[1].name));

        expect(screen.queryByText("LEFT")).toBeInTheDocument();
        expect(screen.queryByText("RIGHT")).toBeInTheDocument();
    });

    it("should render correct read orientations with 1 file selected", async () => {
        const file = createFakeFile({ name: "large.fastq.gz" });
        mockApiListFiles([file]);
        mockApiGetShortlistSubtractions([]);
        renderWithRouter(<CreateSample />);

        expect(await screen.findByText("Create Sample")).toBeInTheDocument();

        await userEvent.click(screen.getByText(file.name));
        expect(screen.getByText("1 of 1 selected")).toBeInTheDocument();

        expect(screen.getByText("LEFT")).toBeInTheDocument();
        expect(screen.queryByText("RIGHT")).toBeNull();
    });
});
