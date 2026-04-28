import RemoveDialog from "@base/RemoveDialog";
import { useNavigate } from "@tanstack/react-router";
import { useRemoveOTU } from "../queries";

type RemoveOtuProps = {
	id: string;
	name: string;
	open?: boolean;
	refId: string;
	setOpen?: (open: boolean) => void;
};

/**
 * Displays a dialog for removing an OTU
 */
export default function OtuRemove({
	id,
	name,
	open = false,
	refId,
	setOpen = () => {},
}: RemoveOtuProps) {
	const navigate = useNavigate();

	const mutation = useRemoveOTU();

	function handleConfirm() {
		mutation.mutate(
			{ otuId: id },
			{
				onSuccess: () => {
					navigate({ to: `/refs/${refId}/otus/` });
				},
			},
		);
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
