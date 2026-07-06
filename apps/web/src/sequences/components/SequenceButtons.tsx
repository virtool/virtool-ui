import CloseButton from "@base/CloseButton";
import IconButton from "@base/IconButton";
import { useGetActiveIsolateId } from "@otus/hooks";
import { useCurrentOtuContext } from "@otus/queries";
import { DownloadLink } from "@references/components/Detail/DownloadLink";
import {
	useCheckReferenceRight,
	useReferenceIsArchived,
} from "@references/hooks";
import { Pencil, Trash } from "lucide-react";

type SequenceButtonsProps = {
	id: string;
	onCollapse: () => void;
	onEdit: () => void;
	onRemove: () => void;
};

/**
 * Displays icons for the sequence item to close, edit, or remove
 */
export default function SequenceButtons({
	id,
	onCollapse,
	onEdit,
	onRemove,
}: SequenceButtonsProps) {
	const { otu, reference } = useCurrentOtuContext();

	const { hasPermission: canModify } = useCheckReferenceRight(
		reference.id,
		"modify_otu",
	);
	const archived = useReferenceIsArchived(reference.id);
	const isolateId = useGetActiveIsolateId(otu);

	const href = `/api/otus/${otu.id}/isolates/${isolateId}/sequences/${id}.fa`;

	return (
		<span className="flex items-center ml-auto gap-1 pl-5 -mr-2.5">
			{canModify && !archived && (
				<>
					<IconButton
						IconComponent={Pencil}
						color="grayDark"
						tip="Edit"
						onClick={onEdit}
					/>
					<IconButton
						IconComponent={Trash}
						color="red"
						tip="Remove"
						onClick={onRemove}
					/>
				</>
			)}
			<DownloadLink href={href}>FASTA</DownloadLink>
			<CloseButton onClick={onCollapse} />
		</span>
	);
}
