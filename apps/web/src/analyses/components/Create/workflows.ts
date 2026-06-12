export type workflow = {
	id: string;
	name: string;
};

export const pathoscopeWorkflow = {
	id: "pathoscope",
	name: "Pathoscope",
};

export const nuvsWorkflow = {
	id: "nuvs",
	name: "NuVs",
};

export const workflows = [pathoscopeWorkflow, nuvsWorkflow] as workflow[];

export function getCompatibleWorkflows(hasHmm: boolean): workflow[] {
	return workflows.filter((workflow) => {
		if (workflow.id === "nuvs") {
			return hasHmm;
		}

		return true;
	});
}
