import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiDeleteFile } from "@tests/fake/files";
import { renderWithProviders } from "@tests/setup";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FileItem, { FileItemProps } from "../FileItem.js";

vi.mock("../../../administration/utils.ts");

describe("<File />", () => {
    let props: FileItemProps;

    beforeEach(() => {
        props = {
            canDelete: true,
            id: "foo",
            name: "foo.fa",
            size: 10,
            uploaded_at: "2018-02-14T17:12:00.000000Z",
            user: { id: "bill", handle: "bill" },
        };
    });

    it("should render", () => {
        renderWithProviders(<FileItem {...props} />);

        expect(
            screen.getByText(new RegExp(props.user.handle)),
        ).toBeInTheDocument();
        expect(screen.getByText(new RegExp(props.name))).toBeInTheDocument();
        expect(screen.getByText("10.0 B")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "delete" }),
        ).toBeInTheDocument();
    });

    it("should render when [user=null]", () => {
        props.user = null;

        renderWithProviders(<FileItem {...props} />);

        expect(screen.getByText(new RegExp(props.name))).toBeInTheDocument();
        expect(screen.getByText("10.0 B")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "delete" }),
        ).toBeInTheDocument();
    });

    it("should have [props.onRemove] called when trash icon clicked", async () => {
        renderWithProviders(<FileItem {...props} />);

        const mockDeleteFileScope = mockApiDeleteFile(props.id);
        await userEvent.click(screen.getByRole("button", { name: "delete" }));
        mockDeleteFileScope.done();
        nock.cleanAll();
    });
});
