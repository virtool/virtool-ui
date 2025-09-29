import Box from "@base/Box";
import ExternalLink from "@base/ExternalLink";
import Icon from "@base/Icon";
import Loader from "@base/Loader";
import RelativeTime from "@base/RelativeTime";
import { addSeconds, formatDistanceStrict } from "date-fns";
import styled from "styled-components";

const ridRoot =
    "https://blast.ncbi.nlm.nih.gov/Blast.cgi?\
    CMD=Web&PAGE_TYPE=BlastFormatting&OLD_BLAST=false&GET_RID_INFO=on&RID=";

function RidLink({ rid }) {
    if (rid) {
        return (
            <span>
                <span> with RID </span>
                <ExternalLink href={ridRoot + rid}>
                    {rid}{" "}
                    <sup>
                        <Icon name="new-tab" />
                    </sup>
                </ExternalLink>
            </span>
        );
    }

    return null;
}

function RidTiming({ interval, lastCheckedAt }) {
    if (lastCheckedAt) {
        const nextCheckAt = addSeconds(new Date(lastCheckedAt), interval);
        const relativeNext = formatDistanceStrict(
            new Date(nextCheckAt),
            Date.now(),
        );

        return (
            <div className="ml-auto text-gray-700">
                Last checked <RelativeTime time={lastCheckedAt} />. Checking
                again in {relativeNext}
            </div>
        );
    }

    return null;
}

const StyledBLASTInProgress = styled(Box)`
    align-items: flex-start;
    display: flex;

    div:first-of-type {
        margin-right: 5px;
    }
`;

export default function NuvsBlastPending({ interval, lastCheckedAt, rid }) {
    return (
        <StyledBLASTInProgress>
            <Loader size="16px" color="primary" />
            <div>
                <div>
                    <span className="font-medium">BLAST in progress</span>
                    <RidLink rid={rid} />
                </div>
                <RidTiming interval={interval} lastCheckedAt={lastCheckedAt} />
            </div>
        </StyledBLASTInProgress>
    );
}
