import styled from "styled-components";

const SubviewHeaderTitle = styled.div`
    font-size: ${(props) => props.theme.fontSize.xl};
    font-weight: bold;
    margin-bottom: 0;
`;

SubviewHeaderTitle.displayName = "SubviewHeaderTitle";

export default SubviewHeaderTitle;
