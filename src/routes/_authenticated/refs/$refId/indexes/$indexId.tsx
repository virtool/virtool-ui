import IndexDetail from "@indexes/components/IndexDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/refs/$refId/indexes/$indexId",
)({
	component: IndexDetail,
});
