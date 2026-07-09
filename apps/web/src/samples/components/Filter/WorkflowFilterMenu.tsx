import { getWorkflowDisplayName } from "@app/utils";
import DropdownMenuCheckboxItem from "@base/DropdownMenuCheckboxItem";
import DropdownMenuContent from "@base/DropdownMenuContent";
import DropdownMenuGroup from "@base/DropdownMenuGroup";
import DropdownMenuItem from "@base/DropdownMenuItem";
import DropdownMenuLabel from "@base/DropdownMenuLabel";
import DropdownMenuSeparator from "@base/DropdownMenuSeparator";
import {
	filterableWorkflows,
	formatWorkflowFilter,
	getWorkflowFilterStateDisplayName,
	workflowFilterStates,
} from "@samples/utils";
import { Fragment } from "react";
import { workflowStateIcons } from "./workflowStateIcons";

type WorkflowFilterMenuProps = {
	/** Deselects every workflow state. */
	onClear: () => void;

	/** Toggles a single ``workflow:state`` filter. */
	onToggle: (value: string) => void;

	/** Selected ``workflow:state`` filters. */
	selected: string[];
};

/**
 * A dropdown menu for selecting the workflow states that samples are filtered by
 */
export default function WorkflowFilterMenu({
	onClear,
	onToggle,
	selected,
}: WorkflowFilterMenuProps) {
	return (
		<DropdownMenuContent className="w-64">
			{filterableWorkflows.map((workflow, index) => {
				const workflowName = getWorkflowDisplayName(workflow);
				const labelId = `workflow-filter-${workflow}`;

				return (
					<Fragment key={workflow}>
						{index > 0 && <DropdownMenuSeparator />}
						<DropdownMenuGroup aria-labelledby={labelId}>
							<DropdownMenuLabel id={labelId}>{workflowName}</DropdownMenuLabel>
							{workflowFilterStates.map((state) => {
								const value = formatWorkflowFilter({ state, workflow });
								const stateName = getWorkflowFilterStateDisplayName(state);
								const { className, icon: StateIcon } =
									workflowStateIcons[state];

								return (
									<DropdownMenuCheckboxItem
										aria-label={`${workflowName} ${stateName}`}
										checked={selected.includes(value)}
										key={state}
										onCheckedChange={() => onToggle(value)}
										// Keep the menu open so several states can be toggled at once.
										onSelect={(e) => e.preventDefault()}
									>
										<StateIcon className={className} size={14} />
										{stateName}
									</DropdownMenuCheckboxItem>
								);
							})}
						</DropdownMenuGroup>
					</Fragment>
				);
			})}
			{selected.length > 0 && (
				<>
					<DropdownMenuSeparator />
					<DropdownMenuItem color="blue" onSelect={onClear}>
						Clear
					</DropdownMenuItem>
				</>
			)}
		</DropdownMenuContent>
	);
}
