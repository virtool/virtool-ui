import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockApiDeleteFile } from "../../../../tests/fake/files";
import { renderWithProviders } from "../../../../tests/setupTests";
import { File } from "../File";

vi.mock("../../../administration/utils.ts");

describe("<File />", () => {
    let props;

    beforeEach(() => {
        props = {
            canRemove: true,
            id: "foo",
            name: "foo.fa",
            size: 10,
            uploaded_at: "2018-02-14T17:12:00.000000Z",
            user: { id: "bill", handle: "bill" },
            ready: true,
        };
    });

    it("should render", () => {
        renderWithProviders(<File {...props} />);
        expect(screen.getByText(new RegExp(props.user.handle))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(props.name))).toBeInTheDocument();
        expect(screen.getByText("10.0B")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "delete" })).toBeInTheDocument();
    });

    it("should render when [ready=false]", () => {
        props.ready = false;
        renderWithProviders(<File {...props} />);
        expect(screen.getByText(new RegExp(props.user.handle))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(props.name))).toBeInTheDocument();
        expect(screen.queryByText("10.0B")).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "delete" })).not.toBeInTheDocument();
    });

    it("should render when [user=null]", () => {
        props.user = null;
        renderWithProviders(<File {...props} />);
        expect(screen.getByText(new RegExp(props.name))).toBeInTheDocument();
        expect(screen.getByText("10.0B")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "delete" })).toBeInTheDocument();
    });

    it("should render when [canRemove=false]", () => {
        props.canRemove = false;
        renderWithProviders(<File {...props} />);
        expect(screen.getByText(new RegExp(props.user.handle))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(props.name))).toBeInTheDocument();
        expect(screen.getByText("10.0B")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "delete" })).not.toBeInTheDocument();
    });

    it("should have [props.onRemove] called when trash icon clicked", async () => {
        renderWithProviders(<File {...props} />);
        const mockDeleteFileScope = mockApiDeleteFile(props.id);
        await userEvent.click(screen.getByRole("button", { name: "delete" }));
        mockDeleteFileScope.done();
        nock.cleanAll();
    });
});
