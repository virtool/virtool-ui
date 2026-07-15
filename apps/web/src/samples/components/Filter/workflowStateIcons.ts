import type { WorkflowFilterState } from "@samples/utils";
import { CircleCheck, CircleDashed, ClockFading } from "lucide-react";

/** The icon and color used to represent a workflow state. */
export type WorkflowStateIcon = {
	className: string;
	icon: typeof CircleDashed;
};

/** The icon shown for each workflow state in the filter menu and chips. */
export const workflowStateIcons: Record<
	WorkflowFilterState,
	WorkflowStateIcon
> = {
	none: { className: "text-gray-500", icon: CircleDashed },
	pending: { className: "text-gray-600", icon: ClockFading },
	ready: { className: "text-green-600", icon: CircleCheck },
};
