import DeleteDialog from "@base/DeleteDialog";
import { useRemoveOtu } from "../queries";

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
	const mutation = useRemoveOtu();

	async function handleConfirm() {
		await mutation.mutateAsync({ otuId: id });
		onRemoved();
	}

	return (
		<DeleteDialog
			name={name}
			noun="OTU"
			onConfirm={handleConfirm}
			onOpenChange={setOpen}
			open={open}
		/>
	);
}
