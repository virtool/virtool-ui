import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from "@base/Dialog";
import { useUpdateIsolate } from "@otus/queries";
import { capitalize } from "es-toolkit";
import IsolateForm from "./IsolateForm";

type EditIsolateProps = {
    allowedSourceTypes: string[];
    /** The id of the isolate being edited */
    isolateId: string;
    /** A callback function to hide the dialog */
    onHide: () => void;
    otuId: string;
    /** Indicates whether the source types are restricted */
    restrictSourceTypes: boolean;
    /** Indicates whether the dialog to edit an OTU is visible */
    show: boolean;
    sourceName: string;
    sourceType: string;
};

/**
 * Displays dialog to edit an OTU isolate
 */
export default function EditIsolate({
    allowedSourceTypes,
    isolateId,
    onHide,
    otuId,
    restrictSourceTypes,
    show,
    sourceName,
    sourceType,
}: EditIsolateProps) {
    const mutation = useUpdateIsolate();

    function handleSubmit({ sourceName, sourceType }) {
        mutation.mutate({ otuId, isolateId, sourceType, sourceName });
        onHide();
    }

    return (
        <Dialog open={show} onOpenChange={onHide}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Edit Isolate</DialogTitle>
                    <IsolateForm
                        sourceType={capitalize(sourceType)}
                        sourceName={sourceName}
                        allowedSourceTypes={allowedSourceTypes}
                        restrictSourceTypes={restrictSourceTypes}
                        onSubmit={handleSubmit}
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
