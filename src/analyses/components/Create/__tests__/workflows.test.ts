import { describe, expect, it } from "vitest";
import {
	getCompatibleWorkflows,
	nuvsWorkflow,
	pathoscopeWorkflow,
} from "../workflows";

describe("getCompatibleWorkflows()", () => {
	it("should not return nuvs when [hasHmm=false]", () => {
		const result = getCompatibleWorkflows(false);
		expect(result).toEqual([pathoscopeWorkflow]);
	});

	it("should return all workflows when [hasHmm=true]", () => {
		const result = getCompatibleWorkflows(true);
		expect(result).toEqual([pathoscopeWorkflow, nuvsWorkflow]);
	});
});
