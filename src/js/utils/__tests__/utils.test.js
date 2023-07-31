import { describe, expect, it } from "vitest";
import { byteSize, createRandomString, formatIsolateName } from "../utils";

describe("Utility constants and functions module", () => {
    let result;
    let expected;

    it("byteSize(): converts number into closest whole units of B, KB, MB, GB ...", () => {
        let bytes = 1;
        result = byteSize(bytes);
        expected = "1.0B";
        expect(result).toEqual(expected);

        bytes = 1024;
        result = byteSize(bytes);
        expected = "1.0KB";
        expect(result).toEqual(expected);

        bytes = NaN;
        result = byteSize(bytes);
        expected = "0.0B";
        expect(result).toEqual(expected);

        bytes = 0;
        result = byteSize(bytes);
        expected = "0.0B";
        expect(result).toEqual(expected);

        bytes = null;
        result = byteSize(bytes);
        expected = "0.0B";
        expect(result).toEqual(expected);
    });

    it("createRandomString()", () => {
        result = createRandomString();
        expect(result.length).toEqual(8);

        result = createRandomString(20);
        expect(result.length).toEqual(20);
    });

    it("formatIsolateName()", () => {
        let isolate = {
            id: "testid",
            sequences: [],
            source_name: "ABCD",
            source_type: "isolate",
        };
        result = formatIsolateName(isolate);
        expected = "Isolate ABCD";
        expect(result).toEqual(expected);

        isolate = {
            souce_name: "EFGH",
            source_type: "unknown",
        };
        result = formatIsolateName(isolate);
        expected = "Unnamed";
        expect(result).toEqual(expected);
    });
});
