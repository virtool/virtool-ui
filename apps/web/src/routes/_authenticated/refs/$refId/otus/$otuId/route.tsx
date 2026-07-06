import Badge from "@base/Badge";
import Link from "@base/Link";
import NavTab from "@base/NavTab";
import NavTabs from "@base/NavTabs";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderIcons from "@base/ViewHeaderIcons";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { OtuHeaderIcons } from "@otus/components/Detail/OtuHeaderIcons";
import { otuQueryOptions, useFetchOTU } from "@otus/queries";
import { useReferenceIsArchived } from "@references/hooks";
import { referenceQueryOptions, useFetchReference } from "@references/queries";
import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/refs/$refId/otus/$otuId")(
	{
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
	const navigate = Route.useNavigate();
	const { data: otu } = useFetchOTU(otuId);
	const { data: reference } = useFetchReference(refId);
	const archived = useReferenceIsArchived(refId);

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
					{archived && (
						<Badge className="ml-3 self-center" color="gray" variant="soft">
							Archived
						</Badge>
					)}
					<ViewHeaderIcons>
						<a href={`/api/otus/${id}.fa`} download>
							Download FASTA
						</a>
						{!archived && (
							<OtuHeaderIcons
								id={id}
								refId={refId}
								name={name}
								abbreviation={abbreviation}
								onRemoved={() => navigate({ to: `/refs/${refId}/otus` })}
							/>
						)}
					</ViewHeaderIcons>
				</ViewHeaderTitle>
				<p className="flex font-medium items-center gap-2 py-2">
					<Link to="/refs/$refId" params={{ refId }}>
						{reference.name}
					</Link>
					<span className="text-slate-600">/</span>
					<Link to="/refs/$refId/otus" params={{ refId }}>
						OTUs
					</Link>
					<span className="text-slate-600">/</span>
					<Link to="/refs/$refId/otus/$otuId" params={{ refId, otuId }}>
						{name}
					</Link>
				</p>
			</ViewHeader>

			<NavTabs>
				<NavTab to={`/refs/${refId}/otus/${otuId}/isolates`}>Isolates</NavTab>
				<NavTab to={`/refs/${refId}/otus/${otuId}/schema`}>Schema</NavTab>
				<NavTab to={`/refs/${refId}/otus/${otuId}/history`}>History</NavTab>
			</NavTabs>

			<Outlet />
		</>
	);
}
