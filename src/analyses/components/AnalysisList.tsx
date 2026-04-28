import { buttonVariants } from "@base/buttonVariants";
import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import Pagination from "@base/Pagination";
import { useListHmms } from "@hmm/queries";
import { useCheckCanEditSample } from "@samples/hooks";
import { useFetchSample } from "@samples/queries";
import { getRouteApi } from "@tanstack/react-router";
import { useListAnalyses } from "../queries";
import type { AnalysisMinimal } from "../types";
import AnalysisItem from "./AnalysisItem";
import CreateAnalysis from "./Create/CreateAnalysis";
import AnalysisHMMAlert from "./HMMAlert";

const routeApi = getRouteApi("/_authenticated/samples/$sampleId/analyses/");

type AnalysesListProps = {
	openCreateAnalysis: boolean;
	page: number;
	setSearch: (next: { openCreateAnalysis?: boolean; page?: number }) => void;
};

function renderRow() {
	function AnalysisRow(document: AnalysisMinimal) {
		return <AnalysisItem key={document.id} analysis={document} />;
	}
	return AnalysisRow;
}

/**
 * A list of analyses with filtering options
 */
export default function AnalysesList({
	openCreateAnalysis,
	page,
	setSearch,
}: AnalysesListProps) {
	const { sampleId } = routeApi.useParams();
	const { data: analyses, isPending: isPendingAnalyses } = useListAnalyses(
		sampleId,
		page,
		25,
	);
	const { data: hmms, isPending: isPendingHmms } = useListHmms(1, 25);
	const { isPending: isPendingSample } = useFetchSample(sampleId);
	const { hasPermission: canCreate } = useCheckCanEditSample(sampleId);

	if (isPendingAnalyses || isPendingHmms || isPendingSample) {
		return <LoadingPlaceholder />;
	}

	return (
		<ContainerNarrow>
			<AnalysisHMMAlert installed={hmms.status.task?.complete} />
			<div className="flex justify-end pb-4">
				{canCreate && (
					<button
						type="button"
						className={buttonVariants({ color: "blue" })}
						onClick={() => setSearch({ openCreateAnalysis: true })}
					>
						Create
					</button>
				)}
			</div>
			{analyses.found_count ? (
				<Pagination
					items={analyses.documents}
					renderRow={renderRow()}
					storedPage={analyses.page}
					currentPage={page}
					pageCount={analyses.page_count}
					onPageChange={(page) => setSearch({ page })}
				/>
			) : (
				<NoneFoundBox noun="analyses" />
			)}

			<CreateAnalysis
				hmms={hmms}
				open={openCreateAnalysis}
				setOpen={(openCreateAnalysis) => setSearch({ openCreateAnalysis })}
				sampleId={sampleId}
			/>
		</ContainerNarrow>
	);
}
