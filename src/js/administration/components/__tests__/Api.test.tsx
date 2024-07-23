import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it } from "vitest";
import { createFakeSettings, mockApiUpdateSettings } from "../../../../tests/fake/admin";
import { renderWithProviders } from "../../../../tests/setupTests";
import Api from "../Api";

describe("<Api />", () => {
    it("should render", async () => {
        const settings = createFakeSettings();
        renderWithProviders(<Api settings={settings} />);

        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());
        expect(screen.getByText("JSON API")).toBeInTheDocument();
        expect(screen.getByText(/Enable API access for clients other than Virtool./)).toBeInTheDocument();
        expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("should render when [onToggle=true]", async () => {
        const settings = createFakeSettings({ enable_api: true });
        const scope = mockApiUpdateSettings(settings);
        renderWithProviders(<Api settings={settings} />);

        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());
        await userEvent.click(screen.getByRole("checkbox"));
        expect(screen.getByRole("checkbox")).toBeChecked();

        scope.done();
    });

    it("should render when [onToggle=false]", async () => {
        const settings = createFakeSettings({ enable_api: false });
        const scope = mockApiUpdateSettings(settings);
        renderWithProviders(<Api settings={settings} />);

        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());
        await userEvent.click(screen.getByRole("checkbox"));
        expect(screen.getByRole("checkbox")).toHaveAttribute("data-state", "unchecked");

        scope.done();
    });
});
