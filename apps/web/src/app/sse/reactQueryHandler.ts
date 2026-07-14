import { accountQueryKeys } from "@account/keys";
import { roleQueryKeys } from "@administration/keys";
import type { QueryKeys } from "@app/queryKeys";
import { bannerQueryKeys } from "@banner/keys";
import { groupQueryKeys } from "@groups/keys";
import { indexQueryKeys } from "@indexes/keys";
import { jobQueryKeys } from "@jobs/keys";
import { labelQueryKeys } from "@labels/keys";
import { referenceQueryKeys } from "@references/keys";
import { samplesQueryKeys } from "@samples/keys";
import type { QueryClient } from "@tanstack/react-query";
import { taskQueryKeys } from "@tasks/keys";
import { fileQueryKeys } from "@uploads/keys";
import { userQueryKeys } from "@users/keys";
import type { SseDomain, SseMessage } from "./schema";

/**
 * What a domain caches, and therefore how narrowly its frames can be
 * invalidated.
 *
 * Every domain has the full set of keys, but not every domain caches a record
 * at `detail(id)` or a collection under `lists()`. Invalidating a key nothing
 * is cached under is a silent no-op, so a domain that caches neither has to
 * fall back to `all()`. This must be declared rather than inferred from the
 * keys: they are always present, so their absence can no longer signal it.
 */
type CachedShapes = {
	keys: QueryKeys;

	/** Whether single records are cached under `detail(id)`. */
	details: boolean;

	/** Whether collections are cached under `lists()`. */
	lists: boolean;
};

const domains: Record<SseDomain, CachedShapes> = {
	account: { keys: accountQueryKeys, details: false, lists: false },
	groups: { keys: groupQueryKeys, details: true, lists: true },
	indexes: { keys: indexQueryKeys, details: true, lists: true },
	jobs: { keys: jobQueryKeys, details: true, lists: true },
	labels: { keys: labelQueryKeys, details: false, lists: true },
	messages: { keys: bannerQueryKeys, details: false, lists: true },
	references: { keys: referenceQueryKeys, details: true, lists: true },
	roles: { keys: roleQueryKeys, details: false, lists: false },
	samples: { keys: samplesQueryKeys, details: true, lists: true },
	tasks: { keys: taskQueryKeys, details: true, lists: false },
	uploads: { keys: fileQueryKeys, details: false, lists: true },
	users: { keys: userQueryKeys, details: true, lists: true },
};

function selectQueryKey(
	domain: CachedShapes,
	operation: SseMessage["operation"],
	id: SseMessage["id"],
): readonly unknown[] {
	if (operation === "update" && domain.details) {
		return domain.keys.detail(id);
	}
	if ((operation === "insert" || operation === "delete") && domain.lists) {
		return domain.keys.lists();
	}
	return domain.keys.all();
}

export function reactQueryHandler(queryClient: QueryClient) {
	return (message: SseMessage) => {
		const domain = domains[message.domain];
		if (!domain) {
			return;
		}
		queryClient.invalidateQueries({
			queryKey: selectQueryKey(domain, message.operation, message.id),
		});
	};
}
