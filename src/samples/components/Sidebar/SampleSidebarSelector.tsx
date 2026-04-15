import { useFuse } from "@app/fuse";
import BoxGroupSearch from "@base/BoxGroupSearch";
import Icon from "@base/Icon";
import Link from "@base/Link";
import Popover from "@base/Popover";
import SidebarHeaderButton from "@base/SidebarHeaderButton";
import type { Label } from "@labels/types";
import type { SubtractionOption } from "@subtraction/types";
import { Pen } from "lucide-react";
import type { ReactNode } from "react";
import SampleSidebarSelectorItem from "./SampleSidebarSelectorItem";

type SampleSidebarSelectorProps = {
	/** The link to manage labels or subtractions */
	manageLink: string;

	/** A callback function to handle sidebar item selection */
	onUpdate: (id: string | number) => void;

	/** List of label ids applied to some, but not all selected samples */
	partiallySelectedItems?: number[];

	/** The styled component for the list items */
	render: (result: {
		color?: string;
		description?: string;
		name: string;
	}) => ReactNode;

	/** A list of labels or default subtractions */
	items: Label[] | SubtractionOption[];

	/** A list of selected items by their ids */
	selectedIds: Array<string | number>;

	/** Whether the sidebar is labels or subtractions */
	selectionType: string;
};

/**
 * Displays a dropdown list of labels or subtractions
 */
export default function SampleSidebarSelector({
	render,
	items,
	selectedIds,
	partiallySelectedItems = [],
	onUpdate,
	selectionType,
	manageLink,
}: SampleSidebarSelectorProps) {
	const [results, term, setTerm] = useFuse<Label | SubtractionOption>(items, [
		"name",
	]);

	const itemComponents = results.map((item: Label | SubtractionOption) => (
		<SampleSidebarSelectorItem
			key={item.id}
			selected={selectedIds.includes(item.id)}
			partiallySelected={partiallySelectedItems.includes(item.id as number)}
			{...item}
			onClick={onUpdate}
		>
			{render(item)}
		</SampleSidebarSelectorItem>
	));

	return (
		<Popover
			trigger={
				!items.length || (
					<SidebarHeaderButton
						aria-label={`select ${selectionType}`}
						type="button"
					>
						<Icon icon={Pen} />
					</SidebarHeaderButton>
				)
			}
		>
			<BoxGroupSearch
				placeholder="Filter items"
				label="Filter items"
				value={term}
				onChange={setTerm}
			/>
			<div className="max-h-80 overflow-y-scroll">{itemComponents}</div>
			<div className="flex border-t border-gray-300 w-full items-end [&_a]:ml-auto [&_a]:text-sm [&_a]:font-medium [&_a]:py-2.5 [&_a]:pr-2.5 [&_a]:pl-0">
				<Link to={manageLink}> Manage</Link>
			</div>
		</Popover>
	);
}
