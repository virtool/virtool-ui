import { filter, remove } from "lodash-es";
import { ReferenceDataType } from "../../../references/types";

export type workflow = {
    id: string;
    display: string;
    compatability: { genome: boolean; barcode: boolean };
    resources: { reference: boolean; subtraction: boolean };
};

export const pathoscopeWorkflow = {
    id: "pathoscope_bowtie",
    display: "Pathoscope",
    compatability: { genome: true, barcode: false },
    resources: { reference: true, subtraction: true },
};

export const nuvsWorkflow = {
    id: "nuvs",
    display: "NuVs",
    compatability: { genome: true, barcode: false },
    resources: { reference: true, subtraction: true },
};

export const mlWorkflow = {
    id: "ml",
    display: "ML",
    compatability: { genome: true, barcode: false },
    resources: { reference: true, subtraction: true },
};

export const aodpWorkflow = {
    id: "aodp",
    display: "AODP",
    compatability: { genome: false, barcode: true },
    resources: { reference: true, subtraction: true },
};

export const workflows = [pathoscopeWorkflow, nuvsWorkflow, aodpWorkflow] as workflow[];

export function getCompatibleWorkflows(dataType: ReferenceDataType, hasHmm: boolean): workflow[] {
    const compatibleWorkflows = filter(workflows, (workflow: workflow) => workflow.compatability[dataType]);

    if (!hasHmm) {
        remove(compatibleWorkflows, (workflow: workflow) => workflow.id === nuvsWorkflow.id);
    }

    return compatibleWorkflows;
}
