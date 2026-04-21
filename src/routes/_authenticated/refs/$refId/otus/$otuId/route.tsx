import { cn } from "@app/utils";
import Link from "@base/Link";
import Tabs from "@base/Tabs";
import TabsLink from "@base/TabsLink";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderIcons from "@base/ViewHeaderIcons";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { OtuHeaderIcons } from "@otus/components/Detail/OtuHeaderIcons";
import { otuQueryOptions, useFetchOTU } from "@otus/queries";
import { referenceQueryOptions, useFetchReference } from "@references/queries";
import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { z } from "zod/v4";

const otuDetailSearchSchema = z.object({
	activeIsolate: z.string().optional().catch(undefined),
	openAddIsolate: z.boolean().optional().catch(undefined),
	openEditOTU: z.boolean().optional().catch(undefined),
	openRemoveOTU: z.boolean().optional().catch(undefined),
	openEditIsolate: z.boolean().optional().catch(undefined),
	openRemoveIsolate: z.boolean().optional().catch(undefined),
	openAddSegment: z.boolean().optional().catch(undefined),
	editSegmentName: z.string().optional().catch(undefined),
	removeSegmentName: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/_authenticated/refs/$refId/otus/$otuId")(
	{
		validateSearch: otuDetailSearchSchema,
		loader: async ({ context: { queryClient }, params: { refId, otuId } }) => {
			try {
				await Promise.all([
					queryClient.ensureQueryData(referenceQueryOptions(refId)),
					queryClient.ensureQueryData(otuQueryOptions(otuId)),
				]);
			} catch (error) {
				if (error?.response?.status === 404) {
					throw notFound();
				}
				throw error;
			}
		},
		component: OtuDetailLayout,
	},
);

function OtuDetailLayout() {
	const { refId, otuId } = Route.useParams();
	const { data: otu } = useFetchOTU(otuId);
	const { data: reference } = useFetchReference(refId);

	if (!otu || !reference) {
		return null;
	}

	const { id, name, abbreviation } = otu;

	return (
		<>
			<ViewHeader title={name}>
				<ViewHeaderTitle className="items-baseline">
					{name}{" "}
					<small className="text-gray-500 font-semibold ml-1.5">
						{abbreviation || <em className="font-normal">No Abbreviation</em>}
					</small>
					<ViewHeaderIcons>
						<a href={`/api/otus/${id}.fa`} download>
							Download FASTA
						</a>
						<OtuHeaderIcons
							id={id}
							refId={refId}
							name={name}
							abbreviation={abbreviation}
						/>
					</ViewHeaderIcons>
				</ViewHeaderTitle>
				<p
					className={cn(
						"flex",
						"font-medium",
						"items-center",
						"gap-2",
						"py-2",
						"text-lg",
					)}
				>
					<Link to={`/refs/${refId}`}>{reference.name}</Link>
					<span className="text-slate-600">/</span>
					<Link to={`/refs/${refId}/otus`}>OTUs</Link>
					<span className="text-slate-600">/</span>
					<Link to={`/refs/${refId}/otus/${otuId}`}>{name}</Link>
				</p>
			</ViewHeader>

			<Tabs>
				<TabsLink to={`/refs/${refId}/otus/${otuId}/otu`}>OTU</TabsLink>
				<TabsLink to={`/refs/${refId}/otus/${otuId}/schema`}>Schema</TabsLink>
				<TabsLink to={`/refs/${refId}/otus/${otuId}/history`}>History</TabsLink>
			</Tabs>

			<Outlet />
		</>
	);
}
