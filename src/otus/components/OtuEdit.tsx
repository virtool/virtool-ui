import { useDialogParam } from "@app/hooks";
import { Dialog, DialogContent, DialogTitle } from "@base/Dialog";
import { useUpdateOTU } from "@otus/queries";
import OtuForm from "./OtuForm";

type OtuEditProps = {
    abbreviation: string;
    name: string;
    otuId: string;
};

/**
 * Displays a dialog for editing an OTU
 */
export default function OtuEdit({ abbreviation, name, otuId }: OtuEditProps) {
    const { open: openEditOTU, setOpen: setOpenEditOTU } =
        useDialogParam("openEditOTU");

    const mutation = useUpdateOTU(otuId);

    function handleSubmit({ name, abbreviation }) {
        mutation.mutate(
            { otuId, name, abbreviation },
            {
                onSuccess: () => {
                    setOpenEditOTU(false);
                },
            },
        );
    }

    function onHide() {
        setOpenEditOTU(false);
        mutation.reset();
    }

    return (
        <Dialog open={openEditOTU} onOpenChange={onHide}>
            <DialogContent>
                <DialogTitle>Edit OTU</DialogTitle>
                <OtuForm
                    name={name}
                    abbreviation={abbreviation}
                    error={
                        mutation.isError && mutation.error.response.body.message
                    }
                    onSubmit={handleSubmit}
                />
            </DialogContent>
        </Dialog>
    );
}
