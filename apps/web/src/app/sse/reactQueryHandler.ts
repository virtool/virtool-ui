import { accountKeys } from "@account/queries";
import { roleQueryKeys } from "@administration/queries";
import { bannerQueryKeys } from "@banner/queries";
import { groupQueryKeys } from "@groups/queries";
import { indexQueryKeys } from "@indexes/queries";
import { jobQueryKeys } from "@jobs/queries";
import { labelQueryKeys } from "@labels/queries";
import { referenceQueryKeys } from "@references/queries";
import { samplesQueryKeys } from "@samples/queries";
import type { QueryClient } from "@tanstack/react-query";
import { taskQueryKeys } from "@tasks/queries";
import { fileQueryKeys } from "@uploads/queries";
import { userQueryKeys } from "@users/queries";
import type { SseDomain, SseMessage } from "./schema";

type KeyFactory = {
	all(): readonly unknown[];
	lists?(): readonly unknown[];
	detail?(id: number | string): readonly unknown[];
};

const keyFactories: Record<SseDomain, KeyFactory> = {
	account: accountKeys,
	groups: groupQueryKeys,
	indexes: indexQueryKeys,
	jobs: jobQueryKeys,
	labels: labelQueryKeys,
	messages: bannerQueryKeys,
	references: referenceQueryKeys,
	roles: roleQueryKeys,
	tasks: taskQueryKeys,
	uploads: fileQueryKeys,
	users: userQueryKeys,
	samples: samplesQueryKeys,
};

function selectQueryKey(
	factory: KeyFactory,
	operation: SseMessage["operation"],
	id: SseMessage["id"],
): readonly unknown[] {
	if (operation === "update" && factory.detail) {
		return factory.detail(id);
	}
	if ((operation === "insert" || operation === "delete") && factory.lists) {
		return factory.lists();
	}
	return factory.all();
}

export function reactQueryHandler(queryClient: QueryClient) {
	return (message: SseMessage) => {
		const factory = keyFactories[message.domain];
		if (!factory) {
			return;
		}
		queryClient.invalidateQueries({
			queryKey: selectQueryKey(factory, message.operation, message.id),
		});
	};
}
