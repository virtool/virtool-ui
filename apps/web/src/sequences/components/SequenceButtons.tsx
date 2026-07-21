import IconButton from "@base/IconButton";
import { useCurrentOtuContext } from "@otus/components/CurrentOtuContext";
import { useGetActiveIsolateId } from "@otus/hooks";
import { DownloadLink } from "@references/components/Detail/DownloadLink";
import {
	useCheckReferenceRight,
	useReferenceIsArchived,
} from "@references/hooks";
import { Pencil, Trash } from "lucide-react";

type SequenceButtonsProps = {
	id: string;
	onEdit: () => void;
	onRemove: () => void;
};

/**
 * A strip of actions for a sequence: edit, remove, and FASTA download
 */
export default function SequenceButtons({
	id,
	onEdit,
	onRemove,
}: SequenceButtonsProps) {
	const { otu, reference } = useCurrentOtuContext();

	const { hasPermission: canModify } = useCheckReferenceRight(
		String(reference.id),
		"modify_otu",
	);
	const archived = useReferenceIsArchived(String(reference.id));
	const isolateId = useGetActiveIsolateId(otu);

	const href = `/api/otus/${otu.id}/isolates/${isolateId}/sequences/${id}.fa`;

	return (
		<div className="flex items-center justify-end gap-1.5 px-2 py-1">
			{canModify && !archived && (
				<>
					<IconButton
						IconComponent={Pencil}
						color="gray"
						size={14}
						tip="Edit"
						onClick={onEdit}
					/>
					<IconButton
						IconComponent={Trash}
						color="red"
						size={14}
						tip="Remove"
						onClick={onRemove}
					/>
				</>
			)}
			<DownloadLink href={href} size="sm">
				FASTA
			</DownloadLink>
		</div>
	);
}
