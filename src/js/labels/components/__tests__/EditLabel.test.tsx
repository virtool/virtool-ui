import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../../tests/setupTests";
import { EditLabel } from "../EditLabel";

describe("<EditLabel>", () => {
    let props;

    beforeEach(() => {
        props = {
            id: 1,
            name: "Foo",
            description: "This is a description",
            color: "#1DAD57",
        };
    });

    it("edits label", async () => {
        const scope = nock("http://localhost")
            .patch("/api/labels/1")
            .reply(200, (uri, body) => body);

        renderWithProviders(<EditLabel {...props} />);

        await userEvent.click(screen.getByText("Edit"));

        const descriptionInput = screen.getByLabelText("Description");
        const nameInput = screen.getByLabelText("Name");

        // Field initialize from props.
        expect(nameInput).toHaveValue("Foo");
        expect(descriptionInput).toHaveValue("This is a description");

        // Check fields clear.
        await userEvent.clear(descriptionInput);
        await userEvent.clear(nameInput);
        expect(descriptionInput).toHaveValue("");
        expect(nameInput).toHaveValue("");

        // Check typing changes input value
        await userEvent.type(descriptionInput, "This is a label");
        await userEvent.type(nameInput, "Bar");

        expect(descriptionInput).toHaveValue("This is a label");
        expect(nameInput).toHaveValue("Bar");

        await userEvent.click(screen.getByText("Save"));

        scope.isDone();
    });
});
