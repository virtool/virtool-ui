import { screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { createFakeSettings, mockApiGetSettings } from "../../../../tests/fake/admin";
import { renderWithProviders } from "../../../../tests/setupTests";
import Api from "../Api";

describe("<Api />", () => {
    it("should render", async () => {
        const settings = createFakeSettings();
        const scope = mockApiGetSettings(settings);
        renderWithProviders(<Api />);

        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());
        expect(screen.getByText("JSON API")).toBeInTheDocument();
        expect(screen.getByText(/Enable API access for clients other than Virtool./)).toBeInTheDocument();
        expect(screen.getByRole("checkbox")).toBeInTheDocument();

        scope.done();
    });

    it("should render when [onToggle=true]", async () => {
        const settings = createFakeSettings({ enable_api: true });
        const scope = mockApiGetSettings(settings);
        renderWithProviders(<Api />);

        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());
        expect(screen.getByRole("checkbox")).toHaveAttribute("data-state", "checked");

        scope.done();
    });

    it("should render when [onToggle=false]", async () => {
        const settings = createFakeSettings({ enable_api: false });
        const scope = mockApiGetSettings(settings);
        renderWithProviders(<Api />);

        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());
        expect(screen.getByRole("checkbox")).toHaveAttribute("data-state", "unchecked");

        scope.done();
    });
});
