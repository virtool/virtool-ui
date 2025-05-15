import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiGetGroup, mockApiListGroups } from "@tests/api/groups";
import { createFakeGroup } from "@tests/fake/groups";
import { createFakePermissions } from "@tests/fake/permissions";
import { renderWithRouter } from "@tests/setup";
import React from "react";
import { describe, expect, it } from "vitest";
import Groups from "../Groups";

describe("Groups", () => {
    it("should render correctly when loading = true", () => {
        renderWithRouter(<Groups />);

        expect(screen.queryByText("No Groups Found")).not.toBeInTheDocument();
        expect(screen.queryByText("cancel_job")).not.toBeInTheDocument();
        expect(screen.queryByText("No Group Members")).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Delete" }),
        ).not.toBeInTheDocument();
    });

    it("should render correctly when no groups exist", async () => {
        mockApiListGroups([]);
        renderWithRouter(<Groups />);

        expect(await screen.findByText("No Groups Found")).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Delete" }),
        ).not.toBeInTheDocument();
        expect(screen.getByText("Create")).toBeInTheDocument();
    });

    it("should render correctly when one groups exists and group contains no members", async () => {
        const group = createFakeGroup();
        mockApiListGroups([group]);
        mockApiGetGroup(group);
        renderWithRouter(<Groups />);

        expect(
            await screen.findByRole("button", { name: "Delete" }),
        ).toBeInTheDocument();
        expect(screen.queryByText("No groups found")).not.toBeInTheDocument();
        expect(screen.getByText("cancel_job")).toBeInTheDocument();
        expect(screen.getByText("No Group Members")).toBeInTheDocument();
        expect(screen.getAllByText(group.name)).toHaveLength(1);
        expect(screen.getByRole("textbox", { name: "name" })).toHaveValue(
            group.name,
        );
    });

    it("should render create new group view correctly", async () => {
        mockApiListGroups([]);
        renderWithRouter(<Groups />);

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        await userEvent.click(await screen.findByText("Create"));

        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Save" }),
        ).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "" })).toBeInTheDocument();
    });

    it("should render correctly when active group has a group member", async () => {
        const group = createFakeGroup({
            users: [{ handle: "testUser1", id: "test_id" }],
        });
        mockApiListGroups([group]);
        mockApiGetGroup(group);
        renderWithRouter(<Groups />);

        expect(await screen.findByText("Members")).toBeInTheDocument();
        expect(screen.getByText("testUser1")).toBeInTheDocument();
        expect(screen.queryByText("No Group Members")).not.toBeInTheDocument();
    });

    it("should render correctly when more than one group exists", async () => {
        const group1 = createFakeGroup({
            users: [{ handle: "bob", id: "abcd1234" }],
            permissions: createFakePermissions({
                create_sample: true,
                modify_hmm: true,
            }),
            name: "Group 1",
        });
        const group2 = createFakeGroup({
            users: [{ handle: "testUser2", id: "test_id2" }],
            permissions: createFakePermissions({
                create_sample: true,
                modify_hmm: true,
                remove_job: true,
            }),
            name: "Group 2",
        });

        mockApiListGroups([group1, group2]);
        mockApiGetGroup(group1);

        renderWithRouter(<Groups />);

        expect(await screen.findByText("Group 1")).toBeInTheDocument();
        expect(screen.getByText("Group 2")).toBeInTheDocument();
        expect(screen.getByText("bob")).toBeInTheDocument();
    });
});
