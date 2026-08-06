import type { Logger } from "@virtool/logger";

/** Exit code set when the shutdown sequence completes within its budget. */
const EXIT_CLEAN = 0;

/** Exit code set when the backstop fires before the sequence finishes. */
const EXIT_OVERRAN = 1;

/** One registered shutdown callback and the name it is logged under. */
type Hook = {
	name: string;
	run: () => Promise<void>;
};

/** What {@link createShutdownController} needs to wind the process down. */
export type ShutdownDeps = {
	logger: Logger;
	/** Flip readiness. Called with `false` before any hook runs. */
	setReady: (ready: boolean) => void;
	/** Stop accepting probes. Runs after every hook. */
	closeListener: () => Promise<void>;
	/** Drain the Postgres pool. Runs last, so a hook may still write. */
	closeDatabase: () => Promise<void>;
	/** Flush buffered Sentry envelopes. Never `close()` — see below. */
	flushSentry: () => Promise<void>;
	/** Seconds the whole sequence may take before the backstop gives up. */
	timeout: number;
};

/** The shutdown surface {@link createShutdownController} returns. */
export type ShutdownController = {
	onShutdown: (name: string, hook: () => Promise<void>) => void;
	/** Run the sequence. Safe to call more than once; later calls are ignored. */
	shutdown: (signal: string) => Promise<void>;
	/** Register SIGTERM and SIGINT handlers. */
	listen: () => void;
};

/** Run `promise`, or resolve `false` once `ms` milliseconds have passed. */
function withBackstop(promise: Promise<void>, ms: number): Promise<boolean> {
	return new Promise<boolean>((resolve) => {
		const timer = setTimeout(() => resolve(false), ms);

		// Without this the timer holds the event loop open for its full duration
		// on an otherwise clean shutdown, so a process that finished winding down
		// in 200 ms would still sit there for the whole budget before exiting.
		timer.unref();

		promise.then(
			() => {
				clearTimeout(timer);
				resolve(true);
			},
			() => {
				clearTimeout(timer);
				resolve(true);
			},
		);
	});
}

/**
 * Build this process's shutdown sequence.
 *
 * **Registering a SIGTERM listener removes Node's default exit behaviour**, so
 * from that moment exiting is entirely this module's responsibility.
 *
 * It discharges that with `process.exitCode` and a natural drain, never
 * `process.exit()`. Node's own documentation is explicit that `exit()` forces
 * the process down "even if there are still asynchronous operations pending",
 * writes to `process.stdout` included — which here means a dropped pino line,
 * an unsent Sentry envelope, and an uncommitted transaction.
 *
 * The ordering is fixed, and each step is awaited before the next:
 *
 * 1. Readiness flips to unavailable. The listener stays up, so the kubelet
 *    still gets an answer rather than a connection refused.
 * 2. Registered hooks run in **reverse registration order**, each awaited. A
 *    hook that throws is logged and does not abort the ones after it.
 * 3. The probe listener closes.
 * 4. The database pool drains — after the hooks, so a hook may still write.
 *    Releasing a task claim is exactly that.
 * 5. Sentry flushes. `flush()`, never `close()`: `close()` flushes *and*
 *    disables, so anything raised later in shutdown goes unreported.
 *
 * The whole sequence is bounded by the backstop, which means a hook cannot
 * assume unlimited time. The budget must stay strictly under
 * `terminationGracePeriodSeconds` — which covers `preStop` and shutdown
 * together — or SIGKILL lands first and the process gets neither a clean
 * shutdown nor a controlled failure.
 */
export function createShutdownController(
	deps: ShutdownDeps,
): ShutdownController {
	const hooks: Hook[] = [];
	let started = false;

	async function runHooks(): Promise<void> {
		// Reverse registration order: a hook registered later may depend on what an
		// earlier one set up, so it has to come down first.
		for (const hook of [...hooks].reverse()) {
			try {
				await hook.run();
				deps.logger.debug({ hook: hook.name }, "ran shutdown hook");
			} catch (err) {
				deps.logger.error({ err, hook: hook.name }, "shutdown hook failed");
			}
		}
	}

	async function sequence(): Promise<void> {
		deps.setReady(false);

		await runHooks();
		await deps.closeListener();
		await deps.closeDatabase();
		await deps.flushSentry();
	}

	async function shutdown(signal: string): Promise<void> {
		if (started) {
			// A second signal must not re-enter the sequence: hooks would run twice
			// and the pool would be closed out from under the first pass.
			deps.logger.warn({ signal }, "already shutting down");
			return;
		}

		started = true;

		deps.logger.info({ signal }, "shutting down");

		const finished = await withBackstop(sequence(), deps.timeout * 1000);

		if (finished) {
			deps.logger.info("shutdown complete");
			process.exitCode = EXIT_CLEAN;
			return;
		}

		deps.logger.error(
			{ timeout: deps.timeout },
			"shutdown did not finish within its budget",
		);

		process.exitCode = EXIT_OVERRAN;
	}

	return {
		onShutdown(name, run) {
			hooks.push({ name, run });
		},

		shutdown,

		listen() {
			for (const signal of ["SIGINT", "SIGTERM"] as const) {
				process.on(signal, () => {
					void shutdown(signal);
				});
			}
		},
	};
}
