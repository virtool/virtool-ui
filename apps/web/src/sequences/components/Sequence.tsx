import { cn } from "@app/cn";
import BoxGroupSection from "@base/BoxGroupSection";
import { Collapsible, CollapsibleContent } from "@base/Collapsible";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { useState } from "react";
import SequenceButtons from "./SequenceButtons";
import SequenceTable from "./SequenceTable";
import { SequenceAccessionValue, SequenceTitleValue } from "./SequenceValues";

type GenomeSequenceProps = {
	accession: string;
	definition: string;
	host: string;
	id: string;
	onEdit: () => void;
	onRemove: () => void;
	segment?: string | null;
	sequence: string;
};

/**
 * A condensed genome sequence item for use in a list of sequences
 */
export default function Sequence({
	accession,
	definition,
	host,
	id,
	onEdit,
	onRemove,
	segment,
	sequence,
}: GenomeSequenceProps) {
	const [open, setOpen] = useState(false);

	return (
		<BoxGroupSection className="p-0">
			<Collapsible open={open} onOpenChange={setOpen}>
				<CollapsiblePrimitive.Trigger
					className={cn(
						"flex items-start w-full text-left",
						"bg-transparent border-none text-inherit",
						"px-6 py-3",
						"cursor-pointer hover:bg-gray-50",
						"focus-visible:outline-none",
						"focus-visible:ring-2",
						"focus-visible:ring-inset",
						"focus-visible:ring-blue-600/50",
					)}
				>
					<SequenceAccessionValue accession={accession} />
					<SequenceTitleValue value={segment || definition} />
				</CollapsiblePrimitive.Trigger>
				<CollapsibleContent className="px-6 pb-3">
					<div className="flex flex-wrap items-start">
						<SequenceButtons
							id={id}
							onCollapse={() => setOpen(false)}
							onEdit={onEdit}
							onRemove={onRemove}
						/>
						<div className="basis-full">
							<SequenceTable
								definition={definition}
								host={host}
								segment={segment}
								sequence={sequence}
							/>
						</div>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</BoxGroupSection>
	);
}
