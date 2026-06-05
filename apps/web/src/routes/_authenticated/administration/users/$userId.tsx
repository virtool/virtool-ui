import { userQueryOptions } from "@administration/queries";
import { createFileRoute } from "@tanstack/react-router";
import UserDetail from "@users/components/UserDetail";

export const Route = createFileRoute(
	"/_authenticated/administration/users/$userId",
)({
	loader: ({ context: { queryClient }, params: { userId } }) =>
		queryClient.ensureQueryData(userQueryOptions(Number(userId))),
	component: RouteComponent,
});

function RouteComponent() {
	const { userId } = Route.useParams();
	return <UserDetail userId={Number(userId)} />;
}
