import SubtractionDetail from "@subtraction/components/Detail/SubtractionDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/subtractions/$subtractionId",
)({
	component: SubtractionDetail,
});
