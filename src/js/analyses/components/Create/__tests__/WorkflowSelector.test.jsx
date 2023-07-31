import { describe, expect, it } from "vitest";
import { getCompatibleWorkflows } from "../WorkflowSelector";

describe("getCompatibleWorkflows()", () => {
    it("should return aodp when [dataType='barcode']", () => {
        const result = getCompatibleWorkflows("barcode", false);
        expect(result).toEqual(["aodp"]);
    });

    it("should return pathoscope_bowtie when [dataType='genome'] and [hasHmm=false]", () => {
        const result = getCompatibleWorkflows("genome", false);
        expect(result).toEqual(["pathoscope_bowtie"]);
    });

    it("should return pathoscope_bowtie and nuvs when [dataType='genome'] and [hasHmm=true]", () => {
        const result = getCompatibleWorkflows("genome", true);
        expect(result).toEqual(["pathoscope_bowtie", "nuvs"]);
    });
});
