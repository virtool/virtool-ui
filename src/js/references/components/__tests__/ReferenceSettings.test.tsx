import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import nock from "nock";
import React from "react";
import { expect, test } from "vitest";
import { ReferenceSettings } from "../ReferenceSettings";

const settings = {
    default_source_types: ["Clone", "Genotype"],
    enable_api: true,
    enable_sentry: true,
    hmm_slug: "virtool/virtool-hmm",
    minimum_password_length: 9,
    sample_all_read: true,
    sample_all_write: true,
    sample_group: null,
    sample_group_read: true,
    sample_group_write: true,
};

function createNockScope() {
    const scope = nock("http://localhost");

    scope.get("/api/settings").reply(200, settings);

    return scope;
}

test("GlobalSourceTypes", async () => {
    const scope = createNockScope();

    renderWithProviders(<ReferenceSettings />);

    // Wait for initial request to complete.
    await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());

    expect(screen.getByText("Clone")).toBeInTheDocument();
    expect(screen.getByText("Genotype")).toBeInTheDocument();

    // Delete 'Clone'.
    scope.patch("/api/settings", { default_source_types: ["Genotype"] }).reply(200, {
        ...settings,
        default_source_types: ["Genotype"],
    });

    scope.get("/api/settings").reply(200, { ...settings, default_source_types: ["Genotype"] });

    await userEvent.click((await screen.findAllByRole("button", { name: "remove" }))[0]);

    await waitFor(() => {
        expect(screen.queryByText("The source type was just removed", { exact: false })).toBeInTheDocument();
        expect(screen.queryAllByText("Clone")).toHaveLength(1);
    });

    // Undo deletion.
    scope.patch("/api/settings", { default_source_types: ["Genotype", "Clone"] }).reply(200, () => {
        return { ...settings, default_source_types: ["Genotype", "Clone"] };
    });
    scope.get("/api/settings").reply(200, settings);

    await userEvent.click(screen.getByRole("button", { name: "undo" }));

    await waitFor(() => {
        expect(screen.queryByText("The source type was just removed", { exact: false })).not.toBeInTheDocument();
        expect(screen.queryAllByText("Clone")).toHaveLength(1);
    });

    // Add new source type 'Strain'.
    await userEvent.type(screen.getByRole("textbox"), "Strain");

    expect(screen.getByRole("textbox")).toHaveValue("Strain");

    scope.patch("/api/settings", { default_source_types: ["Clone", "Genotype", "strain"] }).reply(200, () => {
        return { ...settings, default_source_types: ["Clone", "Genotype", "Strain"] };
    });

    scope.get("/api/settings").reply(200, () => {
        return { ...settings, default_source_types: ["Clone", "Genotype", "Strain"] };
    });

    await userEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
        expect(screen.queryByText("Strain")).toBeInTheDocument();
    });
});
