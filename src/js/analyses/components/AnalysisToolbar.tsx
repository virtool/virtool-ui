import React, { ChangeEvent } from "react";
import { InputSearch, LinkButton, Toolbar } from "../../base";
import { useCheckCanEditSample } from "../../samples/hooks";
import { Workflows } from "../types";

type AnalysesToolbarProps = {
    /** A callback function to handle changes in search input */
    onChange: (term: ChangeEvent<HTMLInputElement>) => void;
    /** The sample id to be used to push the create analysis dialog onto */
    sampleId: string;
    /** Current search term used for filtering */
    term: string;
};

/**
 * A toolbar which allows the analyses to be filtered by their names
 */
export default function AnalysesToolbar({ onChange, term, sampleId }: AnalysesToolbarProps) {
    const { hasPermission: canCreate } = useCheckCanEditSample(sampleId);

    return (
        <Toolbar>
            <InputSearch value={term} onChange={onChange} />
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
