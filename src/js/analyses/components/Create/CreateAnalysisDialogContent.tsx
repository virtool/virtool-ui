import styled, { keyframes } from "styled-components";
import { DialogContent } from "../../../base";

const createAnalysisOpen = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -2%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0%) scale(1);
  }
`;

export const CreateAnalysisDialogContent = styled(DialogContent)`
    animation: ${createAnalysisOpen} 150ms cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 5%;
    transform: translate(-50%, 0%);
    width: 700px;

    form {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
`;
