import styled from "styled-components";
import Attribution from "./Attribution";

const ViewHeaderAttribution = styled(Attribution)`
    font-size: ${(props) => props.theme.fontSize.md};
    margin-top: 5px;
`;

ViewHeaderAttribution.displayName = "ViewHeaderAttribution";

export default ViewHeaderAttribution;
