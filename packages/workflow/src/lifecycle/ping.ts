import type { Logger } from "@virtool/logger";
import type { ControlPlaneClient } from "../client/client";
import { sleep } from "../client/retry";
import type { RunSignals } from "../run";

/** Delay before the first ping, spreading a wave of pods' heartbeats out. */
export const PING_STAGGER_MS = 100;

/** Delay between pings. */
export const PING_INTERVAL_MS = 5_000;

/**
 * Consecutive failures before the loop gives up.
 *
 * With retries disabled on the ping request, five failures at a 5 s cadence is
 * a give-up window of roughly 20 s. The control plane fails a running job whose
 * last ping is more than **five minutes** old, so the pod stops heartbeating
 * well inside the sweep — which is the whole point of owning the retry policy
 * here rather than inheriting a hidden 25 s of retries per attempt.
 */
export const MAX_PING_FAILURES = 5;

/** A running ping loop. */
export type PingLoop = {
	/** Stops the loop. Safe to call more than once, and after it has stopped itself. */
	stop: () => Promise<void>;
};

/** Options for {@link startPingLoop}. */
export type StartPingLoopOptions = {
	client: ControlPlaneClient;
	logger: Logger;
	signals: RunSignals;
	intervalMs?: number;
};

/**
 * Heartbeat the control plane for as long as the run lasts.
 *
 * This is also the cancellation channel: a ping answered with `cancelled: true`
 * aborts the run's signal, which is what unwinds the run loop. A runner has no
 * other way to learn it should stop.
 *
 * Failures are counted **consecutively** and reset on success. Python's counter
 * never decrements, so a run long enough to accumulate six scattered blips stops
 * pinging forever and is then failed by the sweep while still working.
 */
export function startPingLoop({
	client,
	logger,
	signals,
	intervalMs = PING_INTERVAL_MS,
}: StartPingLoopOptions): PingLoop {
	const controller = new AbortController();

	async function loop(): Promise<void> {
		let failures = 0;

		await sleep(PING_STAGGER_MS, controller.signal);

		while (!controller.signal.aborted) {
			try {
				const { cancelled } = await client.ping();

				failures = 0;

				if (cancelled) {
					logger.info("control plane reported the job as cancelled");

					signals.cancel();

					return;
				}
			} catch (err) {
				// The run's own abort races the `stop()` call that follows it, so a
				// ping already in flight rejects on a signal that means the run is
				// over rather than that the control plane is unreachable.
				if (controller.signal.aborted || signals.signal.aborted) {
					return;
				}

				failures += 1;

				if (failures >= MAX_PING_FAILURES) {
					logger.warn(
						{ err, failures },
						"giving up on pinging the control plane; the job will be failed by its ping timeout while this pod keeps running",
					);

					return;
				}

				logger.info({ err, failures }, "control plane ping failed");
			}

			await sleep(intervalMs, controller.signal);
		}
	}

	const running = loop();

	return {
		async stop() {
			controller.abort();

			await running;
		},
	};
}
