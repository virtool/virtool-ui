import { cn } from "@app/cn";
import Badge from "@base/Badge";
import BoxGroupSection from "@base/BoxGroupSection";
import { Collapsible, CollapsibleContent } from "@base/Collapsible";
import Icon from "@base/Icon";
import Table from "@base/Table";
import { ChevronDown } from "lucide-react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { useState } from "react";
import SequenceButtons from "./SequenceButtons";
import {
	SEQUENCE_CHEVRON_COLUMN,
	SequenceAccessionValue,
	SequenceDefinitionValue,
	SequenceSegmentValue,
} from "./SequenceValues";

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
						"group",
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
					<Icon
						className={cn(
							SEQUENCE_CHEVRON_COLUMN,
							"mt-1",
							"text-gray-600",
							"transition-transform",
							"group-data-[state=open]:rotate-180",
						)}
						icon={ChevronDown}
						size={16}
					/>
					<SequenceAccessionValue accession={accession} />
					<SequenceSegmentValue segment={segment} />
					<SequenceDefinitionValue definition={definition} />
				</CollapsiblePrimitive.Trigger>
				<CollapsibleContent className="px-6 pb-3">
					<SequenceButtons id={id} onEdit={onEdit} onRemove={onRemove} />
					<Table
						className={cn(
							"mt-2.5",
							"table-fixed",
							"[&_th:first-child]:pl-0",
							"[&_td:last-child]:pr-0",
						)}
					>
						<tbody>
							<tr>
								<th>Host</th>
								<td>{host}</td>
							</tr>
							<tr>
								<th>
									Sequence <Badge>{sequence.length}</Badge>
								</th>
								<td className="font-mono !p-0">
									<textarea
										className="w-full p-2"
										rows={5}
										value={sequence}
										readOnly
									/>
								</td>
							</tr>
						</tbody>
					</Table>
				</CollapsibleContent>
			</Collapsible>
		</BoxGroupSection>
	);
}
