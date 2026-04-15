import BoxGroupSection from "@base/BoxGroupSection";
import Link from "@base/Link";
import ProgressCircle, { sizes } from "@base/ProgressCircle";
import { JobNested } from "@jobs/types";
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
	nickname,
	ready,
	user,
}: SubtractionMinimal) {
	const parsedJob = job && JobNested.parse(job);

	return (
		<BoxGroupSection className="ml-auto grid items-center leading-none py-4 grid-cols-[30%_30%_30%_auto]">
			<Link className="text-base font-medium" to={`/subtractions/${id}`}>
				{name}
			</Link>
			<div>{nickname}</div>
			<div className="flex justify-start">
				<SubtractionAttribution handle={user.handle} time={created_at} />
			</div>
			{!ready && job && (
				<span className="flex items-center justify-end text-base font-medium [&>svg]:mr-1">
					<ProgressCircle
						size={sizes.md}
						progress={parsedJob.progress}
						state={parsedJob.state ?? "pending"}
					/>
				</span>
			)}
		</BoxGroupSection>
	);
}
