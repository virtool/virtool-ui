import BoxGroup from "@base/BoxGroup";
import BoxGroupSection from "@base/BoxGroupSection";
import { RadioGroup, RadioGroupItem } from "@base/RadioGroup";
import CreateAnalysisFieldTitle from "./CreateAnalysisFieldTitle";
import type { workflow } from "./workflows";

type WorkflowSelectorProps = {
	/** The workflows the user can choose between */
	workflows: workflow[];

	/** The id of the currently selected workflow */
	selected: string;

	/** Called with the id of the newly selected workflow */
	onChange: (value: string) => void;
};

/**
 * A radio group for choosing which analysis workflow to run.
 */
export default function WorkflowSelector({
	workflows,
	selected,
	onChange,
}: WorkflowSelectorProps) {
	return (
		<div>
			<CreateAnalysisFieldTitle>Workflow</CreateAnalysisFieldTitle>
			<RadioGroup
				aria-label="Workflow"
				value={selected}
				onValueChange={onChange}
			>
				<BoxGroup>
					{workflows.map((workflow) => (
						<BoxGroupSection
							key={workflow.id}
							className="flex items-center gap-3"
						>
							<RadioGroupItem
								id={`workflow-${workflow.id}`}
								value={workflow.id}
							/>
							<label
								htmlFor={`workflow-${workflow.id}`}
								className="grow cursor-pointer"
							>
								{workflow.name}
							</label>
						</BoxGroupSection>
					))}
				</BoxGroup>
			</RadioGroup>
		</div>
	);
}
