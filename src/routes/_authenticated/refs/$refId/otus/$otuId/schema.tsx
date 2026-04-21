import Schema from "@otus/components/Detail/Schema/Schema";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/refs/$refId/otus/$otuId/schema",
)({
	component: Schema,
});
