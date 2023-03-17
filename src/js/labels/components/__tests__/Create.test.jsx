import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import React from "react";
import { describe, it } from "vitest";
import { CreateLabel } from "../Create";

describe("<CreateLabel>", () => {
    it("creates label with color", async () => {
        const scope = nock("http://localhost")
            .post("/api/labels", { name: "Foo", description: "This is a description", color: "#6B7280" })
            .reply(201, {
                id: 1,
                name: "Foo",
                description: "This is a description",
                color: "#6B7280"
            });

        renderWithProviders(<CreateLabel />);

        await userEvent.click(screen.getByRole("button", { name: "Create" }));

        const nameInput = screen.getByLabelText("Name");
        const descriptionInput = screen.getByLabelText("Description");

        await userEvent.type(descriptionInput, "This is a description");
        await userEvent.type(nameInput, "Foo");
        await userEvent.click(screen.getByRole("button", { name: "#6B7280" }));

        expect(descriptionInput).toHaveValue("This is a description");
        expect(nameInput).toHaveValue("Foo");

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        scope.isDone();
    });

    it("creates label without color", async () => {
        const scope = nock("http://localhost")
            .post("/api/labels", { name: "Foo", description: "This is a description", color: "#D1D5DB" })
            .reply(201, {
                id: 1,
                name: "Foo",
                description: "This is a description",
                color: "#D1D5DB"
            });

        renderWithProviders(<CreateLabel />);

        await userEvent.click(screen.getByRole("button", { name: "Create" }));

        const nameInput = screen.getByLabelText("Name");
        const descriptionInput = screen.getByLabelText("Description");

        await userEvent.type(descriptionInput, "This is a description");
        await userEvent.type(nameInput, "Foo");

        expect(descriptionInput).toHaveValue("This is a description");
        expect(nameInput).toHaveValue("Foo");

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        scope.isDone();
    });

    it("errors without name", async () => {
        renderWithProviders(<CreateLabel />);

        await userEvent.click(screen.getByRole("button", { name: "Create" }));

        expect(screen.queryByText("Name is required.")).not.toBeInTheDocument();

        await userEvent.type(screen.getByLabelText("Color"), "#1DAD57");
        await userEvent.type(screen.getByLabelText("Description"), "This is a description");
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.queryByText("Name is required.")).toBeInTheDocument();
    });

    it("errors with name conflict", async () => {
        const scope = nock("http://localhost")
            .post("/api/labels", { name: "Foo", description: "This is a description", color: "#D1D5DB" })
            .reply(400, {
                message: "Label name already exists."
            });

        renderWithProviders(<CreateLabel />);

        await userEvent.click(screen.getByRole("button", { name: "Create" }));

        expect(screen.queryByText("Label name already exists.")).not.toBeInTheDocument();

        await userEvent.type(screen.getByLabelText("Name"), "Foo");
        await userEvent.type(screen.getByLabelText("Description"), "This is a description");
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.queryByText("Label name already exists.")).toBeInTheDocument();

        scope.isDone();
    });
});
