export type workflow = {
    id: string;
    name: string;
};

export const pathoscopeWorkflow = {
    id: "pathoscope_bowtie",
    name: "Pathoscope",
};

export const nuvsWorkflow = {
    id: "nuvs",
    name: "NuVs",
};

export const iimiWorkflow = {
    id: "iimi",
    name: "Iimi",
};

export const workflows = [
    pathoscopeWorkflow,
    nuvsWorkflow,
    iimiWorkflow,
] as workflow[];

export function getCompatibleWorkflows(hasHmm: boolean): workflow[] {
    return workflows.filter((workflow) => {
        if (workflow.id === "nuvs") {
            return hasHmm;
        }

        return true;
    });
}
