import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeFile, mockApiListFiles } from "../../../../../tests/fake/files";
import { mockApiCreateSample } from "../../../../../tests/fake/samples";
import { renderWithRouter } from "../../../../../tests/setupTests";
import CreateSample from "../CreateSample";

describe("<CreateSample>", () => {
    const readFileName = "large";
    let values;
    const history = createBrowserHistory();

    beforeEach(() => {
        window.sessionStorage.clear();
        nock("http://localhost")
            .get("/api/labels")
            .query(true)
            .reply(200, [
                { color: "#C4B5FD", description: "", id: 1, name: "test" },
                { color: "#FCA5A5", description: "", id: 2, name: "label" },
                { color: "#1D4ED8", description: "", id: 3, name: "bar" },
            ]);
        nock("http://localhost").get("/api/settings").reply(200, []);
        nock("http://localhost").get("/api/groups").reply(200, []);
        values = {
            name: "Sample 1",
            selected: ["abc123-Foo.fq.gz", "789xyz-Bar.fq.gz"],
            host: "Host",
            isolate: "Isolate",
            locale: "Timbuktu",
            subtractionId: "sub_bar",
            libraryType: "sRNA",
        };
    });

    const submitForm = () => userEvent.click(screen.getByRole("button", { name: "save" }));

    async function inputFormRequirements(sampleName = "Name", files) {
        await userEvent.type(await screen.findByLabelText("Name"), sampleName);
        await userEvent.click(screen.getByText(files[0].name));
        await userEvent.click(screen.getByText(files[1].name));
    }

    it("should render", async () => {
        const file = createFakeFile();
        mockApiListFiles([file]);
        nock("http://localhost").get("/api/subtractions?short=true").reply(200, []);
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
    });

    it("should render LoadingPlaceholder when there are no subtractions", async () => {
        const file = createFakeFile();
        mockApiListFiles([file]);
        renderWithRouter(<CreateSample />, {}, history);

        expect(await screen.findByLabelText("loading")).toBeInTheDocument();
    });

    it("should render LoadingPlaceholder when there are no sample files to read", async () => {
        nock("http://localhost").get("/api/subtractions?short=true").reply(200, []);
        renderWithRouter(<CreateSample />, {}, history);

        expect(await screen.findByLabelText("loading")).toBeInTheDocument();
    });

    it("should fail to submit and show errors on empty submission", async () => {
        const file = createFakeFile();
        mockApiListFiles([file]);
        nock("http://localhost").get("/api/subtractions?short=true").reply(200, []);
        renderWithRouter(<CreateSample />, {}, history);

        expect(await screen.findByText("Create Sample")).toBeInTheDocument();
        expect(screen.queryByText("Required Field")).not.toBeInTheDocument();
        expect(screen.queryByText("At least one read file must be attached to the sample")).not.toBeInTheDocument();

        await submitForm();

        expect(screen.getByText("Required Field")).toBeInTheDocument();
        expect(screen.getByText("At least one read file must be attached to the sample")).toBeInTheDocument();
    });

    it("should submit when required fields are completed", async () => {
        const files = [createFakeFile(), createFakeFile()];
        mockApiListFiles(files);
        nock("http://localhost").get("/api/subtractions?short=true").reply(200, []);
        mockApiCreateSample(values.name, "", "", "", [], [], [files[0].id, files[1].id], "normal");
        renderWithRouter(<CreateSample />, {}, history);

        expect(await screen.findByText("Create Sample")).toBeInTheDocument();
        await inputFormRequirements(values.name, files);

        await submitForm();
        nock.cleanAll();
    });

    it("should submit expected results when form is fully completed", async () => {
        const { name, isolate, host, locale, libraryType } = values;

        const files = [createFakeFile(), createFakeFile()];
        mockApiListFiles(files);
        nock("http://localhost")
            .get("/api/subtractions?short=true")
            .reply(200, [{ name: "foo", ready: true, id: "test" }]);
        mockApiCreateSample(name, isolate, host, locale, ["test"], [], [files[0].id, files[1].id], libraryType);
        renderWithRouter(<CreateSample />, {}, history);

        await inputFormRequirements(name, files);

        // Fill out the rest of the form and submit
        await userEvent.type(await screen.findByLabelText("Isolate"), isolate);
        await userEvent.type(screen.getByLabelText("Host"), host);
        await userEvent.type(screen.getByLabelText("Locale"), locale);
        await userEvent.click(screen.getByRole("button", { name: "select default subtractions" }));
        await userEvent.click(screen.getByText("foo"));
        await userEvent.click(screen.getByText(libraryType));

        await submitForm();
        nock.cleanAll();
    });

    it("should include labels when submitting a completed form", async () => {
        const { name, isolate, host, locale, libraryType } = values;

        const files = [createFakeFile(), createFakeFile()];
        mockApiListFiles(files);
        nock("http://localhost")
            .get("/api/subtractions?short=true")
            .reply(200, [{ name: "foo", ready: true, id: "test" }]);
        mockApiCreateSample(name, isolate, host, locale, ["test"], [2], [files[0].id, files[1].id], libraryType);
        renderWithRouter(<CreateSample />, {}, history);

        await inputFormRequirements(name, files);

        // Fill out the rest of the form and submit
        await userEvent.type(screen.getByLabelText("Isolate"), isolate);
        await userEvent.type(screen.getByLabelText("Host"), host);
        await userEvent.type(screen.getByLabelText("Locale"), locale);
        await userEvent.click(screen.getByText(libraryType));
        await userEvent.click(screen.getByRole("button", { name: "select default subtractions" }));
        await userEvent.click(screen.getByText("foo"));
        await userEvent.click(screen.getByRole("button", { name: "select labels" }));
        await userEvent.click(screen.getByText("label"));

        await submitForm();
        nock.cleanAll();
    });

    it("should update the sample name when the magic icon is pressed", async () => {
        const file = createFakeFile({ name: "large.fastq.gz" });
        mockApiListFiles([file]);
        nock("http://localhost")
            .get("/api/subtractions?short=true")
            .reply(200, [{ name: "foo", ready: true, id: "test" }]);
        renderWithRouter(<CreateSample />, {}, history);

        const field = await screen.findByRole("textbox", { name: /Name/i });
        expect(field).toHaveValue("");

        await userEvent.click(screen.getByText(file.name));
        await userEvent.click(screen.getByRole("button", { name: "Auto Fill" }));
        expect(field).toHaveValue(readFileName);
    });

    it("should empty selections when clear button is clicked", async () => {
        const file = createFakeFile({ name: "large.fastq.gz" });
        mockApiListFiles([file]);
        nock("http://localhost").get("/api/subtractions?short=true").reply(200, []);
        renderWithRouter(<CreateSample />, {}, history);

        expect(await screen.findByText("Create Sample")).toBeInTheDocument();

        await userEvent.click(screen.getByText(file.name));
        expect(screen.getByText("1 of 1 selected")).toBeInTheDocument();

        const clearButton = screen.getByRole("button", { name: "undo" });
        await userEvent.click(clearButton);
        expect(screen.getByText("0 of 1 selected")).toBeInTheDocument();

        nock.cleanAll();
    });

    it("should trigger file swap mutation when swap button is clicked", async () => {
        const files = [createFakeFile(), createFakeFile()];
        mockApiListFiles(files);
        nock("http://localhost")
            .get("/api/subtractions?short=true")
            .reply(200, [{ name: "foo", ready: true, id: "test" }]);
        mockApiCreateSample(values.name, "", "", "", [], [], [files[1].id, files[0].id], "normal");
        renderWithRouter(<CreateSample />, {}, history);

        await inputFormRequirements(values.name, files);
        expect(screen.getByText("2 of 2 selected")).toBeInTheDocument();

        const swapButton = screen.getByRole("button", { name: "retweet" });
        await userEvent.click(swapButton);

        await submitForm();
        nock.cleanAll();
    });

    it("should render correct read orientations with 2 files are selected", async () => {
        const files = [createFakeFile(), createFakeFile()];
        mockApiListFiles(files);
        nock("http://localhost")
            .get("/api/subtractions?short=true")
            .reply(200, [{ name: "foo", ready: true, id: "test" }]);
        renderWithRouter(<CreateSample />, {}, history);

        await inputFormRequirements(values.name, files);

        expect(screen.getByText("LEFT")).toBeInTheDocument();
        expect(screen.getByText("RIGHT")).toBeInTheDocument();
    });

    it("should render correct read orientations with 1 file selected", async () => {
        const file = createFakeFile({ name: "large.fastq.gz" });
        mockApiListFiles([file]);
        nock("http://localhost").get("/api/subtractions?short=true").reply(200, []);
        renderWithRouter(<CreateSample />, {}, history);

        expect(await screen.findByText("Create Sample")).toBeInTheDocument();

        await userEvent.click(screen.getByText(file.name));
        expect(screen.getByText("1 of 1 selected")).toBeInTheDocument();

        expect(screen.getByText("LEFT")).toBeInTheDocument();
        expect(screen.queryByText("RIGHT")).toBeNull();
    });
});
