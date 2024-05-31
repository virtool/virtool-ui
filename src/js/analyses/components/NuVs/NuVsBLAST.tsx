import { BLASTResults } from "@/analyses/components/NuVs/BLASTResults";
import { useBlastNuVs } from "@/analyses/queries";
import { FormattedNuVsHit } from "@/analyses/types";
import { Alert, Box, BoxTitle, Button, Icon } from "@base";
import React from "react";
import styled from "styled-components";
import { BLASTError } from "./BLASTError";
import { BLASTInProgress } from "./BLASTInProgress";

export const BLASTButton = styled(Button)`
    font-weight: 600;
    margin-left: auto;
`;

type NuVsBLASTProps = {
    analysisId: string;
    /** Complete information for a NuVs hit */
    hit: FormattedNuVsHit;
};

/**
 * Displays option to install NuVs blast information
 */
export default function NuVsBLAST({ analysisId, hit }: NuVsBLASTProps) {
    const { blast, index } = hit;
    const mutation = useBlastNuVs(analysisId);

    function handleBlast() {
        mutation.mutate({ sequenceIndex: index });
    }

    if (blast) {
        if (blast.error) {
            return <BLASTError error={blast.error} onBlast={handleBlast} />;
        }

        if (blast.ready) {
            if (blast.result.hits.length) {
                return <BLASTResults hits={blast.result.hits} onBlast={handleBlast} />;
            }

            return (
                <Box>
                    <BoxTitle>NCBI BLAST</BoxTitle>
                    <p>No BLAST hits found.</p>
                </Box>
            );
        }

        return <BLASTInProgress interval={blast.interval} lastCheckedAt={blast.last_checked_at} rid={blast.rid} />;
    }

    return (
        <Alert color="purple" level>
            <Icon name="info-circle" />
            <span>This sequence has no BLAST information attached to it.</span>
            <BLASTButton color="purple" icon="cloud" onClick={handleBlast}>
                BLAST at NCBI
            </BLASTButton>
        </Alert>
    );
}
