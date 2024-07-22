import { Dialog, DialogContent, DialogOverlay, DialogTitle, Tabs, TabsLink } from "@base";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useLocationState } from "@utils/hooks";
import React from "react";
import EmptyReference from "./EmptyReference";
import { ImportReference } from "./ImportReference";

/**
 * The create reference view with options to create an empty reference or import a reference
 */
export function CreateReference() {
    const [locationState, setLocationState] = useLocationState();

    return (
        <Dialog open={locationState?.createReference} onOpenChange={() => setLocationState({ createReference: false })}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent size="lg">
                    <DialogTitle>Create Reference</DialogTitle>
                    <Tabs>
                        <TabsLink
                            to={{ state: { createReference: true, emptyReference: true } }}
                            isActive={() => locationState?.emptyReference}
                        >
                            Empty
                        </TabsLink>
                        <TabsLink
                            to={{ state: { createReference: true, importReference: true } }}
                            isActive={() => locationState?.importReference}
                        >
                            Import
                        </TabsLink>
                    </Tabs>

                    {locationState?.importReference ? <ImportReference /> : <EmptyReference />}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
