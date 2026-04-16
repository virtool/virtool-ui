import { byteSize } from "@app/utils";
import Icon from "@base/Icon";
import SelectBoxGroupSection from "@base/SelectBoxGroupSection";
import { File } from "lucide-react";

type ReadSelectorItemProps = {
	/** The unique identifier */
	id: number;
	/** The name of the file */
	name: string;
	/** The index number of the file */
	index: number;
	/** The size of the file in bytes */
	size: number;
	/** The selected uploads */
	selected?: boolean;
	/** A callback function to handle file selection */
	onSelect: (id: number) => void;
};

/**
 * A condensed file for use in a list of read uploads
 */
export default function ReadSelectorItem({
	id,
	index,
	name,
	selected = false,
	size,
	onSelect,
}: ReadSelectorItemProps) {
	return (
		<SelectBoxGroupSection
			onClick={() => onSelect(id)}
			active={selected}
			className="flex items-center justify-between select-none"
		>
			<div className="flex items-center">
				<span className="text-2xl mr-4">
					<Icon icon={File} />
				</span>
				<div>
					<strong className="font-medium">{name}</strong>
					<div>{byteSize(size)}</div>
				</div>
			</div>
			{selected ? (
				<div className="bg-blue-700 border-2 border-white rounded-md text-white text-xs font-bold text-center w-12">
					{index === 0 ? "LEFT" : "RIGHT"}
				</div>
			) : null}
		</SelectBoxGroupSection>
	);
}
