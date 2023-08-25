import { describe, expect, it } from "vitest";
import { getDataTypeFromLibraryType } from "../utils";

describe("getDataTypeFromLibraryType()", () => {
    it("should return 'barcode' when libraryType is 'amplicon'", () => {
        expect(getDataTypeFromLibraryType("amplicon")).toBe("barcode");
    });

    it("should return 'genome' when libraryType is 'normal'", () => {
        expect(getDataTypeFromLibraryType("normal")).toBe("genome");
    });
});
