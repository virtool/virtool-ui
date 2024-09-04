import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithMemoryRouter } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockApiCreateOTU } from "../../../../tests/fake/otus";
import CreateOTU from "../CreateOTU";

describe("<OTUForm />", () => {
    let props;

    beforeEach(() => {
        props = {
            refId: "foo",
            show: true,
            onHide: vi.fn(),
        };
    });

    it("should render", () => {
        renderWithMemoryRouter(<CreateOTU {...props} />, [{ state: { createOTU: true } }]);

        expect(screen.getByText("Create OTU")).toBeInTheDocument();
        expect(screen.getByLabelText("Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Abbreviation")).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render error once submitted with no name", async () => {
        renderWithMemoryRouter(<CreateOTU {...props} />, [{ state: { createOTU: true } }]);

        await userEvent.click(screen.getByRole("button"));
        expect(screen.getByText("Name required")).toBeInTheDocument();
    });

    it("should create OTU without abbreviation", async () => {
        const scope = mockApiCreateOTU(props.refId, "TestName", "");
        renderWithMemoryRouter(<CreateOTU {...props} />, [{ state: { createOTU: true } }]);

        await userEvent.type(screen.getByLabelText("Name"), "TestName");
        await userEvent.click(screen.getByRole("button"));

        scope.done();
    });

    it("should create OTU with abbreviation", async () => {
        const scope = mockApiCreateOTU(props.refId, "TestName", "TestAbbreviation");
        renderWithMemoryRouter(<CreateOTU {...props} />, [{ state: { createOTU: true } }]);

        await userEvent.type(screen.getByLabelText("Name"), "TestName");
        await userEvent.type(screen.getByLabelText("Abbreviation"), "TestAbbreviation");
        await userEvent.click(screen.getByRole("button"));

        scope.done();
    });
});
