import { BoxGroupSection, NoneFoundSection, RelativeTime } from "@base";
import { cn } from "@utils/utils.js";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { DownloadLink } from "./DownloadLink";

export const LatestBuild = ({ id, latestBuild }) => {
    if (latestBuild) {
        return (
            <BoxGroupSection className={cn("items-center", "flex")}>
                <div>
                    <strong>
                        <Link to={`/refs/${id}/indexes/${latestBuild.id}`}>Index {latestBuild.version}</Link>
                    </strong>
                    <span>
                        &nbsp;/ Created <RelativeTime time={latestBuild.created_at} /> by {latestBuild.user.handle}
                    </span>
                </div>
                {latestBuild.has_json && <DownloadLink id={latestBuild.id} />}
            </BoxGroupSection>
        );
    }

    return <NoneFoundSection noun="index builds" />;
};

LatestBuild.propTypes = {
    id: PropTypes.string,
    latestBuild: PropTypes.object,
};
