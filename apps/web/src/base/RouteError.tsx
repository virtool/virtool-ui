import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { type ErrorComponentProps, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import Button from "./Button";
import NotFound from "./NotFound";

function getStatus(error: unknown): number | undefined {
	if (
		error != null &&
		typeof error === "object" &&
		"response" in error &&
		typeof (error as { response?: unknown }).response === "object" &&
		(error as { response: unknown }).response != null
	) {
		const { status } = (error as { response: { status?: unknown } }).response;
		return typeof status === "number" ? status : undefined;
	}

	return undefined;
}

/**
 * The router's default `errorComponent`: renders when a route loader rejects
 * or a `useSuspenseQuery` throws, instead of leaving the route blank.
 *
 * A 403 reads as a permission problem, a 404 as a missing resource, and
 * anything else as a retryable error. "Try again" clears the cached query
 * error and re-runs the route loader, so a transient failure recovers without
 * a full page reload.
 */
export default function RouteError({ error }: ErrorComponentProps) {
	const router = useRouter();
	const { reset } = useQueryErrorResetBoundary();

	useEffect(() => {
		// Clear React Query's error state so an invalidate-driven refetch can
		// resolve the suspense query and unmount this boundary.
		reset();
	}, [reset]);

	const status = getStatus(error);

	if (status === 403) {
		return (
			<NotFound status={403} message="You don't have access to this resource" />
		);
	}

	if (status === 404) {
		return <NotFound />;
	}

	return (
		<div className="flex flex-col items-center justify-center h-96 gap-4">
			<strong className="text-base">Something went wrong</strong>
			<Button color="blue" onClick={() => router.invalidate()}>
				Try again
			</Button>
		</div>
	);
}
