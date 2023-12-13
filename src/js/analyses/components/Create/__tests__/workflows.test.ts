import { describe, expect, it } from "vitest";
import { aodpWorkflow, getCompatibleWorkflows, nuvsWorkflow, pathoscopeWorkflow } from "../workflows";

describe("getCompatibleWorkflows()", () => {
    it("should return aodp when [dataType='barcode']", () => {
        const result = getCompatibleWorkflows("barcode", false);
        expect(result).toEqual([aodpWorkflow]);
    });

    it("should return pathoscope_bowtie when [dataType='genome'] and [hasHmm=false]", () => {
        const result = getCompatibleWorkflows("genome", false);
        expect(result).toEqual([pathoscopeWorkflow]);
    });

    it("should return pathoscope_bowtie and nuvs when [dataType='genome'] and [hasHmm=true]", () => {
        const result = getCompatibleWorkflows("genome", true);
        expect(result).toEqual([pathoscopeWorkflow, nuvsWorkflow]);
    });
});
