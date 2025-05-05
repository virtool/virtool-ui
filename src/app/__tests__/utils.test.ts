import { describe, expect, it } from "vitest";
import { byteSize, createRandomString, formatIsolateName } from "../utils.js";

describe("byteSize()", () => {
    it("should convert 1 to 1.0B", () => {
        const result = byteSize(1);
        expect(result).toEqual("1.0B");
    });

    it("should convert 1024000 to 1.0MB", () => {
        const result = byteSize(1024000);
        expect(result).toEqual("1.0MB");
    });

    it("should convert 1024 to 1.0KB", () => {
        const result = byteSize(1024);
        expect(result).toEqual("1.0KB");
    });

    it("should convert 0 to 0.0B", () => {
        const result = byteSize(0);
        expect(result).toEqual("0.0B");
    });

    it("should convert NaN to 0.0B", () => {
        const result = byteSize(NaN);
        expect(result).toEqual("0.0B");
    });

    it("should convert null to 0.0B", () => {
        const result = byteSize(null);
        expect(result).toEqual("0.0B");
    });
});

describe("createRandomString()", () => {
    it("should return a string of length 8 by default", () => {
        const result = createRandomString();
        expect(result.length).toEqual(8);
    });

    it("should return a string of specified length", () => {
        const result = createRandomString(20);
        expect(result.length).toEqual(20);
    });
});

describe("formatIsolateName()", () => {
    it("should return 'Isolate ABCD' for named isolate", () => {
        const result = formatIsolateName({
            id: "testid",
            sequences: [],
            source_name: "ABCD",
            source_type: "isolate",
        });

        expect(result).toEqual("Isolate ABCD");
    });

    it("should return 'Unnamed' for isolate with source type unknown", () => {
        const result = formatIsolateName({
            id: "testid",
            sequences: [],
            source_name: "EFGH",
            source_type: "unknown",
        });

        expect(result).toEqual("Unnamed");
    });
});
