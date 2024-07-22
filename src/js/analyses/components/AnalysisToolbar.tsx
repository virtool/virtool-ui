import { LinkButton } from "@base";
import { useCheckCanEditSample } from "@samples/hooks";
import React from "react";
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
        <div className="flex justify-end pb-4">
            {canCreate && (
                <LinkButton color="blue" to={{ state: { createAnalysis: Workflows.pathoscope_bowtie } }}>
                    <span className="font-medium">Create</span>
                </LinkButton>
            )}
        </div>
    );
}
