import { Button, Dialog, DialogContent, DialogFooter, DialogOverlay, DialogTitle } from "@base";
import { useCreateIndex, useFetchUnbuiltChanges } from "@indexes/queries";
import { DialogPortal } from "@radix-ui/react-dialog";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import RebuildHistory from "./History";
import RebuildIndexError from "./RebuildIndexError";

type RebuildIndexProps = {
    refId: string;
};

/**
 * Displays a dialog to rebuild an index
 */
export default function RebuildIndex({ refId }: RebuildIndexProps) {
    const history = useHistory();
    const location = useLocation<{ rebuild: boolean }>();
    const { data, isLoading } = useFetchUnbuiltChanges(refId);
    const mutation = useCreateIndex();

    if (isLoading) {
        return null;
    }

    function handleSubmit(e) {
        e.preventDefault();
        mutation.mutate(
            { refId },
            {
                onSuccess: () => {
                    history.push({ state: { rebuild: false } });
                },
            }
        );
    }

    return (
        <Dialog open={location.state?.rebuild} onOpenChange={() => history.push({ state: { rebuild: false } })}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Rebuild Index</DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <RebuildIndexError error={mutation.isError && mutation.error.response.body.message} />
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
