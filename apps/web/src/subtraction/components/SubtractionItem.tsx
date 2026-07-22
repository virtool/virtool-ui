import BoxGroupSection from "@base/BoxGroupSection";
import Link from "@base/Link";
import ProgressCircle from "@base/ProgressCircle";
import { useFetchJob } from "@jobs/queries";
import type { SubtractionMinimal } from "../types";
import { SubtractionAttribution } from "./Attribution";

/**
 * A condensed subtraction item for use in a list of subtractions
 */
export function SubtractionItem({
	created_at,
	id,
	job,
	name,
	ready,
	user,
}: SubtractionMinimal) {
	const { data: fetchedJob } = useFetchJob(job?.id ?? Number.NaN, job);

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
				<SubtractionAttribution handle={user?.handle ?? ""} time={created_at} />
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
