import NuvsBlastResults from "@analyses/components/Nuvs/NuvsBlastResults";
import { useBlastNuvs } from "@analyses/queries";
import { FormattedNuvsHit } from "@analyses/types";
import Alert from "@base/Alert";
import Box from "@base/Box";
import BoxTitle from "@base/BoxTitle";
import Button from "@base/Button";
import Icon from "@base/Icon";
import React from "react";
import NuvsBlastError from "./NuvsBlastError";
import NuvsBlastPending from "./NuvsBlastPending";

type NuVsBLASTProps = {
    analysisId: string;
    /** Complete information for a Nuvs hit */
    hit: FormattedNuvsHit;
};

/**
 * Displays option to install Nuvs blast information
 */
export default function NuvsBlast({ analysisId, hit }: NuVsBLASTProps) {
    const { blast, index } = hit;
    const mutation = useBlastNuvs(analysisId);

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
            <NuvsBlastPending
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
