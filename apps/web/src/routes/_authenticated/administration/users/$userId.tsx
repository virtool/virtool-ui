import { createFileRoute } from "@tanstack/react-router";
import UserDetail from "@users/components/UserDetail";

export const Route = createFileRoute(
	"/_authenticated/administration/users/$userId",
)({
	loader: async ({ context: { queryClient }, params: { userId } }) => {
		const [{ userQueryOptions }, { passwordPolicyQueryOptions }] =
			await Promise.all([
				import("@users/queries"),
				import("@administration/passwordPolicy"),
			]);

		return Promise.all([
			queryClient.ensureQueryData(userQueryOptions(Number(userId))),
			// Prefetched, not ensured: the password form applies no length rule until
			// this resolves, but a failure here must not take down the page.
			queryClient.prefetchQuery(passwordPolicyQueryOptions()),
		]);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { userId } = Route.useParams();
	return <UserDetail userId={Number(userId)} />;
}
