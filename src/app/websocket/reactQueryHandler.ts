import { accountKeys } from "@account/queries";
import { roleQueryKeys, userQueryKeys } from "@administration/queries";
import { analysesQueryKeys } from "@analyses/queries";
import { groupQueryKeys } from "@groups/queries";
import { indexQueryKeys } from "@indexes/queries";
import { jobQueryKeys } from "@jobs/queries";
import { modelQueryKeys } from "@ml/queries";
import { referenceQueryKeys } from "@references/queries";
import { samplesQueryKeys } from "@samples/queries";
import type { QueryClient } from "@tanstack/react-query";
import { get } from "es-toolkit/compat";
import type { Task } from "@/types/api";
import { fileQueryKeys } from "@/uploads/queries";
import type { WsMessage } from "./schema";
import { taskUpdaters } from "./updaters";

const workflowQueries = {
	build_index: [indexQueryKeys.lists()],
	create_sample: [samplesQueryKeys.lists()],
	iimi: [samplesQueryKeys.lists(), analysesQueryKeys.lists()],
	nuvs: [samplesQueryKeys.lists(), analysesQueryKeys.lists()],
	pathoscope_bowtie: [samplesQueryKeys.lists(), analysesQueryKeys.lists()],
};

function jobUpdater(queryClient: QueryClient, data: WsMessage["data"]) {
	const queryKeys = workflowQueries[data.workflow as string];

	queryKeys?.forEach((queryKey) => {
		queryClient.invalidateQueries({ queryKey });
	});
}

const keyFactories = {
	account: accountKeys,
	groups: groupQueryKeys,
	indexes: indexQueryKeys,
	jobs: jobQueryKeys,
	models: modelQueryKeys,
	references: referenceQueryKeys,
	roles: roleQueryKeys,
	uploads: fileQueryKeys,
	users: userQueryKeys,
	samples: samplesQueryKeys,
};

export function reactQueryHandler(queryClient: QueryClient) {
	return (message: WsMessage) => {
		const { interface: iface, operation, data } = message;
		window.console.log(`${iface}.${operation}`);

		const keyFactory = keyFactories[iface];
		if (keyFactory) {
			queryClient.invalidateQueries({ queryKey: keyFactory.all() });
		}

		if (iface === "jobs") {
			jobUpdater(queryClient, data);
		}

		if (iface === "tasks" && operation === "update") {
			const updater = get(taskUpdaters, data.type as string);
			if (updater) {
				updater(queryClient, data as unknown as Task);
			}
		}
	};
}
