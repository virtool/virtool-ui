import { createLogger } from "@virtool/logger";
import { beforeEach, describe, expect, it, vi } from "vitest";

const logger = {
	trace: vi.fn(),
	debug: vi.fn(),
	info: vi.fn(),
	warn: vi.fn(),
	error: vi.fn(),
	fatal: vi.fn(),
};

vi.mock("@sentry/tanstackstart-react", () => ({ logger }));

const { createSentryLogStream } = await import("../sentryLog");

describe("createSentryLogStream", () => {
	beforeEach(() => {
		for (const fn of Object.values(logger)) {
			fn.mockClear();
		}
	});

	it("forwards a record to the Sentry method matching its level", () => {
		const stream = createSentryLogStream();

		stream.write(`${JSON.stringify({ level: 40, msg: "watch out" })}\n`);

		expect(logger.warn).toHaveBeenCalledTimes(1);
		expect(logger.warn).toHaveBeenCalledWith("watch out", expect.anything());
	});

	it("passes structured fields as attributes and drops the pino envelope", () => {
		const stream = createSentryLogStream();

		stream.write(
			`${JSON.stringify({
				level: 30,
				time: 123,
				pid: 1,
				hostname: "h",
				name: "web",
				msg: "login",
				userId: "u1",
			})}\n`,
		);

		expect(logger.info).toHaveBeenCalledWith("login", { userId: "u1" });
	});

	it("forwards already-redacted secret fields from a real logger", () => {
		const stream = createSentryLogStream();
		const log = createLogger({
			name: "web",
			level: "info",
			destination: { write() {} },
			streams: [{ level: "info", stream }],
		});

		log.info({ password: "hunter2", headers: { cookie: "s=1" } }, "sign in");

		expect(logger.info).toHaveBeenCalledWith(
			"sign in",
			expect.objectContaining({
				password: "[redacted]",
				headers: { cookie: "[redacted]" },
			}),
		);
	});

	it("ignores malformed lines", () => {
		const stream = createSentryLogStream();

		expect(() => stream.write("not json\n")).not.toThrow();
		for (const fn of Object.values(logger)) {
			expect(fn).not.toHaveBeenCalled();
		}
	});
});
