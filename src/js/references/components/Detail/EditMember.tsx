import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@base";
import { DialogPortal } from "@radix-ui/react-dialog";
import { referenceQueryKeys, useUpdateReferenceMember } from "@references/queries";
import { ReferenceGroup, ReferenceUser } from "@references/types";
import { useQueryClient } from "@tanstack/react-query";
import { map } from "lodash-es";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { MemberRight } from "./MemberRight";

const rights = ["modify_otu", "build", "modify", "remove"];

type EditReferenceMemberProps = {
    member: ReferenceGroup | ReferenceUser;
    noun: string;
    refId: string;
};

/**
 * Displays a dialog to modify rights for a member
 */
export default function EditReferenceMember({ noun, refId, member }: EditReferenceMemberProps) {
    const history = useHistory();
    const location = useLocation();
    const mutation = useUpdateReferenceMember(noun);
    const queryClient = useQueryClient();

    function handleChange(key: string, enabled: boolean) {
        const { modify_otu, build, modify, remove } = member;

        const update = {
            modify_otu,
            build,
            modify,
            remove,
            [key]: enabled,
        };

        mutation.mutate(
            { refId, id: location.state?.[`edit${noun}`], update },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries(referenceQueryKeys.detail(refId));
                },
            },
        );
    }

    const rightComponents = map(rights, right => (
        <MemberRight key={right} right={right} enabled={member && member[right]} onToggle={handleChange} />
    ));

    return (
        <Dialog
            open={location.state?.[`edit${noun}`]}
            onOpenChange={() => history.push({ state: { [`edit${noun}`]: false } })}
        >
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>
                        Modify Rights for {(member as ReferenceUser)?.handle || (member as ReferenceGroup)?.name}
                    </DialogTitle>
                    {rightComponents}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
