import { cn, getWorkflowDisplayName } from "@app/utils";
import Dropdown from "@base/Dropdown";
import DropdownButton from "@base/DropdownButton";
import DropdownMenuCheckboxItem from "@base/DropdownMenuCheckboxItem";
import DropdownMenuContent from "@base/DropdownMenuContent";
import DropdownMenuItem from "@base/DropdownMenuItem";
import DropdownMenuLabel from "@base/DropdownMenuLabel";
import {
	filterableWorkflows,
	formatWorkflowFilter,
	getWorkflowFilterStateDisplayName,
	workflowFilterStates,
} from "@samples/utils";
import { Workflow } from "lucide-react";

type WorkflowFilterDropdownProps = {
	/** Deselects every workflow state. */
	onClear: () => void;

	/** Toggles a single ``workflow:state`` filter. */
	onToggle: (value: string) => void;

	/** Selected ``workflow:state`` filters. */
	selected: string[];
};

/**
 * A dropdown for selecting the workflow states that samples are filtered by
 */
export default function WorkflowFilterDropdown({
	onClear,
	onToggle,
	selected,
}: WorkflowFilterDropdownProps) {
	return (
		<Dropdown>
			<DropdownButton className="gap-2">
				<Workflow size={16} />
				Workflows
			</DropdownButton>
			<DropdownMenuContent className="max-h-80 overflow-y-auto w-64 py-1">
				{filterableWorkflows.map((workflow, index) => {
					const workflowName = getWorkflowDisplayName(workflow);

					return (
						<div
							className={cn(index > 0 && "border-gray-200 border-t mt-1 pt-1")}
							key={workflow}
						>
							<DropdownMenuLabel>{workflowName}</DropdownMenuLabel>
							{workflowFilterStates.map((state) => {
								const value = formatWorkflowFilter({ state, workflow });
								const stateName = getWorkflowFilterStateDisplayName(state);

								return (
									<DropdownMenuCheckboxItem
										aria-label={`${workflowName} ${stateName}`}
										checked={selected.includes(value)}
										key={state}
										onCheckedChange={() => onToggle(value)}
										// Keep the menu open so several states can be toggled at once.
										onSelect={(e) => e.preventDefault()}
									>
										{stateName}
									</DropdownMenuCheckboxItem>
								);
							})}
						</div>
					);
				})}
				{selected.length > 0 && (
					<DropdownMenuItem
						className="border-gray-200 border-t mt-1 text-blue-600"
						onSelect={onClear}
					>
						Clear
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</Dropdown>
	);
}
