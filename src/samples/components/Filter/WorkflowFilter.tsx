import { cn, getWorkflowDisplayName } from "@app/utils";
import Box from "@base/Box";
import Icon from "@base/Icon";
import SideBarSection from "@base/SideBarSection";
import SidebarHeader from "@base/SidebarHeader";
import { WorkflowStates } from "@samples/utils";
import { xor } from "es-toolkit/array";
import { Check, type LucideIcon, Play, X } from "lucide-react";

type WorkflowFilterControlButtonProps = {
	/* Indicates if the button is active */
	active: boolean;
	/* Icon to display on the button */
	icon: LucideIcon;
	/* The value to pass to the onClick handler */
	value: string;
	/* Handles click event when icon is clicked */
	onClick: (value: string) => void;
};

function WorkflowFilterControlButton({
	active,
	icon,
	value,
	onClick,
}: WorkflowFilterControlButtonProps) {
	return (
		<button
			className={cn(
				"flex items-center justify-center border-2 border-purple-400 rounded-full cursor-pointer h-8 w-8 [&_i]:text-sm",
				active
					? "bg-purple-400 text-white"
					: "bg-purple-50 text-purple-600 scale-95 hover:bg-purple-300 hover:text-purple-800 hover:outline-none focus:bg-purple-300 focus:text-purple-800 focus:outline-none",
			)}
			aria-pressed={active}
			onClick={() => onClick(value)}
			type="button"
		>
			<Icon icon={icon} />
		</button>
	);
}

type WorkflowFilterControlProps = {
	/* The workflow to filter */
	workflow: string;
	/* Active states of filter buttons */
	states: string[];
	/* Handles click event when filter button is clicked */
	onChange: (workflow: string, state: string) => void;
};

function WorkflowFilterControl({
	workflow,
	states,
	onChange,
}: WorkflowFilterControlProps) {
	function handleClick(state) {
		onChange(workflow, state);
	}

	return (
		<Box className="bg-white p-0">
			<div className="px-2 py-1">{getWorkflowDisplayName(workflow)}</div>
			<div className="flex items-center justify-stretch px-2 pt-1 pb-2">
				<WorkflowFilterControlButton
					active={states.includes(WorkflowStates.NONE)}
					icon={X}
					value={WorkflowStates.NONE}
					onClick={handleClick}
				/>
				<div className="border border-gray-300 flex-auto h-0.5" />
				<WorkflowFilterControlButton
					active={states.includes(WorkflowStates.PENDING)}
					icon={Play}
					value={WorkflowStates.PENDING}
					onClick={handleClick}
				/>
				<div className="border border-gray-300 flex-auto h-0.5" />
				<WorkflowFilterControlButton
					active={states.includes(WorkflowStates.READY)}
					icon={Check}
					value={WorkflowStates.READY}
					onClick={handleClick}
				/>
			</div>
		</Box>
	);
}

function getWorkflowsFromURL(workflows) {
	return workflows.reduce(
		(acc, item) => {
			const [workflow, state] = item.split(":");

			acc[workflow] = acc[workflow] || [];

			acc[workflow].push(state);
			return acc;
		},
		{ pathoscope: [], nuvs: [] },
	);
}

type WorkflowFilterProps = {
	/* List of selected workflows */
	selected: string[];
	/* Handles click event when filter control is clicked */
	onClick: (selected: string[]) => void;
};

export default function WorkflowFilter({
	selected,
	onClick,
}: WorkflowFilterProps) {
	function handleClick(workflow, state) {
		onClick(xor(selected, [`${workflow}:${state}`]));
	}

	const workflows = getWorkflowsFromURL(selected);

	const { nuvs, pathoscope } = workflows;

	return (
		<SideBarSection>
			<SidebarHeader>Workflows</SidebarHeader>
			<WorkflowFilterControl
				workflow="pathoscope"
				states={pathoscope}
				onChange={handleClick}
			/>
			<WorkflowFilterControl
				workflow="nuvs"
				states={nuvs}
				onChange={handleClick}
			/>
		</SideBarSection>
	);
}
