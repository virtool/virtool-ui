import { useDialogParam, useNavigate } from "@app/hooks";
import RemoveDialog from "@base/RemoveDialog";
import { useRemoveOTU } from "../queries";

type RemoveOtuProps = {
    id: string;
    name: string;
    refId: string;
};

/**
 * Displays a dialog for removing an OTU
 */
export default function OtuRemove({ id, name, refId }: RemoveOtuProps) {
    const navigate = useNavigate();

    const { open: openRemoveOTU, setOpen: setOpenRemoveOTU } =
        useDialogParam("openRemoveOTU");

    const mutation = useRemoveOTU();

    function handleConfirm() {
        mutation.mutate(
            { otuId: id },
            {
                onSuccess: () => {
                    navigate(`/refs/${refId}/otus/`);
                },
            },
        );
    }

    return (
        <RemoveDialog
            name={name}
            noun="OTU"
            onConfirm={handleConfirm}
            onHide={() => setOpenRemoveOTU(false)}
            show={openRemoveOTU}
        />
    );
}
