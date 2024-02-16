import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeAccount, mockAPIGetAccount } from "../../../../../tests/fake/account";
import { createFakeFile, mockApiListFiles } from "../../../../../tests/fake/files";
import { mockApiListGroups } from "../../../../../tests/fake/groups";
import { createFakeLabelNested, mockApiGetLabels } from "../../../../../tests/fake/labels";
import { mockApiCreateSample } from "../../../../../tests/fake/samples";
import {
    createFakeShortlistSubtraction,
    mockApiGetShortlistSubtractions,
} from "../../../../../tests/fake/subtractions";
import { renderWithRouter } from "../../../../../tests/setupTests";
import { LibraryType } from "../../../types";
import CreateSample from "../CreateSample";

describe("<CreateSample>", () => {
    const readFileName = "large";
    const history = createBrowserHistory();
    const labels = [createFakeLabelNested()];
    const subtractionShortlist = createFakeShortlistSubtraction();

    beforeEach(() => {
        window.sessionStorage.clear();
        mockApiGetLabels(labels);
        mockAPIGetAccount(createFakeAccount({ primary_group: null }));
        mockApiListGroups([]);
    });

    afterEach(() => nock.cleanAll());

    const submitForm = () => userEvent.click(screen.getByRole("button", { name: "Create" }));

    async function inputFormRequirements(sampleName, files) {
        await userEvent.type(await screen.findByLabelText("Name"), sampleName);
        await userEvent.click(screen.getByText(files[0].name));
        await userEvent.click(screen.getByText(files[1].name));
    }

    it("should render", async () => {
        const file = createFakeFile();
        const filesScope = mockApiListFiles([file]);
        const subtractionsScope = mockApiGetShortlistSubtractions([]);
        renderWithRouter(<CreateSample />, {}, history);

        expect(await screen.findByText("Create Sample")).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Locale" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Isolate" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Host" })).toBeInTheDocument();

        expect(screen.getByText("Library Type")).toBeInTheDocument();
        expect(screen.getByText("Search against whole genome references using normal reads.")).toBeInTheDocument();
        expect(screen.getByText("Search against whole genome references using sRNA reads")).toBeInTheDocument();
        expect(screen.getByText("Search against barcode references using amplicon reads.")).toBeInTheDocument();

        expect(screen.getByRole("heading", { name: "Labels" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Default Subtractions" })).toBeInTheDocument();

        expect(screen.getByText(file.name)).toBeInTheDocument();

        filesScope.done();
        subtractionsScope.done();
    });

    it("should render LoadingPlaceholder when there are no subtractions", async () => {
        const file = createFakeFile();
        const filesScope = mockApiListFiles([file]);
        renderWithRouter(<CreateSample />, {}, history);

        expect(await screen.findByLabelText("loading")).toBeInTheDocument();

        filesScope.done();
    });

    it("should render LoadingPlaceholder when there are no sample files to read", async () => {
        const subtractionsScope = mockApiGetShortlistSubtractions([]);
        renderWithRouter(<CreateSample />, {}, history);

        expect(await screen.findByLabelText("loading")).toBeInTheDocument();

        subtractionsScope.done();
    });

    it("should fail to submit and show errors on empty submission", async () => {
        const file = createFakeFile();
        const filesScope = mockApiListFiles([file]);
        const subtractionsScope = mockApiGetShortlistSubtractions([]);
        renderWithRouter(<CreateSample />, {}, history);

        expect(await screen.findByText("Create Sample")).toBeInTheDocument();
        expect(screen.queryByText("Required Field")).not.toBeInTheDocument();
        expect(screen.queryByText("At least one read file must be attached to the sample")).not.toBeInTheDocument();

        await submitForm();

        expect(screen.getByText("Required Field")).toBeInTheDocument();
        expect(screen.getByText("At least one read file must be attached to the sample")).toBeInTheDocument();

        filesScope.done();
        subtractionsScope.done();
    });

    it("should submit when required fields are completed", async () => {
        const files = [createFakeFile(), createFakeFile()];
        const filesScope = mockApiListFiles(files);
        const subtractionsScope = mockApiGetShortlistSubtractions([]);
        const createSampleScope = mockApiCreateSample(
            "testSample",
            "",
            "",
            "",
            LibraryType.normal,
            [files[0].id, files[1].id],
            [],
            [],
            null,
        );
        renderWithRouter(<CreateSample />, {}, history);
        expect(await screen.findByText("Create Sample")).toBeInTheDocument();
        await inputFormRequirements("testSample", files);

        await submitForm();

        filesScope.done();
        subtractionsScope.done();
        createSampleScope.done();
    });

    it("should submit expected results when form is fully completed", async () => {
        const files = [createFakeFile(), createFakeFile()];
        const filesScope = mockApiListFiles(files);
        const subtractionsScope = mockApiGetShortlistSubtractions([subtractionShortlist]);
        const createSampleScope = mockApiCreateSample(
            "testSample",
            "testIsolate",
            "testHost",
            "testLocale",
            LibraryType.normal,
            [files[0].id, files[1].id],
            [],
            [subtractionShortlist.id],
            null,
        );
        renderWithRouter(<CreateSample />, {}, history);

        await inputFormRequirements("testSample", files);

        // Fill out the rest of the form and submit
        await userEvent.type(await screen.findByLabelText("Isolate"), "testIsolate");
        await userEvent.type(screen.getByLabelText("Host"), "testHost");
        await userEvent.type(screen.getByLabelText("Locale"), "testLocale");
        await userEvent.click(screen.getByRole("button", { name: "select default subtractions" }));
        await userEvent.click(screen.getByText(subtractionShortlist.name));
        await userEvent.click(screen.getByText("Normal"));

        await submitForm();

        filesScope.done();
        subtractionsScope.done();
        createSampleScope.done();
    });

    it("should include labels when submitting a completed form", async () => {
        const files = [createFakeFile(), createFakeFile()];
        const filesScope = mockApiListFiles(files);
        const subtractionsScope = mockApiGetShortlistSubtractions([subtractionShortlist]);
        const createSampleScope = mockApiCreateSample(
            "testSample",
            "testIsolate",
            "testHost",
            "testLocale",
            LibraryType.normal,
            [files[0].id, files[1].id],
            [labels[0].id],
            [subtractionShortlist.id],
            null,
        );
        renderWithRouter(<CreateSample />, {}, history);

        await inputFormRequirements("testSample", files);

        // Fill out the rest of the form and submit
        await userEvent.type(screen.getByLabelText("Isolate"), "testIsolate");
        await userEvent.type(screen.getByLabelText("Host"), "testHost");
        await userEvent.type(screen.getByLabelText("Locale"), "testLocale");
        await userEvent.click(screen.getByText("Normal"));
        await userEvent.click(screen.getByRole("button", { name: "select default subtractions" }));
        await userEvent.click(screen.getByText(subtractionShortlist.name));
        await userEvent.click(screen.getByRole("button", { name: "select labels" }));
        await userEvent.click(screen.getByText(labels[0].name));

        await submitForm();

        filesScope.done();
        subtractionsScope.done();
        createSampleScope.done();
    });

    it("should update the sample name when the magic icon is pressed", async () => {
        const file = createFakeFile({ name: "large.fastq.gz" });
        const filesScope = mockApiListFiles([file]);
        const subtractionsScope = mockApiGetShortlistSubtractions([{ name: "foo", ready: true, id: "test" }]);
        renderWithRouter(<CreateSample />, {}, history);

        const field = await screen.findByRole("textbox", { name: "Name" });
        expect(field).toHaveValue("");

        await userEvent.click(screen.getByText(file.name));
        await userEvent.click(screen.getByRole("button", { name: "Auto Fill" }));
        expect(field).toHaveValue(readFileName);

        filesScope.done();
        subtractionsScope.done();
    });

    it("should empty selections when clear button is clicked", async () => {
        const file = createFakeFile({ name: "large.fastq.gz" });
        const filesScope = mockApiListFiles([file]);
        const subtractionsScope = mockApiGetShortlistSubtractions([]);
        renderWithRouter(<CreateSample />, {}, history);

        expect(await screen.findByText("Create Sample")).toBeInTheDocument();

        await userEvent.click(screen.getByText(file.name));
        expect(screen.getByText("1 of 1 selected")).toBeInTheDocument();

        const clearButton = screen.getByRole("button", { name: "undo" });
        await userEvent.click(clearButton);
        expect(screen.getByText("0 of 1 selected")).toBeInTheDocument();

        filesScope.done();
        subtractionsScope.done();
    });

    it("should trigger file swap mutation when swap button is clicked", async () => {
        const files = [createFakeFile(), createFakeFile()];
        const filesScope = mockApiListFiles(files);
        const subtractionsScope = mockApiGetShortlistSubtractions([]);
        const createSampleScope = mockApiCreateSample(
            "testSample",
            "",
            "",
            "",
            LibraryType.normal,
            [files[1].id, files[0].id],
            [],
            [],
            null,
        );
        renderWithRouter(<CreateSample />, {}, history);

        await inputFormRequirements("testSample", files);
        expect(screen.getByText("2 of 2 selected")).toBeInTheDocument();

        const swapButton = screen.getByRole("button", { name: "retweet" });
        await userEvent.click(swapButton);

        await submitForm();

        filesScope.done();
        subtractionsScope.done();
        createSampleScope.done();
    });

    it("should render correct read orientations with 2 files are selected", async () => {
        const files = [createFakeFile(), createFakeFile()];
        const filesScope = mockApiListFiles(files);
        const subtractionsScope = mockApiGetShortlistSubtractions([{ name: "foo", ready: true, id: "test" }]);
        renderWithRouter(<CreateSample />, {}, history);

        await inputFormRequirements("Test", files);

        expect(screen.getByText("LEFT")).toBeInTheDocument();
        expect(screen.getByText("RIGHT")).toBeInTheDocument();

        filesScope.done();
        subtractionsScope.done();
    });

    it("should render correct read orientations with 1 file selected", async () => {
        const file = createFakeFile({ name: "large.fastq.gz" });
        const filesScope = mockApiListFiles([file]);
        const subtractionsScope = mockApiGetShortlistSubtractions([]);
        renderWithRouter(<CreateSample />, {}, history);

        expect(await screen.findByText("Create Sample")).toBeInTheDocument();

        await userEvent.click(screen.getByText(file.name));
        expect(screen.getByText("1 of 1 selected")).toBeInTheDocument();

        expect(screen.getByText("LEFT")).toBeInTheDocument();
        expect(screen.queryByText("RIGHT")).toBeNull();

        filesScope.done();
        subtractionsScope.done();
    });
});
