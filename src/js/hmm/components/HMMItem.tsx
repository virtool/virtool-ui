import { keys, map, reject } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../app/theme";
import { BoxLink, Label } from "../../base";
import { HMMMinimal } from "../types";

const StyledHMMItem = styled(BoxLink)`
    display: flex;
    font-size: ${getFontSize("lg")};
`;

const HMMItemCluster = styled.strong`
    flex: 0 0 48px;
    font-weight: ${getFontWeight("thick")};
`;

const HMMItemName = styled.span`
    flex: 1 0 auto;
`;

const HMMItemFamilies = styled.div`
    align-items: center;
    display: flex;
    font-size: ${getFontSize("md")};
    margin-left: auto;
`;

type HMMItemProps = {
    /** Minimal hmm data */
    hmm: HMMMinimal;
};

/**
 * A condensed hmm item for use in a list of hmms
 */
export default function HMMItem({ hmm }: HMMItemProps) {
    const filteredFamilies = reject(keys(hmm.families), family => family === "None");

    const labelComponents = map(filteredFamilies.slice(0, 3), (family, i) => (
        <Label key={i} spaced>
            {family}
        </Label>
    ));

    return (
        <StyledHMMItem to={`/hmm/${hmm.id}`}>
            <HMMItemCluster>{hmm.cluster}</HMMItemCluster>
            <HMMItemName>{hmm.names[0]}</HMMItemName>
            <HMMItemFamilies>
                {labelComponents} {filteredFamilies.length > 3 ? "..." : null}
            </HMMItemFamilies>
        </StyledHMMItem>
    );
}
