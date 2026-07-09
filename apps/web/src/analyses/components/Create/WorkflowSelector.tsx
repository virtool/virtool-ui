import { SelectBox, SelectBoxItem } from "@base/SelectBox";
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
 * A boxed picker for choosing which analysis workflow to run.
 */
export default function WorkflowSelector({
	workflows,
	selected,
	onChange,
}: WorkflowSelectorProps) {
	return (
		<div className="mb-6">
			<SelectBox
				className="grid-cols-2"
				label="Workflow"
				onValueChange={onChange}
				value={selected}
			>
				{workflows.map(({ description, id, name }) => (
					<SelectBoxItem key={id} value={id}>
						<div>{name}</div>
						<span>{description}</span>
					</SelectBoxItem>
				))}
			</SelectBox>
		</div>
	);
}
