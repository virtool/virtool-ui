import { passwordPolicyQueryOptions } from "@administration/queries";
import { createFileRoute } from "@tanstack/react-router";
import FirstUser from "@wall/components/FirstUser";

export const Route = createFileRoute("/setup")({
	// prefetchQuery rather than ensureQueryData: a failed policy read must not
	// take down setup. The form then applies no length rule and the server, which
	// is authoritative, rejects a short password with a message quoting it.
	loader: ({ context }) =>
		context.queryClient.prefetchQuery(passwordPolicyQueryOptions()),
	component: FirstUser,
});
