import { roleQueryKeys } from "@administration/queries";
import { jobQueryKeys } from "@jobs/queries";
import { labelQueryKeys } from "@labels/queries";
import { samplesQueryKeys } from "@samples/queries";
import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { reactQueryHandler } from "../reactQueryHandler";
import type { SseMessage } from "../schema";

describe("reactQueryHandler", () => {
	let queryClient: QueryClient;
	let invalidate: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		queryClient = new QueryClient();
		invalidate = vi.spyOn(queryClient, "invalidateQueries");
	});

	it("invalidates the matching detail key on update for a domain with a detail factory", () => {
		const handle = reactQueryHandler(queryClient);
		handle({ domain: "samples", operation: "update", id: "abc" });
		expect(invalidate).toHaveBeenCalledExactlyOnceWith({
			queryKey: samplesQueryKeys.detail("abc"),
		});
	});

	it("invalidates lists on insert for a domain with a lists factory", () => {
		const handle = reactQueryHandler(queryClient);
		handle({ domain: "jobs", operation: "insert", id: 42 });
		expect(invalidate).toHaveBeenCalledExactlyOnceWith({
			queryKey: jobQueryKeys.lists(),
		});
	});

	it("invalidates lists on delete for a domain with a lists factory", () => {
		const handle = reactQueryHandler(queryClient);
		handle({ domain: "jobs", operation: "delete", id: 42 });
		expect(invalidate).toHaveBeenCalledExactlyOnceWith({
			queryKey: jobQueryKeys.lists(),
		});
	});

	it("falls back to all when the factory has lists but no detail on update", () => {
		const handle = reactQueryHandler(queryClient);
		handle({ domain: "labels", operation: "update", id: 7 });
		expect(invalidate).toHaveBeenCalledExactlyOnceWith({
			queryKey: labelQueryKeys.all(),
		});
	});

	it("falls back to all when the factory has neither lists nor detail", () => {
		const handle = reactQueryHandler(queryClient);
		handle({ domain: "roles", operation: "insert", id: "full" });
		expect(invalidate).toHaveBeenCalledExactlyOnceWith({
			queryKey: roleQueryKeys.all(),
		});
	});

	it("ignores messages for unknown domains", () => {
		const handle = reactQueryHandler(queryClient);
		handle({
			domain: "unknown",
			operation: "update",
			id: 1,
		} as unknown as SseMessage);
		expect(invalidate).not.toHaveBeenCalled();
	});
});
