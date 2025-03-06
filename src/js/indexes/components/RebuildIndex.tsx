import {
    Button,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogOverlay,
    DialogTitle,
} from "@/base";
import { useCreateIndex, useFetchUnbuiltChanges } from "@indexes/queries";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useDialogParam } from "@/hooks";
import React from "react";
import RebuildHistory from "./History";
import RebuildIndexError from "./RebuildIndexError";

type RebuildIndexProps = {
    refId: string;
};

/**
 * Displays a dialog to rebuild an index
 */
export default function RebuildIndex({ refId }: RebuildIndexProps) {
    const { open: openRebuild, setOpen: setOpenRebuild } =
        useDialogParam("openRebuild");
    const { data, isPending } = useFetchUnbuiltChanges(refId);
    const mutation = useCreateIndex();

    if (isPending) {
        return null;
    }

    function handleSubmit(e) {
        e.preventDefault();
        mutation.mutate(
            { refId },
            {
                onSuccess: () => {
                    setOpenRebuild(false);
                },
            },
        );
    }

    return (
        <Dialog open={openRebuild} onOpenChange={() => setOpenRebuild(false)}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Rebuild Index</DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <RebuildIndexError
                            error={
                                mutation.isError &&
                                mutation.error.response.body.message
                            }
                        />
                        <RebuildHistory unbuilt={data} />
                        <DialogFooter>
                            <Button type="submit" color="blue">
                                Start
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
