import CloseButton from "@base/CloseButton";
import IconButton from "@base/IconButton";
import { useOtuDetailSearch } from "@otus/components/Detail/OtuDetailSearchContext";
import { useGetActiveIsolateId } from "@otus/hooks";
import { useCurrentOtuContext } from "@otus/queries";
import { DownloadLink } from "@references/components/Detail/DownloadLink";
import { useCheckReferenceRight } from "@references/hooks";
import { Pencil, Trash } from "lucide-react";

type SequenceButtonsProps = {
	id: string;
	onCollapse: () => void;
};

/**
 * Displays icons for the sequence item to close, edit, or remove
 */
export default function SequenceButtons({
	id,
	onCollapse,
}: SequenceButtonsProps) {
	const { setSearch } = useOtuDetailSearch();
	const { otu, reference } = useCurrentOtuContext();

	const { hasPermission: canModify } = useCheckReferenceRight(
		reference.id,
		"modify_otu",
	);
	const isolateId = useGetActiveIsolateId(otu);

	const href = `/api/otus/${otu.id}/isolates/${isolateId}/sequences/${id}.fa`;

	return (
		<span className="flex items-center ml-auto pl-5">
			{canModify && (
				<>
					<IconButton
						IconComponent={Pencil}
						color="grayDark"
						tip="Edit"
						onClick={() => setSearch({ editSequenceId: id })}
						className="ml-0.5"
					/>
					<IconButton
						IconComponent={Trash}
						color="red"
						tip="Remove"
						onClick={() => setSearch({ removeSequenceId: id })}
						className="ml-0.5"
					/>
				</>
			)}
			<div className="ml-4 mr-1">
				<DownloadLink href={href}>FASTA</DownloadLink>
			</div>
			<CloseButton onClick={onCollapse} />
		</span>
	);
}
