import RemoveDialog from "@base/RemoveDialog";
import { useRemoveOTU } from "../queries";

type RemoveOtuProps = {
	id: string;
	name: string;
	open?: boolean;
	onRemoved: () => void;
	setOpen?: (open: boolean) => void;
};

/**
 * Displays a dialog for removing an OTU
 */
export default function OtuRemove({
	id,
	name,
	open = false,
	onRemoved,
	setOpen = () => {},
}: RemoveOtuProps) {
	const mutation = useRemoveOTU();

	function handleConfirm() {
		mutation.mutate({ otuId: id }, { onSuccess: onRemoved });
	}

	return (
		<RemoveDialog
			name={name}
			noun="OTU"
			onConfirm={handleConfirm}
			onHide={() => setOpen(false)}
			show={open}
		/>
	);
}
