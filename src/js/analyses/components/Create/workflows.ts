import { Workflows } from "../../types";

export type workflow = {
    id: string;
    name: string;
};

export const pathoscopeWorkflow = {
    id: Workflows.pathoscope_bowtie,
    name: "Pathoscope",
};

export const nuvsWorkflow = {
    id: Workflows.nuvs,
    name: "NuVs",
};

export const iimiWorkflow = {
    id: Workflows.iimi,
    name: "Iimi",
};

export const workflows = [
    pathoscopeWorkflow,
    nuvsWorkflow,
    iimiWorkflow,
] as workflow[];

export function getCompatibleWorkflows(hasHmm: boolean): workflow[] {
    return workflows.filter((workflow) => {
        if (workflow.id === Workflows.nuvs) {
            return hasHmm;
        }

        return true;
    });
}
