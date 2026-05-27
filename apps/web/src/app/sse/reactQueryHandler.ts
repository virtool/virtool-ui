import { accountKeys } from "@account/queries";
import { roleQueryKeys, userQueryKeys } from "@administration/queries";
import { bannerQueryKeys } from "@banner/queries";
import { groupQueryKeys } from "@groups/queries";
import { indexQueryKeys } from "@indexes/queries";
import { jobQueryKeys } from "@jobs/queries";
import { labelQueryKeys } from "@labels/queries";
import { modelQueryKeys } from "@ml/queries";
import { referenceQueryKeys } from "@references/queries";
import { samplesQueryKeys } from "@samples/queries";
import type { QueryClient } from "@tanstack/react-query";
import { fileQueryKeys } from "@/uploads/queries";
import type { SseMessage } from "./schema";

const keyFactories = {
	account: accountKeys,
	groups: groupQueryKeys,
	indexes: indexQueryKeys,
	jobs: jobQueryKeys,
	labels: labelQueryKeys,
	messages: bannerQueryKeys,
	models: modelQueryKeys,
	references: referenceQueryKeys,
	roles: roleQueryKeys,
	uploads: fileQueryKeys,
	users: userQueryKeys,
	samples: samplesQueryKeys,
};

export function reactQueryHandler(queryClient: QueryClient) {
	return (message: SseMessage) => {
		const keyFactory = keyFactories[message.domain];
		if (keyFactory) {
			queryClient.invalidateQueries({ queryKey: keyFactory.all() });
		}
	};
}
