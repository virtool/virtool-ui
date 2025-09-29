import { formatSearchParams, useUrlSearchParam } from "@app/hooks";
import Dialog from "@base/Dialog";
import DialogContent from "@base/DialogContent";
import DialogOverlay from "@base/DialogOverlay";
import DialogTitle from "@base/DialogTitle";
import Tabs from "@base/Tabs";
import TabsLink from "@base/TabsLink";
import { DialogPortal } from "@radix-ui/react-dialog";
import EmptyReference from "./EmptyReference";
import ImportReference from "./ImportReference";

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
