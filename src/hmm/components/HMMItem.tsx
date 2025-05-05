import { keys, map, reject } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../app/theme";
import BoxGroupSection from "../../base/BoxGroupSection";
import Label from "../../base/Label";
import Link from "../../base/Link";
import { HMMMinimal } from "../types";

const StyledHMMItem = styled(BoxGroupSection)`
    display: flex;
    font-size: ${getFontSize("lg")};
`;

const HMMItemCluster = styled.strong`
    flex: 0 0 48px;
    font-weight: ${getFontWeight("thick")};
`;

const HMMItemName = styled(Link)`
    flex: 1 0 auto;
`;

const HMMItemFamilies = styled.div`
    align-items: center;
    display: flex;
    font-size: ${getFontSize("md")};
    margin-left: auto;
    gap: 5px;
`;

type HMMItemProps = {
    /** Minimal hmm data */
    hmm: HMMMinimal;
};

/**
 * A condensed hmm item for use in a list of hmms
 */
export default function HMMItem({ hmm }: HMMItemProps) {
    const filteredFamilies = reject(
        keys(hmm.families),
        (family) => family === "None",
    );

    const labelComponents = map(filteredFamilies.slice(0, 3), (family, i) => (
        <Label key={i}>{family}</Label>
    ));

    return (
        <StyledHMMItem>
            <HMMItemCluster>{hmm.cluster}</HMMItemCluster>
            <HMMItemName to={`/hmm/${hmm.id}`}>{hmm.names[0]}</HMMItemName>
            <HMMItemFamilies>
                {labelComponents} {filteredFamilies.length > 3 ? "..." : null}
            </HMMItemFamilies>
        </StyledHMMItem>
    );
}
