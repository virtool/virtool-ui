import IconButton from "@base/IconButton";
import Toolbar from "@base/Toolbar";
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
	onEdit: () => void;
	onRemove: () => void;
};

/**
 * A toolbar of actions for a sequence: edit, remove, and FASTA download
 */
export default function SequenceButtons({
	id,
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
		<Toolbar className="items-center justify-end rounded-md border border-gray-200 bg-gray-50 px-2 py-1">
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
			<DownloadLink className="bg-white" href={href} size="sm">
				FASTA
			</DownloadLink>
		</Toolbar>
	);
}
