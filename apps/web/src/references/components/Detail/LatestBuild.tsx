import BoxGroupSection from "@base/BoxGroupSection";
import { Empty, EmptyMedia, EmptyTitle } from "@base/Empty";
import Link from "@base/Link";
import RelativeTime from "@base/RelativeTime";
import type { ReferenceBuild } from "@references/types";
import { CircleAlert } from "lucide-react";

type LatestBuildProps = {
	id: string;
	/** Information related to the latest index build */
	latestBuild: ReferenceBuild | null;
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
						<Link
							to="/refs/$refId/indexes/$indexId"
							params={{ refId: id, indexId: latestBuild.id }}
						>
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

	return (
		<BoxGroupSection>
			<Empty orientation="horizontal">
				<EmptyMedia>
					<CircleAlert size={18} />
				</EmptyMedia>
				<EmptyTitle>No index builds found</EmptyTitle>
			</Empty>
		</BoxGroupSection>
	);
}
