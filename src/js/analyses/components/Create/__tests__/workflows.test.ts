import { describe, expect, it } from "vitest";
import {
    getCompatibleWorkflows,
    iimiWorkflow,
    nuvsWorkflow,
    pathoscopeWorkflow,
} from "../workflows";

describe("getCompatibleWorkflows()", () => {
    it("should not return nuvs when [hasHmm=false]", () => {
        const result = getCompatibleWorkflows(false);
        expect(result).toEqual([pathoscopeWorkflow, iimiWorkflow]);
    });

    it("should return all workflows when [hasHmm=true]", () => {
        const result = getCompatibleWorkflows(true);
        expect(result).toEqual([
            pathoscopeWorkflow,
            nuvsWorkflow,
            iimiWorkflow,
        ]);
    });
});
