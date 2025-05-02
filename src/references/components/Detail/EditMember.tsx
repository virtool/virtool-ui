import { useUrlSearchParam } from "../../../app/hooks";
import Dialog from "../../../base/Dialog";
import DialogContent from "../../../base/DialogContent";
import DialogOverlay from "../../../base/DialogOverlay";
import DialogTitle from "../../../base/DialogTitle";
import { DialogPortal } from "@radix-ui/react-dialog";
import {
    referenceQueryKeys,
    useUpdateReferenceMember,
} from "../../queries";
import { ReferenceGroup, ReferenceUser } from "../../types";
import { useQueryClient } from "@tanstack/react-query";
import { map } from "lodash-es";
import React from "react";
import { ReferenceRight } from "./ReferenceRight";

const rights = ["modify_otu", "build", "modify", "remove"];

type EditReferenceMemberProps = {
    member: ReferenceGroup | ReferenceUser;
    noun: string;
    refId: string;
};

/**
 * Displays a dialog to modify rights for a member
 */
export default function EditReferenceMember({
    noun,
    refId,
    member,
}: EditReferenceMemberProps) {
    const { value: editId, unsetValue: unsetEditId } =
        useUrlSearchParam<string>(`edit${noun}Id`);
    const mutation = useUpdateReferenceMember(noun);
    const queryClient = useQueryClient();

    function handleChange(key: string, enabled: boolean) {
        mutation.mutate(
            {
                refId,
                id: editId,
                update: {
                    [key]: enabled,
                },
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: referenceQueryKeys.detail(refId),
                    });
                },
            },
        );
    }

    const rightComponents = map(rights, (right) => (
        <ReferenceRight
            key={right}
            right={right}
            enabled={member?.[right]}
            onToggle={handleChange}
        />
    ));

    return (
        <Dialog open={Boolean(editId)} onOpenChange={() => unsetEditId()}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>
                        Modify Rights for{" "}
                        {(member as ReferenceUser)?.handle ||
                            (member as ReferenceGroup)?.name}
                    </DialogTitle>
                    {rightComponents}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
