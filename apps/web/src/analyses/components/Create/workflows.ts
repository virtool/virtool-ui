export type workflow = {
	description: string;
	id: string;
	name: string;
};

export const pathoscopeWorkflow = {
	description: "Find known viruses.",
	id: "pathoscope",
	name: "Pathoscope",
};

export const nuvsWorkflow = {
	description: "Find novel viruses.",
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
