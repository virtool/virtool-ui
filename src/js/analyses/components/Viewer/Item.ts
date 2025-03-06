import { getActiveShadow } from "@app/theme";
import Box from "@base/Box";
import styled from "styled-components";

export const AnalysisViewerItem = styled(Box)`
    border-bottom: none;
    border-left: none;
    border-radius: 0;
    box-shadow: ${getActiveShadow};
    margin: 0;
`;
