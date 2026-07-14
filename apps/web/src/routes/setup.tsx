import { passwordPolicyQueryOptions } from "@administration/queries";
import { createFileRoute } from "@tanstack/react-router";
import FirstUser from "@wall/components/FirstUser";

export const Route = createFileRoute("/setup")({
	loader: async ({ context }) => {
		try {
			await context.queryClient.ensureQueryData(passwordPolicyQueryOptions());
		} catch {
			// A failed policy read must not take down setup. The form falls back to
			// the default minimum, and the server enforces the real one anyway.
		}
	},
	component: FirstUser,
});
