import { passwordPolicyQueryKeys } from "@administration/keys";
import { getPasswordPolicyFn } from "@server/settings/functions";
import { queryOptions } from "@tanstack/react-query";

/**
 * Query options for the instance password policy.
 *
 * Unlike the rest of `queries.ts`, this is readable without a session — the
 * first-user and forced-reset forms need it before one exists. It lives apart
 * from `queries.ts` so the unauthenticated `/login` and `/setup` loaders can
 * reach it without pulling in `@app/api`, and superagent with it. The policy is
 * served by a server function, so this module needs no HTTP client at all.
 */
export function passwordPolicyQueryOptions() {
	return queryOptions({
		queryKey: passwordPolicyQueryKeys.all(),
		queryFn: () => getPasswordPolicyFn(),
	});
}
