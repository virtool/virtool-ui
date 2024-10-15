import { Workflows } from "@/analyses/types";
import { Button } from "@base";
import { useCheckCanEditSample } from "@samples/hooks";
import { useUrlSearchParam } from "@utils/hooks";
import React from "react";

type AnalysesToolbarProps = {
    sampleId: string;
};

/**
 * A toolbar which allows the analyses to be filtered by their names
 */
export default function AnalysesToolbar({ sampleId }: AnalysesToolbarProps) {
    const { hasPermission: canCreate } = useCheckCanEditSample(sampleId);
    const [, setOpenCreateAnalysis] = useUrlSearchParam("openCreateAnalysis");
    const [, setWorkflow] = useUrlSearchParam("workflow");

    return (
        <div className="flex justify-end pb-4">
            {canCreate && (
                <Button
                    color="blue"
                    onClick={() => {
                        setOpenCreateAnalysis("true");
                        setWorkflow(Workflows.pathoscope_bowtie);
                    }}
                >
                    <span className="font-medium">Create</span>
                </Button>
            )}
        </div>
    );
}
