import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NotFound from "@base/NotFound";
import RelativeTime from "@base/RelativeTime";
import SubviewHeader from "@base/SubviewHeader";
import SubviewHeaderAttribution from "@base/SubviewHeaderAttribution";
import SubviewHeaderTitle from "@base/SubviewHeaderTitle";
import { DownloadLink } from "@references/components/Detail/DownloadLink";
import { useFetchReference } from "@references/queries";
import { getRouteApi } from "@tanstack/react-router";
import { useFetchIndex } from "../queries";
import Contributors from "./Contributors";
import Files from "./IndexFiles";
import IndexOTUs from "./IndexOTUs";

const routeApi = getRouteApi("/_authenticated/refs/$refId/indexes/$indexId");

/**
 * The index detailed view
 */
export default function IndexDetail() {
	const { indexId, refId } = routeApi.useParams();
	const {
		data: index,
		isPending: isPendingIndex,
		isError,
	} = useFetchIndex(indexId);
	const { data: reference, isPending: isPendingReference } =
		useFetchReference(refId);

	if (isError) {
		return <NotFound />;
	}
	if (isPendingIndex || isPendingReference) {
		return <LoadingPlaceholder />;
	}

	const { contributors, created_at, files, id, otus, user, version } = index;

	return (
		<>
			<SubviewHeader>
				<SubviewHeaderTitle>Index {version}</SubviewHeaderTitle>
				<div className="flex items-center">
					<SubviewHeaderAttribution>
						{user.handle} built <RelativeTime time={created_at} />
					</SubviewHeaderAttribution>
					{reference.latest_build?.has_json && (
						<DownloadLink
							className="ml-auto"
							href={`/api/indexes/${id}/files/reference.json.gz`}
						>
							Download
						</DownloadLink>
					)}
				</div>
			</SubviewHeader>

			<ContainerNarrow>
				<Contributors contributors={contributors} />
				<Files files={files} />
				<IndexOTUs otus={otus} refId={refId} />
			</ContainerNarrow>
		</>
	);
}
