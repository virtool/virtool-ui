import BoxGroup from "@base/BoxGroup";
import Link from "@base/Link";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import QueryError from "@base/QueryError";
import JobItem from "@jobs/components/JobItem";
import { jobsQueryOptions } from "@jobs/queries";
import { useQuery } from "@tanstack/react-query";
import type { JobState } from "@virtool/contracts";
import { Cog } from "lucide-react";
import { DASHBOARD_ITEM_COUNT } from "../constants";
import DashboardCard, {
	DashboardCardEmpty,
	DashboardCardMore,
} from "./DashboardCard";

/** Matches the default view of the jobs list. */
const activeStates: JobState[] = ["pending", "running"];

/** The jobs currently pending or running, account-wide. */
export default function ActiveJobs() {
	const { data, isPending, isError } = useQuery(
		jobsQueryOptions(1, DASHBOARD_ITEM_COUNT, activeStates),
	);

	const action = <Link to="/jobs">View all</Link>;

	if (isError && !data) {
		return (
			<DashboardCard action={action} title="Active jobs">
				<QueryError noun="jobs" />
			</DashboardCard>
		);
	}

	if (isPending) {
		return (
			<DashboardCard action={action} title="Active jobs">
				<LoadingPlaceholder />
			</DashboardCard>
		);
	}

	const remaining = data.foundCount - data.items.length;

	return (
		<DashboardCard action={action} title="Active jobs">
			{data.items.length === 0 ? (
				<DashboardCardEmpty
					description="Jobs that are pending or running will appear here."
					icon={Cog}
					title="Nothing running"
				/>
			) : (
				<BoxGroup as="ul" className="mb-0">
					{data.items.map((job) => (
						<JobItem as="li" key={job.id} {...job} />
					))}
					{remaining > 0 && (
						<DashboardCardMore>
							<Link search={{ state: activeStates }} to="/jobs">
								View {remaining} more active {remaining === 1 ? "job" : "jobs"}
							</Link>
						</DashboardCardMore>
					)}
				</BoxGroup>
			)}
		</DashboardCard>
	);
}
