import { DialogPortal } from "@radix-ui/react-dialog";
import { filter, flatMap, includes, map } from "lodash-es";
import React, { useState } from "react";
import styled from "styled-components";
import { getBorder } from "../../../app/theme";
import {
    BoxGroup,
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogTitle,
    InitialIcon,
    InputSearch,
    LoadingPlaceholder,
    NoneFoundSection,
    SelectBoxGroupSection,
    Toolbar,
} from "../../../base";
import { CompactScrollList } from "../../../base/CompactScrollList";
import { useInfiniteFindUsers } from "../../../users/queries";
import { useAddReferenceMember } from "../../queries";
import { ReferenceUser } from "../../types";

const StyledAddUserItem = styled(SelectBoxGroupSection)`
    display: flex;
    align-items: center;

    .InitialIcon {
        margin-right: 5px;
    }
`;

const AddReferenceUserHeader = styled(DialogTitle)`
    text-transform: capitalize;
`;

const StyledScrollList = styled(CompactScrollList)`
    border: ${props => getBorder(props)};
    border-radius: ${props => props.theme.borderRadius.sm};
    overflow-y: auto;
    height: 320px;
`;

type AddReferenceUserProps = {
    users: ReferenceUser[];
    /** A callback to hide the dialog */
    onHide: () => void;
    refId: string;
    /** Indicates whether the dialog for adding a reference group is visible */
    show: boolean;
};

/**
 * Displays a dialog for adding a reference member
 */
export default function AddReferenceUser({ users, onHide, refId, show }: AddReferenceUserProps) {
    const mutation = useAddReferenceMember(refId, "user");
    const [term, setTerm] = useState("");
    const { data, isLoading, isFetchingNextPage, fetchNextPage } = useInfiniteFindUsers(25, term);

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    const userIds = map(users, "id");
    const items = flatMap(data.pages, page => page.documents);
    const filteredItems = filter(items, item => !includes(userIds, item.id));

    function renderRow(item) {
        return (
            <StyledAddUserItem key={item.id} onClick={() => mutation.mutate({ id: item.id })}>
                <InitialIcon size="md" handle={item.handle} />
                {item.handle}
            </StyledAddUserItem>
        );
    }

    function onOpenChange() {
        onHide();
        setTerm("");
    }

    return (
        <Dialog open={show} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <AddReferenceUserHeader>Add User</AddReferenceUserHeader>
                    <Toolbar>
                        <InputSearch name="search" value={term} onChange={e => setTerm(e.target.value)} />
                    </Toolbar>
                    {filteredItems.length ? (
                        <StyledScrollList
                            fetchNextPage={fetchNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            isLoading={isLoading}
                            items={filteredItems}
                            renderRow={renderRow}
                        />
                    ) : (
                        <BoxGroup>
                            <NoneFoundSection noun="other users" />
                        </BoxGroup>
                    )}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
