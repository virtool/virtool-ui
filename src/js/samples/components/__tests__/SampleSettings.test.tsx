import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeSettings, mockApiGetSettings, mockApiUpdateSettings } from "../../../../tests/fake/admin";
import { renderWithProviders } from "../../../../tests/setupTests";
import SampleSettings from "../SampleSettings";

describe("<SampleSettings />", () => {
    beforeEach(() => {
        mockApiGetSettings(createFakeSettings());
    });

    afterEach(() => nock.cleanAll());

    it("should render", async () => {
        renderWithProviders(<SampleSettings />);

        await waitFor(() => expect(screen.getByText("Sample Settings")).toBeInTheDocument());

        expect(screen.getByText("Sample Group")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /None/ })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Force choice/ })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /User's primary group/ })).toBeInTheDocument();
        expect(screen.getByText("Group Rights")).toBeInTheDocument();
        expect(screen.getByRole("combobox", { name: "group" })).toBeInTheDocument();
        expect(screen.getByText("All Users' Rights")).toBeInTheDocument();
        expect(screen.getByRole("combobox", { name: "all" })).toBeInTheDocument();
    });

    it("should call update settings mutator when none SelectBox is clicked", async () => {
        const settings = createFakeSettings({ sample_group: "none" });
        const scope = mockApiUpdateSettings(settings);
        renderWithProviders(<SampleSettings />);

        await waitFor(() => expect(screen.getByText("Sample Settings")).toBeInTheDocument());
        await userEvent.click(screen.getByRole("button", { name: /None/ }));

        scope.done();
    });

    it("should call update settings mutator when force choice SelectBox is clicked", async () => {
        const settings = createFakeSettings({ sample_group: "force_choice" });
        const scope = mockApiUpdateSettings(settings);
        renderWithProviders(<SampleSettings />);

        await waitFor(() => expect(screen.getByText("Sample Settings")).toBeInTheDocument());
        await userEvent.click(screen.getByRole("button", { name: /Force choice/ }));

        scope.done();
    });

    it("should call update settings mutator when users primary group SelectBox is clicked", async () => {
        const settings = createFakeSettings({ sample_group: "users_primary_group" });
        const scope = mockApiUpdateSettings(settings);
        renderWithProviders(<SampleSettings />);

        await waitFor(() => expect(screen.getByText("Sample Settings")).toBeInTheDocument());
        await userEvent.click(screen.getByRole("button", { name: /User's primary group/ }));

        scope.done();
    });

    it("should call update settings mutator when group input changes", async () => {
        const settings = createFakeSettings({ sample_group_read: true, sample_group_write: true });
        const scope = mockApiUpdateSettings(settings);
        renderWithProviders(<SampleSettings />);

        await waitFor(() => expect(screen.getByText("Sample Settings")).toBeInTheDocument());
        await userEvent.selectOptions(screen.getByRole("combobox", { name: "group" }), "rw");

        scope.done();
    });

    it("should call update settings mutator when all input changes", async () => {
        const settings = createFakeSettings({ sample_all_read: true, sample_all_write: true });
        const scope = mockApiUpdateSettings(settings);
        renderWithProviders(<SampleSettings />);

        await waitFor(() => expect(screen.getByText("Sample Settings")).toBeInTheDocument());
        await userEvent.selectOptions(screen.getByRole("combobox", { name: "all" }), "rw");

        scope.done();
    });
});
