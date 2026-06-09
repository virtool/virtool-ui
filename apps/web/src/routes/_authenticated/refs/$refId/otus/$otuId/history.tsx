import OtuHistory from "@otus/components/Detail/History/OtuHistory";
import { otuHistoryQueryOptions } from "@otus/queries";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/refs/$refId/otus/$otuId/history",
)({
	loader: async ({ context: { queryClient }, params: { otuId } }) => {
		try {
			await queryClient.ensureQueryData(otuHistoryQueryOptions(otuId));
		} catch (error) {
			if (error?.response?.status === 404) {
				throw notFound();
			}
			throw error;
		}
	},
	component: OtuHistory,
});
