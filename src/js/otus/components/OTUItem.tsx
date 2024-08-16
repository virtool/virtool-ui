import { getFontSize, getFontWeight } from "@app/theme";
import { BoxGroupSection } from "@base";
import { cn } from "@utils/utils";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const OTUItemName = styled(Link)`
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
`;

const OTUItemUnverified = styled.span`
    display: flex;
    justify-content: flex-end;
`;

const OTUItemAbbreviation = styled.span`
    display: flex;
    justify-content: flex-start;
`;

type OTUItemProps = {
    abbreviation: string;
    id: string;
    name: string;
    refId: string;
    verified: boolean;
};

/**
 * A condensed OTU item for use in a list of OTUs
 */
export default function OTUItem({ abbreviation, id, name, refId, verified }: OTUItemProps) {
    return (
        <BoxGroupSection className={cn("items-center", "grid", "grid-cols-[5fr_2fr_1fr]")} key={id}>
            <OTUItemName to={`/refs/${refId}/otus/${id}`}>{name}</OTUItemName>
            <OTUItemAbbreviation>{abbreviation}</OTUItemAbbreviation>
            {verified || <OTUItemUnverified>Unverified</OTUItemUnverified>}
        </BoxGroupSection>
    );
}
