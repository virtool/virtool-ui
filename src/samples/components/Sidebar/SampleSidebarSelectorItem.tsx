import Icon from "@base/Icon";
import { Check, Minus } from "lucide-react";
import type { ReactNode } from "react";

type SampleSidebarSelectorItemProps = {
	children: ReactNode;
	id: string | number;
	name: string;
	/** A callback function to handle item selection */
	onClick: (id: string | number) => void;
	partiallySelected: boolean;
	selected: boolean;
};

/**
 * A condensed sidebar item for use in a list of sidebar items
 */
export default function SampleSidebarSelectorItem({
	children,
	id,
	name,
	onClick,
	partiallySelected,
	selected,
}: SampleSidebarSelectorItemProps) {
	return (
		<button
			className="bg-transparent block border-gray-300 not-last:border-b-1 py-2.5 pr-2.5 pl-1 relative text-inherit w-full flex items-stretch [&_p]:text-sm [&_p]:mt-1 [&_p]:mb-0"
			type="button"
			onClick={() => onClick(id)}
			aria-label={name}
		>
			<div className="flex items-center justify-center text-gray-500 mr-1 w-8">
				{selected && <Icon icon={partiallySelected ? Minus : Check} />}
			</div>
			<div className="flex items-center">{children}</div>
		</button>
	);
}
