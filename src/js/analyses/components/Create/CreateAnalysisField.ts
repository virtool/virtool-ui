import styled from "styled-components";

const CreateAnalysisField = styled.div`
    align-items: stretch;
    column-gap: ${(props) => props.theme.gap.column};
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 30px;
`;

export default CreateAnalysisField;
