import { filter, remove } from "lodash-es";
import { ReferenceDataType } from "../../../references/types";
import { Workflows } from "../../types";

export type workflow = {
    id: string;
    name: string;
    compatability: { genome: boolean; barcode: boolean };
    resources: AnalysisResources;
};

type AnalysisResources = {
    reference: boolean;
    subtraction: boolean;
    ml: boolean;
};

const defaultResources = { reference: false, subtraction: false, ml: false };

export const pathoscopeWorkflow = {
    id: Workflows.pathoscope_bowtie,
    name: "Pathoscope",
    compatability: { genome: true, barcode: false },
    resources: { ...defaultResources, reference: true, subtraction: true },
};

export const nuvsWorkflow = {
    id: Workflows.nuvs,
    name: "NuVs",
    compatability: { genome: true, barcode: false },
    resources: { ...defaultResources, reference: true, subtraction: true },
};

export const iimiWorkflow = {
    id: Workflows.iimi,
    name: "Iimi",
    compatability: { genome: true, barcode: false },
    resources: { ...defaultResources, ml: true, reference: true },
};

export const aodpWorkflow = {
    id: Workflows.aodp,
    name: "AODP",
    compatability: { genome: false, barcode: true },
    resources: { ...defaultResources, reference: true, subtraction: true },
};

export const workflows = [pathoscopeWorkflow, nuvsWorkflow, iimiWorkflow, aodpWorkflow] as workflow[];

export function getCompatibleWorkflows(dataType: ReferenceDataType, hasHmm: boolean): workflow[] {
    const compatibleWorkflows = filter(workflows, (workflow: workflow) => workflow.compatability[dataType]);

    if (!hasHmm) {
        remove(compatibleWorkflows, (workflow: workflow) => workflow.id === nuvsWorkflow.id);
    }

    return compatibleWorkflows;
}

export function getRequiredResources(workflowId: string): AnalysisResources {
    const workflow = workflows.find((workflow: workflow) => workflow.id === workflowId);

    if (workflow) {
        return workflow.resources;
    }

    return defaultResources;
}
