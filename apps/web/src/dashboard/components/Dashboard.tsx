import { useFetchAccount } from "@account/account";
import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import QueryError from "@base/QueryError";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import ActiveJobs from "./ActiveJobs";
import RecentAnalyses from "./RecentAnalyses";
import RecentSamples from "./RecentSamples";

/**
 * The landing page at `/`.
 *
 * Every card fetches independently and shows its own error, so one failing
 * request leaves the rest of the dashboard usable.
 */
export default function Dashboard() {
	const { data: account, isPending, isError } = useFetchAccount();

	if (isError && !account) {
		return <QueryError noun="your account" />;
	}

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	return (
		<ContainerNarrow>
			<ViewHeader title="Dashboard">
				<ViewHeaderTitle>Welcome back, {account.handle}</ViewHeaderTitle>
			</ViewHeader>

			<div className="flex flex-col gap-8">
				<RecentSamples userId={account.id} />
				<RecentAnalyses userId={account.id} />
				<ActiveJobs />
			</div>
		</ContainerNarrow>
	);
}
