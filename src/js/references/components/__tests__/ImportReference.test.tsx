import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import nock from "nock";
import React from "react";
import { describe, expect, it } from "vitest";
import { ImportReference } from "../ImportReference";

describe("<ImportReference />", () => {
    it("should upload file and import reference", async () => {
        const scope = nock("http://localhost");

        scope
            .post("/api/uploads?name=external.json.gz&type=reference")
            .reply(200, { id: 12, name: "external.json.gz", name_on_disk: "12-external.json.gz" });

        scope
            .post("/api/refs", {
                name: "External",
                description: "External reference",
                import_from: "12-external.json.gz",
            })
            .reply(201, { id: "foo", name: "External", description: "External reference" });

        renderWithProviders(<ImportReference />);

        await userEvent.upload(
            screen.getByLabelText("Upload file"),
            new File(['{"test": true}'], "external.json.gz", { type: "application/gzip" })
        );
        await userEvent.type(screen.getByLabelText("Name"), "External");
        await userEvent.type(screen.getByLabelText("Description"), "External reference");
        await userEvent.click(screen.getByRole("button", { name: "Import" }));

        expect(scope.isDone()).toBeTruthy();
    });

    it("should display errors when file or name missing", async () => {
        renderWithProviders(<ImportReference />);

        expect(screen.queryByText("A reference file must be uploaded")).not.toBeInTheDocument();
        expect(screen.queryByText("A name is required.")).not.toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: "Import" }));

        expect(screen.getByText("A reference file must be uploaded")).toBeInTheDocument();
        expect(screen.getByText("A name is required.")).toBeInTheDocument();
    });

    /**

    it("should render 'Uploading...' in upload bar when upload is incomplete", () => {
        props.file = { name: null, progress: 50, ready: false };
        renderWithProviders(<ImportReference {...props} />);
        expect(screen.getByText("Uploading...")).toBeInTheDocument();
    });

    it("should call onSubmit when a reference is uploaded and name textbox is populated", async () => {
        const { rerender } = renderWithProviders(<ImportReference {...props} />);

        const file = new File(["test"], "external.json.gz", { type: "application/gzip" });
        await userEvent.upload(screen.getByLabelText("Upload file"), file);
        expect(props.onDrop).toHaveBeenCalledWith(expect.stringMatching(/^.{8}$/), file, "reference");

        props.file = { id: 1, name: "external.json.gz", progress: 100, ready: true };
        rerender(<ImportReference {...props} />);
        expect(screen.getByText("external.json.gz")).toBeInTheDocument();

        const name = "External";
        const description = "An externally sourced reference.";

        await userEvent.type(screen.getByRole("textbox", { name: "Name" }), name);
        await userEvent.type(screen.getByRole("textbox", { name: "Description" }), description);
        await userEvent.click(screen.getByRole("button", { name: "Import" }));

        await waitFor(() => expect(props.onSubmit).toHaveBeenCalledWith(name, description, "1-external.json.gz"));
    });

     **/
});
