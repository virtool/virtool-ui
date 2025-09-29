import { AdministratorRoleName } from "@administration/types";
import { formatPath } from "@app/hooks";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { createFakeFile, mockApiListFiles } from "@tests/fake/files";
import { renderWithRouter } from "@tests/setup";
import { describe, expect, it } from "vitest";
import { SubtractionFileManager } from "../SubtractionFileManager";

function createFiles(fileNames) {
    return fileNames.map(
        (fileName) =>
            new File(["test"], fileName, { type: "application/gzip" }),
    );
}

describe("<SubtractionFileManager />", () => {
    const path = formatPath("/subtractions/uploads", { page: 1 });

    it("should reject uploads that don't pass validation", async () => {
        mockApiGetAccount(
            createFakeAccount({
                administrator_role: AdministratorRoleName.FULL,
            }),
        );
        mockApiListFiles([createFakeFile({ name: "subtraction.fq.gz" })]);

        renderWithRouter(<SubtractionFileManager />, path);

        expect(
            await screen.findByText("Drag files here to upload"),
        ).toBeInTheDocument();

        await userEvent.upload(
            await screen.findByLabelText("Upload file"),
            createFiles(["test.txt"]),
        );

        expect(
            await screen.findByText("Invalid file names: test.txt"),
        ).toBeInTheDocument();
    });
});
