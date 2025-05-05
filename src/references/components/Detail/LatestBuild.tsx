import React from "react";
import styled from "styled-components";
import BoxGroupSection from "../../../base/BoxGroupSection";
import Link from "../../../base/Link";
import NoneFoundSection from "../../../base/NoneFoundSection";
import RelativeTime from "../../../base/RelativeTime";
import { ReferenceBuild } from "../../types";

const StyledLatestBuild = styled(BoxGroupSection)`
    align-items: center;
    display: flex;

    a {
        margin-left: auto;
    }
`;

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
            <StyledLatestBuild>
                <div>
                    <strong>
                        <Link to={`/refs/${id}/indexes/${latestBuild.id}`}>
                            Index {latestBuild.version}
                        </Link>
                    </strong>
                    <span>
                        &nbsp;/ Created{" "}
                        <RelativeTime time={latestBuild.created_at} /> by{" "}
                        {latestBuild.user.handle}
                    </span>
                </div>
            </StyledLatestBuild>
        );
    }

    return <NoneFoundSection noun="index builds" />;
}
