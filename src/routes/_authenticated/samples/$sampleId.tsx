import { useDialogParam } from "@app/hooks";
import Icon from "@base/Icon";
import IconButton from "@base/IconButton";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import Tabs from "@base/Tabs";
import TabsLink from "@base/TabsLink";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderAttribution from "@base/ViewHeaderAttribution";
import ViewHeaderIcons from "@base/ViewHeaderIcons";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import DeleteSample from "@samples/components/Detail/DeleteSample";
import { useCheckCanEditSample } from "@samples/hooks";
import { sampleQueryOptions, useFetchSample } from "@samples/queries";
import {
	createFileRoute,
	notFound,
	Outlet,
	useLocation,
} from "@tanstack/react-router";
import { Key, Pencil } from "lucide-react";
import { JobNested } from "@/jobs/types";

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
	const { sampleId } = Route.useParams();
	const location = useLocation();
	const { data, isPending } = useFetchSample(sampleId);
	const { hasPermission: canModify } = useCheckCanEditSample(sampleId);
	const { setOpen: setOpenEditSample } = useDialogParam("openEditSample");

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	const { created_at, name, user } = data;
	const job = data.job && JobNested.parse(data.job);

	return (
		<>
			<ViewHeader title={name}>
				<ViewHeaderTitle>
					{name}
					<ViewHeaderIcons>
						{canModify && location.pathname.endsWith("/general") && (
							<>
								<IconButton
									color="grayDark"
									IconComponent={Pencil}
									tip="modify"
									onClick={() => setOpenEditSample(true)}
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

			<Tabs>
				<TabsLink to={`/samples/${sampleId}/general`}>General</TabsLink>
				{data.ready && (
					<>
						<TabsLink to={`/samples/${sampleId}/files`}>Files</TabsLink>
						<TabsLink to={`/samples/${sampleId}/quality`}>Quality</TabsLink>
						<TabsLink to={`/samples/${sampleId}/analyses`}>Analyses</TabsLink>
						{canModify && (
							<TabsLink to={`/samples/${sampleId}/rights`}>
								<Icon icon={Key} />
							</TabsLink>
						)}
					</>
				)}
			</Tabs>

			<Outlet />
		</>
	);
}
