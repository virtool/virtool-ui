import { getFontSize, getFontWeight } from "@app/theme";
import BoxGroupSection from "@base/BoxGroupSection";
import Link from "@base/Link";
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

const StyledOTUItem = styled(BoxGroupSection)`
    align-items: center;
    display: grid;
    grid-template-columns: 5fr 2fr 1fr;
`;

type OtuItemProps = {
    abbreviation: string;
    id: string;
    name: string;
    refId: string;
    verified: boolean;
};

/**
 * A condensed OTU item for use in a list of OTUs
 */
export default function OtuItem({
    abbreviation,
    id,
    name,
    refId,
    verified,
}: OtuItemProps) {
    return (
        <StyledOTUItem key={id}>
            <OTUItemName to={`/refs/${refId}/otus/${id}`}>{name}</OTUItemName>
            <OTUItemAbbreviation>{abbreviation}</OTUItemAbbreviation>
            {verified || <OTUItemUnverified>Unverified</OTUItemUnverified>}
        </StyledOTUItem>
    );
}
