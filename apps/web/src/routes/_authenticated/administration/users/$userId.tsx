import { createFileRoute } from "@tanstack/react-router";
import UserDetail from "@users/components/UserDetail";

export const Route = createFileRoute(
	"/_authenticated/administration/users/$userId",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { userId } = Route.useParams();
	return <UserDetail userId={Number(userId)} />;
}
