/**
 * Resolve `promise`, or reject once `ms` have passed.
 *
 * The abandoned promise is left to settle on its own; the callers here are
 * read-only probes whose results are simply discarded.
 *
 * This lives apart from its callers because every `/metrics` probe needs the
 * same race for the same reason — a query on the pool it is measuring queues
 * *client-side*, where no statement timeout applies — and a second copy is free
 * to drift into a subtly different one.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
	let timer: ReturnType<typeof setTimeout> | undefined;

	const deadline = new Promise<never>((_, reject) => {
		timer = setTimeout(() => reject(new Error("timed out")), ms);
	});

	return Promise.race([promise, deadline]).finally(() => clearTimeout(timer));
}
