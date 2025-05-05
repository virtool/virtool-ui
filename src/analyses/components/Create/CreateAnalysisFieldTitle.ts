import styled from "styled-components";
import { getFontSize } from "../../../app/theme";

const CreateAnalysisFieldTitle = styled.div`
    font-size: ${getFontSize("lg")};
    grid-column: 1 / 3;
    margin-bottom: 10px;
`;

CreateAnalysisFieldTitle.displayName = "CreateAnalysisFieldTitle";

export default CreateAnalysisFieldTitle;
