import BoxGroupSection from "@base/BoxGroupSection";
import Link from "@base/Link";
import ProgressCircle from "@base/ProgressCircle";
import { useFetchJob } from "@jobs/queries";
import type { SubtractionMinimal } from "@virtool/contracts";
import { SubtractionAttribution } from "./Attribution";

/**
 * A condensed subtraction item for use in a list of subtractions
 */
export function SubtractionItem({
	createdAt,
	id,
	job,
	name,
	ready,
	user,
}: SubtractionMinimal) {
	// The seed needs a user, and a job whose creator was removed has none — fall
	// back to fetching rather than priming the cache with a half-built job. The
	// jobs feature is still served from Python, so its seed keeps the
	// snake_case `created_at` field name.
	const { data: fetchedJob } = useFetchJob(
		job?.id ?? Number.NaN,
		job?.user
			? {
					created_at: job.createdAt,
					id: job.id,
					progress: job.progress,
					state: job.state,
					user: job.user,
					workflow: job.workflow,
				}
			: undefined,
	);

	return (
		<BoxGroupSection as="li" className="grid grid-cols-5 items-center">
			<Link
				className="col-span-2 text-lg font-medium"
				to="/subtractions/$subtractionId"
				params={{ subtractionId: String(id) }}
			>
				{name}
			</Link>
			<div className="col-span-2 flex justify-start">
				<SubtractionAttribution handle={user?.handle ?? ""} time={createdAt} />
			</div>
			{!ready && job && (
				<span className="flex items-center justify-end gap-1 font-medium">
					<ProgressCircle
						progress={fetchedJob?.progress ?? job.progress}
						state={fetchedJob?.state ?? job.state}
					/>
				</span>
			)}
		</BoxGroupSection>
	);
}
