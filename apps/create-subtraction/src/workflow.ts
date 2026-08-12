/**
 * The create_subtraction workflow: three steps and no external tool.
 *
 * A user uploads a genome; this turns it into a subtraction an analysis can
 * eliminate reads against. It decompresses the upload, counts its sequences and
 * nucleotides, recompresses it and hands the jobs API the figures alongside the
 * one file it wrote.
 *
 * Python has a fourth step, `build_index`, which runs `bowtie2-build` and
 * uploads six `.bt2` shards. It is deliberately not ported — nothing reads those
 * shards, and the finalize route accepts the genome alone. That is also why this
 * app's image is Alpine: with the step gone the workflow runs no binary at all.
 * Reintroducing it means moving the image to Debian in the same edit.
 *
 * Step ids are `snake_case` and match the Python function names they were ported
 * from. The jobs API stores them, so renaming one changes the shape of a job's
 * step list at cutover.
 */

import { defineWorkflow } from "@virtool/workflow";
import { buildCreateSubtractionContext } from "./context";
import { createCreateSubtractionState } from "./state";
import { computeGcAndCountStep } from "./steps/computeGcAndCount";
import { decompressStep } from "./steps/decompress";
import { finalizeStep } from "./steps/finalize";

export const createSubtractionWorkflow = defineWorkflow({
	name: "create_subtraction",
	buildContext: buildCreateSubtractionContext,
	createState: createCreateSubtractionState,
	steps: [decompressStep, computeGcAndCountStep, finalizeStep],
});
