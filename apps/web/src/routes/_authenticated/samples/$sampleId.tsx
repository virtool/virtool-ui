import Icon from "@base/Icon";
import IconButton from "@base/IconButton";
import NavTab from "@base/NavTab";
import NavTabs from "@base/NavTabs";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderAttribution from "@base/ViewHeaderAttribution";
import ViewHeaderIcons from "@base/ViewHeaderIcons";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { JobNestedSchema } from "@jobs/types";
import DeleteSample from "@samples/components/Detail/DeleteSample";
import EditSample from "@samples/components/EditSample";
import { useCheckCanEditSample } from "@samples/hooks";
import { useSuspenseSample } from "@samples/queries";
import {
	createFileRoute,
	notFound,
	Outlet,
	useLocation,
} from "@tanstack/react-router";
import { Key, Pencil } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/samples/$sampleId")({
	loader: async ({ context: { queryClient }, params: { sampleId } }) => {
		const { sampleQueryOptions } = await import("@samples/queries");

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
	const { sampleId } = Route.useParams();
	const location = useLocation();
	const { data } = useSuspenseSample(sampleId);
	const { hasPermission: canModify } = useCheckCanEditSample(sampleId);
	const [editOpen, setEditOpen] = useState(false);

	const { created_at, name, user } = data;
	const job = data.job && JobNestedSchema.parse(data.job);

	return (
		<>
			<ViewHeader title={name}>
				<ViewHeaderTitle>
					{name}
					<ViewHeaderIcons>
						{canModify && location.pathname.endsWith("/general") && (
							<>
								<IconButton
									color="gray"
									IconComponent={Pencil}
									tip="modify"
									onClick={() => setEditOpen(true)}
								/>
								<DeleteSample
									id={sampleId}
									name={data.name}
									ready={data.ready}
									job={job}
								/>
							</>
						)}
					</ViewHeaderIcons>
				</ViewHeaderTitle>
				<ViewHeaderAttribution time={created_at} user={user.handle} />
			</ViewHeader>

			<NavTabs>
				<NavTab to={`/samples/${sampleId}/general`}>General</NavTab>
				{data.ready && (
					<>
						<NavTab to={`/samples/${sampleId}/files`}>Files</NavTab>
						<NavTab to={`/samples/${sampleId}/quality`}>Quality</NavTab>
						<NavTab to={`/samples/${sampleId}/analyses`}>Analyses</NavTab>
						{canModify && (
							<NavTab to={`/samples/${sampleId}/rights`}>
								<Icon icon={Key} />
							</NavTab>
						)}
					</>
				)}
			</NavTabs>

			<Outlet />

			<EditSample open={editOpen} sample={data} setOpen={setEditOpen} />
		</>
	);
}
