import IconButton from "@base/IconButton";
import { useCheckReferenceRight } from "@references/hooks";
import { Pencil, Trash } from "lucide-react";
import OtuEdit from "../OtuEdit";
import OtuRemove from "../OtuRemove";
import { useOtuDetailSearch } from "./OtuDetailSearchContext";

type OTUHeaderEndIconsProps = {
	id: string;
	name: string;
	refId: string;
	abbreviation: string;
};

/**
 * Displays end icons to edit or remove an OTU
 */
export function OtuHeaderIcons({
	id,
	name,
	refId,
	abbreviation,
}: OTUHeaderEndIconsProps) {
	const { search, setSearch } = useOtuDetailSearch();
	const { hasPermission: canModify } = useCheckReferenceRight(
		refId,
		"modify_otu",
	);

	return canModify ? (
		<>
			<IconButton
				key="edit-icon"
				color="grayDark"
				IconComponent={Pencil}
				tip="edit OTU"
				onClick={() => setSearch({ openEditOTU: true })}
			/>
			<IconButton
				key="remove-icon"
				color="red"
				IconComponent={Trash}
				tip="remove OTU"
				onClick={() => setSearch({ openRemoveOTU: true })}
			/>

			<OtuEdit
				otuId={id}
				name={name}
				abbreviation={abbreviation}
				open={Boolean(search.openEditOTU)}
				setOpen={(openEditOTU) => setSearch({ openEditOTU })}
			/>
			<OtuRemove
				id={id}
				name={name}
				open={Boolean(search.openRemoveOTU)}
				refId={refId}
				setOpen={(openRemoveOTU) => setSearch({ openRemoveOTU })}
			/>
		</>
	) : null;
}
