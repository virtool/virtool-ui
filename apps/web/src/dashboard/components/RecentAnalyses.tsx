import { useListRecentAnalyses } from "@analyses/queries";
import { checkSupportedWorkflow } from "@analyses/utils";
import { getWorkflowDisplayName } from "@app/utils";
import Attribution from "@base/Attribution";
import BoxGroup from "@base/BoxGroup";
import BoxGroupSection from "@base/BoxGroupSection";
import Link from "@base/Link";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import QueryError from "@base/QueryError";
import { ChartArea } from "lucide-react";
import { DASHBOARD_ITEM_COUNT } from "../constants";
import DashboardCard, {
	DashboardCardEmpty,
	DashboardCardMore,
} from "./DashboardCard";

type RecentAnalysesProps = {
	/** The id of the signed-in user, whose analyses are listed. */
	userId: number;
};

/**
 * The signed-in user's most recently started analyses, across every sample.
 *
 * There is no card action: analyses have no global list page to link to, so
 * each row links to the analysis itself.
 */
export default function RecentAnalyses({ userId }: RecentAnalysesProps) {
	const { data, isPending, isError } = useListRecentAnalyses(
		userId,
		DASHBOARD_ITEM_COUNT,
	);

	if (isError && !data) {
		return (
			<DashboardCard title="My analyses">
				<QueryError noun="analyses" />
			</DashboardCard>
		);
	}

	if (isPending) {
		return (
			<DashboardCard title="My analyses">
				<LoadingPlaceholder />
			</DashboardCard>
		);
	}

	const remaining = data.foundCount - data.items.length;

	return (
		<DashboardCard title="My analyses">
			{data.items.length === 0 ? (
				<DashboardCardEmpty
					description="Analyses you start will appear here."
					icon={ChartArea}
					title="No analyses yet"
				/>
			) : (
				<BoxGroup as="ul" className="mb-0">
					{data.items.map((analysis) => (
						<BoxGroupSection
							as="li"
							className="flex flex-wrap gap-x-4 gap-y-1 items-center"
							key={analysis.id}
						>
							{checkSupportedWorkflow(analysis.workflow) ? (
								<Link
									className="font-medium"
									params={{
										analysisId: String(analysis.id),
										sampleId: String(analysis.sample.id),
									}}
									to="/samples/$sampleId/analyses/$analysisId"
								>
									{getWorkflowDisplayName(analysis.workflow)}
								</Link>
							) : (
								<span className="font-medium">
									{getWorkflowDisplayName(analysis.workflow)}
								</span>
							)}
							<span className="text-sm text-gray-600">
								{analysis.reference.name}
							</span>
							<Attribution
								className="ml-auto text-sm"
								time={analysis.createdAt}
								user={analysis.user.handle}
							/>
						</BoxGroupSection>
					))}
					{remaining > 0 && (
						<DashboardCardMore>
							{remaining} more{" "}
							{remaining === 1 ? "analysis is" : "analyses are"} not shown
						</DashboardCardMore>
					)}
				</BoxGroup>
			)}
		</DashboardCard>
	);
}
