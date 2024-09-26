import { AdministratorRoles } from "@administration/types";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { createFakeFile, mockApiListFiles } from "@tests/fake/files";
import { renderWithMemoryRouter } from "@tests/setup";
import React from "react";
import { describe, expect, it } from "vitest";
import { SubtractionFileManager } from "../SubtractionFileManager";

function createFiles(fileNames) {
    return fileNames.map(fileName => new File(["test"], fileName, { type: "application/gzip" }));
}

describe("<SubtractionFileManager />", () => {
    it("should reject files that don't pass validation", async () => {
        mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        mockApiListFiles([createFakeFile({ name: "subtraction.fq.gz" })]);

        renderWithMemoryRouter(<SubtractionFileManager />, "/subtractions/files?page=1");

        expect(await screen.findByText("Drag files here to upload")).toBeInTheDocument();

        await userEvent.upload(await screen.findByLabelText("Upload file"), createFiles(["test.txt"]));

        expect(await screen.findByText("Invalid file names: test.txt")).toBeInTheDocument();
    });
});
