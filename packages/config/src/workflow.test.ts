import { describe, expect, it } from "vitest";
import { parseWorkflowConfig } from "./workflow";

const minimal = {
	VT_API_URL: "http://api:9950",
	VT_WORKFLOW_NAME: "pathoscope",
};

describe("parseWorkflowConfig", () => {
	it("errors when VT_API_URL is missing", () => {
		expect(() =>
			parseWorkflowConfig({ VT_WORKFLOW_NAME: "x" } as NodeJS.ProcessEnv),
		).toThrow(/VT_API_URL/);
	});

	it("errors when VT_WORKFLOW_NAME is missing", () => {
		expect(() =>
			parseWorkflowConfig({ VT_API_URL: "http://api" } as NodeJS.ProcessEnv),
		).toThrow(/VT_WORKFLOW_NAME/);
	});

	it("applies defaults for resource limits", () => {
		const cfg = parseWorkflowConfig(minimal as NodeJS.ProcessEnv);
		expect(cfg.workPath).toBe("./work");
		expect(cfg.mem).toBe(4);
		expect(cfg.proc).toBe(2);
		expect(cfg.timeout).toBe(1000);
		expect(cfg.dev).toBe(false);
	});

	it("coerces numeric env values", () => {
		const cfg = parseWorkflowConfig({
			...minimal,
			VT_MEM: "16",
			VT_PROC: "8",
			VT_TIMEOUT: "300",
		} as NodeJS.ProcessEnv);
		expect(cfg.mem).toBe(16);
		expect(cfg.proc).toBe(8);
		expect(cfg.timeout).toBe(300);
	});
});
