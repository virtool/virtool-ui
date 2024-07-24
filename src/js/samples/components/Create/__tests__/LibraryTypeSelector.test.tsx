import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../../../tests/setupTests";
import { LibraryTypeSelector } from "../LibraryTypeSelector";

describe("<LibraryTypeSelector>", () => {
    let props;
    beforeEach(() => {
        props = {
            onSelect: vi.fn(),
            libraryType: "normal",
        };
    });

    it("should have Normal selected [libraryType='normal']", async () => {
        renderWithProviders(<LibraryTypeSelector {...props} />);

        await userEvent.click(
            screen.getByRole("button", { name: "Normal Search against whole genome references using normal reads." })
        );
        expect(props.onSelect).toHaveBeenCalledWith("normal");
    });

    it("should have sRNA selected when [libraryType='srna']", async () => {
        renderWithProviders(<LibraryTypeSelector {...props} />);

        await userEvent.click(
            screen.getByRole("button", { name: "sRNA Search against whole genome references using sRNA reads" })
        );
        expect(props.onSelect).toHaveBeenCalledWith("srna");
    });

    it("should have Amplicon selected when [libraryType='amplicon']", async () => {
        renderWithProviders(<LibraryTypeSelector {...props} />);

        await userEvent.click(
            screen.getByRole("button", {
                name: "Amplicon Search against barcode references using amplicon reads.",
            })
        );
        expect(props.onSelect).toHaveBeenCalledWith("amplicon");
    });
});
