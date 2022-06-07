import { map, reduce } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { borderRadius, getColor, getFontWeight } from "../../app/theme";
import { Badge } from "../../base";
import { getJobStateCounts } from "../selectors";

const SummaryContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 0 10px;
    text-transform: capitalize;
    span {
        margin-left: 5px;
    }
`;

const Accent = styled.div`
    width: 7px;
    height: 7px;
    background-color: ${getColor};
    margin: 0 5px;
    border-radius: 3.5px;
`;

export const getAccentColor = name => {
    switch (name) {
        case "error":
        case "failed":
        case "terminated":
            return "red";

        case "waiting":
        case "preparing":
            return "grey";
        case "running":
            return "blue";

        case "complete":
            return "green";

        default:
            return "transparent";
    }
};

export const SummaryTag = ({ counts, name }) => {
    const count = reduce(counts, (result, value) => result + value, 0);
    return (
        <SummaryContainer>
            <Accent color={getAccentColor(name)} />
            {name} <Badge>{count}</Badge>
        </SummaryContainer>
    );
};

const JobsSummaryContainer = styled.div`
    display: flex;
    background-color: ${props => getColor({ color: "greyLightest", theme: props.theme })};
    padding: 10px 0;
    border-radius: ${borderRadius.md};
    font-weight: ${getFontWeight("thick")};
    margin: -10px 0 15px;
    &>div: first-child {
        margin-left: 10px;
    }
`;

const jobStates = ["running", "preparing", "waiting", "complete", "error", "failed", "terminated"];

export const JobsSummary = ({ allCounts }) => {
    const summaries = map(jobStates, state => {
        return allCounts[state] ? <SummaryTag counts={allCounts[state]} name={state} key={state} /> : null;
    });

    return <JobsSummaryContainer>{summaries}</JobsSummaryContainer>;
};

export const mapStateToProps = state => {
    return {
        allCounts: getJobStateCounts(state)
    };
};

export default connect(mapStateToProps, null)(JobsSummary);
