import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogTitle,
    Tabs,
    TabsLink,
} from "@base";
import { DialogPortal } from "@radix-ui/react-dialog";
import { formatSearchParams, useUrlSearchParam } from "@utils/hooks";
import React from "react";
import EmptyReference from "./EmptyReference";
import { ImportReference } from "./ImportReference";

/**
 * The create reference view with options to create an empty reference or import a reference
 */
export function CreateReference() {
    const { value: createReferenceType, unsetValue: unsetCreateReferenceType } =
        useUrlSearchParam("createReferenceType");

    return (
        <Dialog
            open={Boolean(createReferenceType)}
            onOpenChange={() => {
                unsetCreateReferenceType();
            }}
        >
            <DialogPortal>
                <DialogOverlay />
                <DialogContent size="lg">
                    <DialogTitle>Create Reference</DialogTitle>
                    <Tabs>
                        <TabsLink
                            to={formatSearchParams({
                                createReferenceType: "empty",
                            })}
                            isActive={createReferenceType === "empty"}
                        >
                            Empty
                        </TabsLink>
                        <TabsLink
                            to={formatSearchParams({
                                createReferenceType: "import",
                            })}
                            isActive={createReferenceType === "import"}
                        >
                            Import
                        </TabsLink>
                    </Tabs>

                    {createReferenceType === "import" ? (
                        <ImportReference />
                    ) : (
                        <EmptyReference />
                    )}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
