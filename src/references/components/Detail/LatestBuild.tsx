import BoxGroupSection from "@base/BoxGroupSection";
import Link from "@base/Link";
import NoneFoundSection from "@base/NoneFoundSection";
import RelativeTime from "@base/RelativeTime";
import type { ReferenceBuild } from "@references/types";

type LatestBuildProps = {
	id: string;
	/** Information related to the latest index build */
	latestBuild: ReferenceBuild;
};

/**
 * Displays the latest index build information associated with the reference
 */
export function LatestBuild({ id, latestBuild }: LatestBuildProps) {
	if (latestBuild) {
		return (
			<BoxGroupSection className="flex items-center">
				<div>
					<strong>
						<Link to={`/refs/${id}/indexes/${latestBuild.id}`}>
							Index {latestBuild.version}
						</Link>
					</strong>
					<span>
						&nbsp;/ Created <RelativeTime time={latestBuild.created_at} /> by{" "}
						{latestBuild.user.handle}
					</span>
				</div>
			</BoxGroupSection>
		);
	}

	return <NoneFoundSection noun="index builds" />;
}
