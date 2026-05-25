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

const radioClasses = cn(
	"appearance-none",
	"h-5",
	"w-5",
	"shrink-0",
	"rounded-full",
	"border-2",
	"border-gray-300",
	"cursor-pointer",
	"checked:border-gray-900",
	"checked:bg-gray-900",
	"focus-visible:ring-2",
	"focus-visible:ring-blue-500",
	"focus-visible:outline-none",
);

type InstanceMessageItemProps = {
	active: boolean;
	color: MessageColor;
	id: number;
	message: string;
	onActivate: (id: number) => Promise<unknown>;
	onEdit: (id: number, values: InstanceMessageFormValues) => Promise<unknown>;
	onRemove: (id: number) => Promise<unknown>;
};

/**
 * A single instance-message row rendered as a radio option, paired with edit
 * and delete affordances.
 */
export default function InstanceMessageItem({
	active,
	color,
	id,
	message,
	onActivate,
	onEdit,
	onRemove,
}: InstanceMessageItemProps) {
	const radioId = `instance-message-${id}`;

	return (
		<BoxGroupSection className="flex items-center gap-3">
			<input
				type="radio"
				id={radioId}
				name="instance-message-active"
				checked={active}
				onChange={() => void onActivate(id)}
				className={radioClasses}
			/>
			<label
				htmlFor={radioId}
				className="flex grow items-center gap-3 min-w-0 cursor-pointer"
			>
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
			</label>
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
