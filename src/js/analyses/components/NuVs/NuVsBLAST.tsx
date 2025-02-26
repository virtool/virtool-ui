import { useBlastNuVs } from "@/analyses/queries";
import { FormattedNuvsHit } from "@/analyses/types";
import { NuvsBlastResults } from "@analyses/components/NuVs/NuvsBlastResults";
import { Alert, Box, BoxTitle, Button, Icon } from "@base";
import React from "react";
import BlastInProgress from "./BlastInProgress";
import { NuvsBlastError } from "./NuvsBlastError";

type NuVsBLASTProps = {
    analysisId: string;
    /** Complete information for a NuVs hit */
    hit: FormattedNuvsHit;
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
            return <NuvsBlastError error={blast.error} onBlast={handleBlast} />;
        }

        if (blast.ready) {
            if (blast.result.hits.length) {
                return (
                    <NuvsBlastResults
                        hits={blast.result.hits}
                        onBlast={handleBlast}
                    />
                );
            }

            return (
                <Box>
                    <BoxTitle>NCBI BLAST</BoxTitle>
                    <p>No BLAST hits found.</p>
                </Box>
            );
        }

        return (
            <BlastInProgress
                interval={blast.interval}
                lastCheckedAt={blast.last_checked_at}
                rid={blast.rid}
            />
        );
    }

    return (
        <Alert color="purple" level>
            <Icon name="info-circle" />
            <span>This sequence has no BLAST information attached to it.</span>
            <Button className="ml-auto" color="purple" onClick={handleBlast}>
                BLAST at NCBI
            </Button>
        </Alert>
    );
}
