import { buttonVariants } from "@base/buttonVariants";
import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import Pagination from "@base/Pagination";
import QueryError from "@base/QueryError";
import { useListHmms } from "@hmm/queries";
import { useCheckCanEditSample } from "@samples/hooks";
import { useFetchSample } from "@samples/queries";
import { useState } from "react";
import { useListAnalyses } from "../queries";
import type { AnalysisMinimal } from "../types";
import AnalysisItem from "./AnalysisItem";
import CreateAnalysis from "./Create/CreateAnalysis";
import AnalysisHMMAlert from "./HMMAlert";

type AnalysesListProps = {
	onPageChange: (page: number) => void;
	page: number;
	sampleId: string;
};

function renderRow() {
	function AnalysisRow(item: AnalysisMinimal) {
		return <AnalysisItem key={item.id} analysis={item} />;
	}
	return AnalysisRow;
}

/**
 * A list of analyses with filtering options
 */
export default function AnalysesList({
	onPageChange,
	page,
	sampleId,
}: AnalysesListProps) {
	const [openCreateAnalysis, setOpenCreateAnalysis] = useState(false);
	const {
		data: analyses,
		isPending: isPendingAnalyses,
		isError: isErrorAnalyses,
	} = useListAnalyses(sampleId, page, 25);
	const {
		data: hmms,
		isPending: isPendingHmms,
		isError: isErrorHmms,
	} = useListHmms(1, 25);
	const {
		data: sample,
		isPending: isPendingSample,
		isError: isErrorSample,
	} = useFetchSample(sampleId);
	const { hasPermission: canCreate } = useCheckCanEditSample(sampleId);

	if (
		(isErrorAnalyses && !analyses) ||
		(isErrorHmms && !hmms) ||
		(isErrorSample && !sample)
	) {
		return <QueryError noun="analyses" />;
	}

	if (
		isPendingAnalyses ||
		isPendingHmms ||
		isPendingSample ||
		!analyses ||
		!hmms
	) {
		return <LoadingPlaceholder />;
	}

	return (
		<ContainerNarrow>
			<AnalysisHMMAlert
				installed={Boolean(
					hmms.status.installed?.ready ?? hmms.status.task?.complete,
				)}
			/>
			<div className="flex justify-end pb-4">
				{canCreate && (
					<button
						type="button"
						className={buttonVariants({ color: "blue" })}
						onClick={() => setOpenCreateAnalysis(true)}
					>
						Create
					</button>
				)}
			</div>
			{analyses.found_count ? (
				<Pagination
					items={analyses.items}
					renderRow={renderRow()}
					storedPage={analyses.page}
					currentPage={page}
					pageCount={analyses.page_count}
					onPageChange={onPageChange}
				/>
			) : (
				<NoneFoundBox noun="analyses" />
			)}

			<CreateAnalysis
				hmms={hmms}
				open={openCreateAnalysis}
				setOpen={setOpenCreateAnalysis}
				sampleId={sampleId}
			/>
		</ContainerNarrow>
	);
}
