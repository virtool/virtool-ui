import { useQueryClient } from "@tanstack/react-query";
import { replace } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { Box, ExternalLink, Icon, LoadingPlaceholder, ProgressBarAffixed } from "../../base";
import { hmmQueryKeys, useListHmms } from "../querys";
import InstallOption from "./InstallOption";

const HMMInstalling = styled(Box)`
    display: flex;
    justify-content: center;

    h3 {
        font-size: ${props => props.theme.fontSize.xl};
    }

    p {
        text-align: center;
        text-transform: capitalize;
    }
`;

const StyledHMMInstaller = styled(Box)`
    display: flex;
    justify-content: center;
    padding: 35px 0;

    h3 {
        font-size: ${props => props.theme.fontSize.xl};
        font-weight: 500;
        margin: 0 0 3px;
    }

    > i {
        font-size: 32px;
        margin: 3px 10px 0;
    }
`;

/**
 * Displays the installation progress information or provides the option to install HMMs
 */
export function HMMInstaller() {
    const { data, isLoading } = useListHmms(1, 25);
    const queryClient = useQueryClient();

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    const {
        status: { installed, task },
    } = data;

    if (task?.complete) {
        queryClient.invalidateQueries(hmmQueryKeys.lists());
    }

    if (task && !installed) {
        const progress = task.progress;
        const step = replace(task.step, "_", " ");

        return (
            <HMMInstalling>
                <ProgressBarAffixed color="blue" now={progress} />
                <div>
                    <h3>Installing</h3>
                    <p>{step}</p>
                </div>
            </HMMInstalling>
        );
    }

    return (
        <StyledHMMInstaller>
            <Icon name="info-circle" />
            <div>
                <h3>No HMM data available.</h3>
                <p>
                    You can download and install the official HMM data automatically from our
                    <ExternalLink href="https://github.com/virtool/virtool-hmm"> GitHub repository</ExternalLink>.
                </p>
                <InstallOption />
            </div>
        </StyledHMMInstaller>
    );
}
