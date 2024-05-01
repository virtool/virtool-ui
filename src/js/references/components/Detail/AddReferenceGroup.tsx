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
    NoneFoundSection,
    SelectBoxGroupSection,
    Toolbar,
} from "../../../base";
import { CompactScrollList } from "../../../base/CompactScrollList";
import { useInfiniteFindGroups } from "../../../groups/queries";
import { useAddReferenceMember } from "../../queries";
import { ReferenceGroup } from "../../types";

const StyledAddGroupItem = styled(SelectBoxGroupSection)`
    display: flex;
    align-items: center;

    .InitialIcon {
        margin-right: 5px;
    }
`;

const AddReferenceGroupHeader = styled(DialogTitle)`
    text-transform: capitalize;
`;

const StyledScrollList = styled(CompactScrollList)`
    border: ${props => getBorder(props)};
    border-radius: ${props => props.theme.borderRadius.sm};
    overflow-y: auto;
    height: 320px;
`;

type AddReferenceGroupProps = {
    groups: ReferenceGroup[];
    /** A callback to hide the dialog */
    onHide: () => void;
    refId: string;
    /** Indicates whether the dialog for adding a reference group is visible */
    show: boolean;
};

/**
 * Displays a dialog for adding a reference member
 */
export default function AddReferenceGroup({ groups, onHide, refId, show }: AddReferenceGroupProps) {
    const mutation = useAddReferenceMember(refId, "group");
    const [term, setTerm] = useState("");
    const { data, isLoading, isError, isFetchingNextPage, fetchNextPage } = useInfiniteFindGroups(25, term);

    if (isLoading || isError) {
        return null;
    }

    const groupIds = map(groups, "id");
    const items = flatMap(data.pages, page => page.items);
    const filteredItems = filter(items, item => !includes(groupIds, item.id));

    function renderRow(item) {
        return (
            <StyledAddGroupItem key={item.id} onClick={() => mutation.mutate({ id: item.id })}>
                <InitialIcon size="md" handle={item.name} />
                {item.name}
            </StyledAddGroupItem>
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
                    <AddReferenceGroupHeader>Add Group</AddReferenceGroupHeader>
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
                            <NoneFoundSection noun="other groups" />
                        </BoxGroup>
                    )}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
