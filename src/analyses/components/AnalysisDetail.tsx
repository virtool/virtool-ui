import NuvsViewer from "@analyses/components/Nuvs/NuvsViewer";
import { getWorkflowDisplayName } from "@app/utils";
import Box from "@base/Box";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import RelativeTime from "@base/RelativeTime";
import SubviewHeader from "@base/SubviewHeader";
import SubviewHeaderAttribution from "@base/SubviewHeaderAttribution";
import SubviewHeaderTitle from "@base/SubviewHeaderTitle";
import { useFetchSample } from "@samples/queries";
import { getRouteApi } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { useGetAnalysis } from "../queries";
import type {
	FormattedIimiAnalysis,
	FormattedNuvsAnalysis,
	FormattedPathoscopeAnalysis,
} from "../types";
import { IimiViewer } from "./Iimi/IimiViewer";
import { PathoscopeViewer } from "./Pathoscope/PathoscopeViewer";

const routeApi = getRouteApi(
	"/_authenticated/samples/$sampleId/analyses/$analysisId",
);

/** Base component viewing all supported analysis */
export default function AnalysisDetail() {
	const { analysisId, sampleId } = routeApi.useParams();
	const { data: analysis, isPending } = useGetAnalysis(analysisId);
	const { data: sample, isPending: isPendingSample } = useFetchSample(sampleId);

	if (isPending || isPendingSample) {
		return <LoadingPlaceholder />;
	}

	if (!analysis.ready) {
		return (
			<Box>
				<LoadingPlaceholder className="mt-5" message="Analysis in progress" />
			</Box>
		);
	}

	let content: ReactNode;

	if (analysis.workflow === "pathoscope_bowtie") {
		content = (
			<PathoscopeViewer
				analysis={analysis as FormattedPathoscopeAnalysis}
				sample={sample}
			/>
		);
	} else if (analysis.workflow === "nuvs") {
		content = (
			<NuvsViewer detail={analysis as FormattedNuvsAnalysis} sample={sample} />
		);
	} else if (analysis.workflow === "iimi") {
		content = <IimiViewer detail={analysis as FormattedIimiAnalysis} />;
	} else {
		return (
			<Box className="flex justify-center items-center">
				<CircleAlert className="mr-1" />
				Workflow not supported.
			</Box>
		);
	}

	return (
		<div>
			<SubviewHeader>
				<SubviewHeaderTitle>
					{getWorkflowDisplayName(analysis.workflow)} for {sample.name}
				</SubviewHeaderTitle>
				<SubviewHeaderAttribution>
					{analysis.user.handle} started{" "}
					<RelativeTime time={analysis.created_at} />
				</SubviewHeaderAttribution>
			</SubviewHeader>

			{content}
		</div>
	);
}
