import { z } from "zod";

/** Fixed set of workflow names supported by the TS runtime. */
export const WorkflowName = z.enum(["pathoscope", "nuvs"]);

export type WorkflowName = z.infer<typeof WorkflowName>;
