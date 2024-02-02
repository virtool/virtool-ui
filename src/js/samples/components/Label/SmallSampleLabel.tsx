import styled from "styled-components";
import { getFontSize } from "../../../app/theme";
import { SampleLabel } from "./SampleLabel";

/**
 * Displays a smaller version of the sample label
 */
export const SmallSampleLabel = styled(SampleLabel)`
    font-size: ${getFontSize("sm")};
    padding: 2px 7px 2px 5px;

    i.fas {
        margin-right: 3px;
    }
`;
