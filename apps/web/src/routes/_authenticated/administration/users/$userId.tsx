import { passwordPolicyQueryOptions } from "@administration/queries";
import { createFileRoute } from "@tanstack/react-router";
import UserDetail from "@users/components/UserDetail";
import { userQueryOptions } from "@users/queries";

export const Route = createFileRoute(
	"/_authenticated/administration/users/$userId",
)({
	loader: ({ context: { queryClient }, params: { userId } }) =>
		Promise.all([
			queryClient.ensureQueryData(userQueryOptions(Number(userId))),
			// Prefetched, not ensured: the password form applies no length rule until
			// this resolves, but a failure here must not take down the page.
			queryClient.prefetchQuery(passwordPolicyQueryOptions()),
		]),
	component: RouteComponent,
});

function RouteComponent() {
	const { userId } = Route.useParams();
	return <UserDetail userId={Number(userId)} />;
}
