import { filter, remove } from "lodash-es";
import { ReferenceDataType } from "../../../references/types";
import { Workflows } from "../../types";

export type workflow = {
    id: string;
    name: string;
    compatability: { genome: boolean; barcode: boolean };
};

export const pathoscopeWorkflow = {
    id: Workflows.pathoscope_bowtie,
    name: "Pathoscope",
    compatability: { genome: true, barcode: false },
};

export const nuvsWorkflow = {
    id: Workflows.nuvs,
    name: "NuVs",
    compatability: { genome: true, barcode: false },
};

export const iimiWorkflow = {
    id: Workflows.iimi,
    name: "Iimi",
    compatability: { genome: true, barcode: false },
};

export const aodpWorkflow = {
    id: Workflows.aodp,
    name: "AODP",
    compatability: { genome: false, barcode: true },
};

export const workflows = [pathoscopeWorkflow, nuvsWorkflow, iimiWorkflow, aodpWorkflow] as workflow[];

export function getCompatibleWorkflows(dataType: ReferenceDataType, hasHmm: boolean): workflow[] {
    const compatibleWorkflows = filter(workflows, (workflow: workflow) => workflow.compatability[dataType]);

    if (!hasHmm) {
        remove(compatibleWorkflows, (workflow: workflow) => workflow.id === nuvsWorkflow.id);
    }

    return compatibleWorkflows;
}
