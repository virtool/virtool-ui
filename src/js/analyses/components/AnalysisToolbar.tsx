import React from "react";
import { LinkButton, Toolbar } from "../../base";
import { useCheckCanEditSample } from "../../samples/hooks";
import { Workflows } from "../types";

type AnalysesToolbarProps = {
    sampleId: string;
};

/**
 * A toolbar which allows the analyses to be filtered by their names
 */
export default function AnalysesToolbar({ sampleId }: AnalysesToolbarProps) {
    const { hasPermission: canCreate } = useCheckCanEditSample(sampleId);

    return (
        <Toolbar>
            {canCreate && (
                <LinkButton
                    icon="plus-square fa-fw"
                    to={{ state: { createAnalysis: Workflows.pathoscope_bowtie } }}
                    color="blue"
                    tip="New Analysis"
                />
            )}
        </Toolbar>
    );
}
