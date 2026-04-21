import { sampleQueryOptions } from "@samples/queries";
import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/samples/$sampleId")({
	loader: async ({ context: { queryClient }, params: { sampleId } }) => {
		try {
			await queryClient.ensureQueryData(sampleQueryOptions(sampleId));
		} catch (error) {
			if (
				error != null &&
				typeof error === "object" &&
				"response" in error &&
				(error as { response: { status: number } }).response.status === 404
			) {
				throw notFound();
			}
			throw error;
		}
	},
	component: SampleDetailLayout,
});

function SampleDetailLayout() {
	return <Outlet />;
}
