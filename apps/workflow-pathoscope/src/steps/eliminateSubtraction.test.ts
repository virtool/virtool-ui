import { mkdir, open, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { RunSubprocess, RunSubprocessOptions } from "@virtool/workflow";
import {
	createFakeContext,
	createTestWorkPath,
} from "@virtool/workflow/testing";
import { describe, expect, it, onTestFinished } from "vitest";
import type { PathoscopeData, PathoscopeSubtraction } from "../context";
import { workPaths } from "../paths";
import type { PathoscopeState } from "../state";
import { eliminateSubtractionStep } from "./eliminateSubtraction";

function fastq(...readIds: readonly string[]): string {
	return readIds.map((id) => `@${id}\nACGT\n+\nIIII\n`).join("");
}

function parseFastqIds(contents: string): string[] {
	const lines = contents.split("\n");
	const ids: string[] = [];

	for (let index = 0; index + 3 < lines.length; index += 4) {
		ids.push((lines[index] ?? "").slice(1));
	}

	return ids;
}

function flagValue(command: readonly string[], flag: string): string {
	return command[command.indexOf(flag) + 1] ?? "";
}

function shellFlagValue(script: string, flag: string): string {
	const tokens = script.split(/\s+/);

	return tokens[tokens.indexOf(flag) + 1] ?? "";
}

/**
 * Stands in for bowtie2, samtools and `pathoscope-core`, on a real work path.
 *
 * The core is modelled down to the order it touches the two FASTQ paths — input
 * opened, output created, and only then a byte read — because that ordering is
 * what makes writing in place destroy the reads being filtered.
 */
function createFakeTools(eliminationsPerPass: readonly (readonly string[])[]) {
	const bowtie2Inputs: string[] = [];
	let pass = 0;

	async function runCore(command: readonly string[]): Promise<void> {
		const input = await open(flagValue(command, "--input-fastq"), "r");
		const output = await open(flagValue(command, "--output-fastq"), "w");

		const contents = await input.readFile("utf8");
		await input.close();

		const eliminated = new Set(eliminationsPerPass[pass] ?? []);
		const kept = parseFastqIds(contents).filter((id) => !eliminated.has(id));

		await output.writeFile(fastq(...kept));
		await output.close();

		pass += 1;

		await writeFile(flagValue(command, "--output-alignments"), "");
		await writeFile(
			flagValue(command, "--output"),
			JSON.stringify({
				subtracted: parseFastqIds(contents).length - kept.length,
			}),
		);
	}

	const runSubprocess: RunSubprocess = async (
		options: RunSubprocessOptions,
	) => {
		const { command } = options;
		const script = command[2] ?? "";

		if (command[0] === "bash") {
			bowtie2Inputs.push(
				await readFile(shellFlagValue(script, "-U"), "utf8").catch(() => ""),
			);

			await writeFile(shellFlagValue(script, "-o"), "");
		} else {
			await runCore(command);
		}

		return {
			command,
			exitCode: 0,
			signal: null,
			cancelled: false,
			stderrTail: [],
			durationMs: 1,
		};
	};

	return { bowtie2Inputs, runSubprocess };
}

function createSubtraction(id: number): PathoscopeSubtraction {
	return { id, name: `subtraction ${id}`, fastaPath: `/work/${id}.fa.gz` };
}

describe("eliminateSubtractionStep", () => {
	it("carries the filtered reads into every later subtraction pass", async () => {
		const { path: workPath, cleanup } = await createTestWorkPath();
		onTestFinished(cleanup);

		const paths = workPaths(workPath);

		await mkdir(paths.isolatesDir, { recursive: true });
		await writeFile(paths.isolateFastq, fastq("r1", "r2", "r3"));
		await writeFile(paths.isolateBam, "");

		const { bowtie2Inputs, runSubprocess } = createFakeTools([["r1"], ["r2"]]);

		const data: PathoscopeData = {
			analysisId: 1,
			index: { id: 1, path: paths.collapsedReference },
			readPaths: [join(workPath, "reads", "reads_1.fq.gz")],
			subtractions: [createSubtraction(1), createSubtraction(2)],
			pScoreCutoff: 0.01,
		};

		const state: PathoscopeState = {
			candidateSequenceIds: ["seq_a"],
			subtractedCount: 0,
		};

		await eliminateSubtractionStep.run(
			createFakeContext(data, state, { workPath, runSubprocess }),
		);

		expect(parseFastqIds(bowtie2Inputs[0] ?? "")).toEqual(["r1", "r2", "r3"]);
		expect(parseFastqIds(bowtie2Inputs[1] ?? "")).toEqual(["r2", "r3"]);

		expect(parseFastqIds(await readFile(paths.currentFastq, "utf8"))).toEqual([
			"r3",
		]);

		expect(state.subtractedCount).toBe(2);
	});
});
