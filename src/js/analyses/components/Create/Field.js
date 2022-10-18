import styled from "styled-components";
import { getFontSize } from "../../../app/theme";

export const CreateAnalysisField = styled.div`
    align-items: stretch;
    column-gap: ${props => props.theme.gap.column};
    display: grid;
    grid-template-columns: 1fr 1fr;
`;

export const CreateAnalysisFieldTitle = styled.div`
    font-size: ${getFontSize("lg")};
    grid-column: 1 / 3;
    margin-bottom: 10px;
`;
