import IconButton from "@base/IconButton";
import { useCheckReferenceRight } from "@references/hooks";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import OtuEdit from "../OtuEdit";
import OtuRemove from "../OtuRemove";

type OtuHeaderIconsProps = {
	id: string;
	name: string;
	refId: string;
	abbreviation: string;
	onRemoved: () => void;
};

/**
 * Displays end icons to edit or remove an OTU
 */
export function OtuHeaderIcons({
	id,
	name,
	refId,
	abbreviation,
	onRemoved,
}: OtuHeaderIconsProps) {
	const [openEdit, setOpenEdit] = useState(false);
	const [openRemove, setOpenRemove] = useState(false);
	const { hasPermission: canModify } = useCheckReferenceRight(
		refId,
		"modifyOtu",
	);

	if (!canModify) {
		return null;
	}

	return (
		<>
			<IconButton
				key="edit-icon"
				color="gray"
				IconComponent={Pencil}
				tip="edit OTU"
				onClick={() => setOpenEdit(true)}
			/>
			<IconButton
				key="remove-icon"
				color="red"
				IconComponent={Trash}
				tip="remove OTU"
				onClick={() => setOpenRemove(true)}
			/>

			<OtuEdit
				otuId={id}
				name={name}
				abbreviation={abbreviation}
				open={openEdit}
				setOpen={setOpenEdit}
			/>
			<OtuRemove
				id={id}
				name={name}
				open={openRemove}
				setOpen={setOpenRemove}
				onRemoved={onRemoved}
			/>
		</>
	);
}
