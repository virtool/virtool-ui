import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    createFakeSettings,
    mockApiGetSettings,
    mockApiUpdateSettings,
} from "@tests/fake/administrator";
import { renderWithProviders } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import SampleSettings from "../SampleSettings";

describe("<SampleSettings />", () => {
    beforeEach(() => {
        mockApiGetSettings(createFakeSettings());
    });

    afterEach(() => nock.cleanAll());

    it("should render", async () => {
        renderWithProviders(<SampleSettings />);

        await waitFor(() =>
            expect(screen.getByText("Sample Settings")).toBeInTheDocument(),
        );

        expect(screen.getByText("Sample Group")).toBeInTheDocument();
        expect(screen.getByRole("radio", { name: /None/ })).toBeInTheDocument();
        expect(
            screen.getByRole("radio", { name: /Force choice/ }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("radio", { name: /User's primary group/ }),
        ).toBeInTheDocument();
        expect(screen.getByText("Group Rights")).toBeInTheDocument();
        expect(screen.getByLabelText("Group Rights")).toBeInTheDocument();
        expect(screen.getByText("All Users' Rights")).toBeInTheDocument();
        expect(screen.getByLabelText("All Users' Rights")).toBeInTheDocument();
    });

    it("should update settings when force choice is selected", async () => {
        const settings = createFakeSettings({ sample_group: "force_choice" });
        const scope = mockApiUpdateSettings(settings);
        renderWithProviders(<SampleSettings />);

        await waitFor(() =>
            expect(screen.getByText("Sample Settings")).toBeInTheDocument(),
        );
        await userEvent.click(
            screen.getByRole("radio", { name: /Force choice/ }),
        );

        scope.done();
    });

    it("should update settings when users primary group is selected", async () => {
        const settings = createFakeSettings({
            sample_group: "users_primary_group",
        });
        const scope = mockApiUpdateSettings(settings);
        renderWithProviders(<SampleSettings />);

        await waitFor(() =>
            expect(screen.getByText("Sample Settings")).toBeInTheDocument(),
        );
        await userEvent.click(
            screen.getByRole("radio", { name: /User's primary group/ }),
        );

        scope.done();
    });

    it("should update settings when group rights change", async () => {
        const settings = createFakeSettings({
            sample_group_read: true,
            sample_group_write: true,
        });
        const scope = mockApiUpdateSettings(settings);
        renderWithProviders(<SampleSettings />);

        await waitFor(() =>
            expect(screen.getByText("Sample Settings")).toBeInTheDocument(),
        );
        await userEvent.selectOptions(
            screen.getByLabelText("Group Rights"),
            "rw",
        );

        scope.done();
    });

    it("should update settings when all users rights change", async () => {
        const settings = createFakeSettings({
            sample_all_read: true,
            sample_all_write: true,
        });
        const scope = mockApiUpdateSettings(settings);
        renderWithProviders(<SampleSettings />);

        await waitFor(() =>
            expect(screen.getByText("Sample Settings")).toBeInTheDocument(),
        );
        await userEvent.selectOptions(
            screen.getByLabelText("All Users' Rights"),
            "rw",
        );

        scope.done();
    });
});
