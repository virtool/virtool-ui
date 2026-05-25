import { cn } from "@app/utils";
import BoxGroupSection from "@base/BoxGroupSection";
import type { MessageColor } from "@message/types";
import EditInstanceMessage from "./EditInstanceMessage";
import type { InstanceMessageFormValues } from "./InstanceMessageForm";
import RemoveInstanceMessage from "./RemoveInstanceMessage";

const swatchClasses: Record<MessageColor, string> = {
	red: "bg-red-500",
	orange: "bg-orange-500",
	yellow: "bg-yellow-500",
	blue: "bg-blue-500",
	purple: "bg-purple-500",
	grey: "bg-gray-500",
};

type InstanceMessageItemProps = {
	active: boolean;
	color: MessageColor;
	id: number;
	message: string;
	onActivate: (id: number) => Promise<unknown>;
	onDeactivate: () => Promise<unknown>;
	onEdit: (id: number, values: InstanceMessageFormValues) => Promise<unknown>;
	onRemove: (id: number) => Promise<unknown>;
};

/**
 * A single instance-message row with activate, edit, and delete affordances.
 */
export default function InstanceMessageItem({
	active,
	color,
	id,
	message,
	onActivate,
	onDeactivate,
	onEdit,
	onRemove,
}: InstanceMessageItemProps) {
	function handleToggle() {
		if (active) {
			void onDeactivate();
		} else {
			void onActivate(id);
		}
	}

	return (
		<BoxGroupSection className="flex items-center gap-3">
			<button
				type="button"
				role="switch"
				aria-checked={active}
				aria-label={active ? "Deactivate message" : "Activate message"}
				onClick={handleToggle}
				className={cn(
					"h-5",
					"w-5",
					"shrink-0",
					"rounded-full",
					"border-2",
					"border-gray-300",
					"cursor-pointer",
					"focus-visible:ring-2",
					"focus-visible:ring-blue-500",
					"focus-visible:outline-none",
					active && "border-gray-900 bg-gray-900",
				)}
			/>
			<span
				className={cn(
					swatchClasses[color],
					"h-5",
					"w-5",
					"shrink-0",
					"rounded-full",
				)}
				aria-hidden="true"
			/>
			<span className="grow truncate">{message}</span>
			{active && (
				<span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
					Active
				</span>
			)}
			<div className="flex items-center gap-1">
				<EditInstanceMessage
					color={color}
					message={message}
					onSubmit={(values) => onEdit(id, values)}
				/>
				<RemoveInstanceMessage
					message={message}
					onConfirm={() => onRemove(id)}
				/>
			</div>
		</BoxGroupSection>
	);
}
