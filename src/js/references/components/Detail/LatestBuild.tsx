import { BoxGroupSection, NoneFoundSection, RelativeTime } from "@base";
import { ReferenceBuild } from "@references/types";
import { cn } from "@utils/utils";
import React from "react";
import { Link } from "react-router-dom";

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
            <BoxGroupSection className={cn("flex", "items-center")}>
                <div>
                    <strong>
                        <Link to={`/refs/${id}/indexes/${latestBuild.id}`}>Index {latestBuild.version}</Link>
                    </strong>
                    <span>
                        &nbsp;/ Created <RelativeTime time={latestBuild.created_at} /> by {latestBuild.user.handle}
                    </span>
                </div>
            </BoxGroupSection>
        );
    }

    return <NoneFoundSection noun="index builds" />;
}
