import { z } from "zod";
import { boolFromEnv, intFromEnv } from "./common";

const WorkflowEnvSchema = z
	.object({
		VT_API_URL: z.string().url(),
		VT_WORKFLOW_NAME: z.string().min(1),
		VT_WORK_PATH: z.string().default("./work"),
		VT_MEM: intFromEnv.default(4),
		VT_PROC: intFromEnv.default(2),
		VT_TIMEOUT: intFromEnv.default(1000),
		VT_DEV: boolFromEnv.default(false),
	})
	.transform((raw) => ({
		apiUrl: raw.VT_API_URL,
		workflowName: raw.VT_WORKFLOW_NAME,
		workPath: raw.VT_WORK_PATH,
		mem: raw.VT_MEM,
		proc: raw.VT_PROC,
		timeout: raw.VT_TIMEOUT,
		dev: raw.VT_DEV,
	}));

export type WorkflowConfig = z.infer<typeof WorkflowEnvSchema>;

export function parseWorkflowConfig(
	env: NodeJS.ProcessEnv = process.env,
): WorkflowConfig {
	return WorkflowEnvSchema.parse(env);
}
