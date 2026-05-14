import Box from "@base/Box";
import Checkbox from "@base/Checkbox";
import type { ReactNode } from "react";

type SettingsCheckboxProps = {
	/** Content to be rendered within the checkbox */
	children: ReactNode;

	/** Whether the external API access is enabled */
	enabled: boolean;

	/** An HTML id for the checkbox */
	id: string;

	/** A callback function to handle checkbox toggling */
	onToggle: () => void;
};

/**
 * A checkbox allowing users to toggle API access for clients
 */
export default function SettingsCheckbox({
	children,
	enabled,
	id,
	onToggle,
}: SettingsCheckboxProps) {
	return (
		<Box className="flex items-center justify-between px-5 pt-4 pb-3 [&_h2]:mb-0.5 [&_h2]:pb-1 [&_h2]:text-base [&_h2]:font-medium [&_small]:text-sm [&_small]:text-gray-600">
			<div className="pr-5">{children}</div>
			<div className="p-2.5">
				<Checkbox checked={enabled} id={id} onClick={onToggle} />
			</div>
		</Box>
	);
}
