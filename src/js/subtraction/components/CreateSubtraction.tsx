import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@base";
import { DialogPortal } from "@radix-ui/react-dialog";
import { CreateSubtractionForm } from "@subtraction/components/CreateSubtractionForm";
import { useLocationState } from "@utils/hooks";
import React from "react";

/**
 * Displays a dialog for creating a subtraction
 */
export default function CreateSubtraction() {
    const [locationState, setLocationState] = useLocationState();

    return (
        <Dialog
            open={locationState?.createSubtraction}
            onOpenChange={() => setLocationState({ createSubtraction: false })}
        >
            <DialogPortal>
                <DialogOverlay />
                <DialogContent size="lg">
                    <DialogTitle>Create Subtraction</DialogTitle>
                    <CreateSubtractionForm />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
