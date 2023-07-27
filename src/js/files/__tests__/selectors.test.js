import { beforeEach, describe, expect, it } from "vitest";
import { getFilteredFileIds } from "../selectors";

describe("getFilteredFileIds()", () => {
    let state;

    beforeEach(() => {
        state = {
            files: {
                items: [
                    { id: "foo", ready: true, reserved: false, uploaded_at: "2020-01-24T23:54:02Z" },
                    { id: "bar", ready: true, reserved: false, uploaded_at: "2020-04-24T23:54:02Z" },
                    { id: "baz", ready: true, reserved: false, uploaded_at: "2020-02-24T23:54:02Z" },
                ],
            },
        };
    });

    it("should return all document ids", () => {
        const result = getFilteredFileIds(state);
        expect(result).toEqual(["foo", "bar", "baz"]);
    });
});
