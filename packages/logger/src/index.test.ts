import { describe, expect, it } from "vitest";
import { createLogger } from "./index";

function makeSink(): {
	stream: { write: (chunk: string) => void };
	records: () => Array<Record<string, unknown>>;
} {
	const chunks: string[] = [];
	return {
		stream: {
			write(chunk) {
				chunks.push(chunk);
			},
		},
		records: () =>
			chunks
				.join("")
				.split("\n")
				.filter(Boolean)
				.map((line) => JSON.parse(line) as Record<string, unknown>),
	};
}

describe("createLogger", () => {
	it("emits records tagged with the service name", () => {
		const sink = makeSink();
		const log = createLogger({
			name: "web",
			level: "info",
			destination: sink.stream,
		});

		log.info("hello");

		const [record] = sink.records();
		expect(record.name).toBe("web");
		expect(record.msg).toBe("hello");
		expect(record.level).toBe(30);
	});

	it("honours an explicit level over env resolution", () => {
		const sink = makeSink();
		const log = createLogger({
			name: "web",
			level: "warn",
			env: { NODE_ENV: "development" },
			destination: sink.stream,
		});

		log.info("skipped");
		log.warn("kept");

		const records = sink.records();
		expect(records).toHaveLength(1);
		expect(records[0].msg).toBe("kept");
	});

	it("redacts default secret-bearing keys", () => {
		const sink = makeSink();
		const log = createLogger({
			name: "web",
			level: "info",
			destination: sink.stream,
		});

		log.info(
			{ password: "hunter2", token: "abc", headers: { cookie: "session=1" } },
			"login",
		);

		const [record] = sink.records();
		expect(record.password).toBe("[redacted]");
		expect(record.token).toBe("[redacted]");
		expect((record.headers as Record<string, string>).cookie).toBe(
			"[redacted]",
		);
	});

	it("merges caller-supplied redact paths with the defaults", () => {
		const sink = makeSink();
		const log = createLogger({
			name: "web",
			level: "info",
			redact: ["apiKey"],
			destination: sink.stream,
		});

		log.info({ apiKey: "k", password: "p" }, "check");

		const [record] = sink.records();
		expect(record.apiKey).toBe("[redacted]");
		expect(record.password).toBe("[redacted]");
	});

	it("supports child loggers with bound context", () => {
		const sink = makeSink();
		const log = createLogger({
			name: "web",
			level: "info",
			destination: sink.stream,
		});

		log.child({ requestId: "r1" }).info("handled");

		const [record] = sink.records();
		expect(record.requestId).toBe("r1");
		expect(record.name).toBe("web");
	});

	it("merges extra base bindings with pid and hostname", () => {
		const sink = makeSink();
		const log = createLogger({
			name: "web",
			level: "info",
			base: { region: "ca-central-1" },
			destination: sink.stream,
		});

		log.info("boot");

		const [record] = sink.records();
		expect(record.region).toBe("ca-central-1");
		expect(record.pid).toBe(process.pid);
		expect(typeof record.hostname).toBe("string");
	});
});
