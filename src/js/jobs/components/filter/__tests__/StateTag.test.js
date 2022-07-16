import { getAccentColor } from "../StateTag";

describe("getAccentColor", () => {
    it.each([
        ["red", "error"],
        ["red", "failed"],
        ["red", "terminated"],
        ["grey", "waiting"],
        ["grey", "preparing"],
        ["blue", "running"],
        ["green", "complete"]
    ])("should return %s when job status is %s", (result, status) => {
        expect(getAccentColor(status)).toBe(result);
    });
});
