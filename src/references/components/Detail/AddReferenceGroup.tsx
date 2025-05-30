import { getBorder } from "@app/theme";
import BoxGroup from "@base/BoxGroup";
import CompactScrollList from "@base/CompactScrollList";
import Dialog from "@base/Dialog";
import DialogContent from "@base/DialogContent";
import DialogOverlay from "@base/DialogOverlay";
import DialogTitle from "@base/DialogTitle";
import InitialIcon from "@base/InitialIcon";
import InputSearch from "@base/InputSearch";
import NoneFoundSection from "@base/NoneFoundSection";
import SelectBoxGroupSection from "@base/SelectBoxGroupSection";
import Toolbar from "@base/Toolbar";
import { useInfiniteFindGroups } from "@groups/queries";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useAddReferenceMember } from "@references/queries";
import { ReferenceGroup } from "@references/types";
import { filter, flatMap, includes, map } from "lodash-es";
import React, { useState } from "react";
import styled from "styled-components";

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
    border: ${(props) => getBorder(props)};
    border-radius: ${(props) => props.theme.borderRadius.sm};
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
export default function AddReferenceGroup({
    groups,
    onHide,
    refId,
    show,
}: AddReferenceGroupProps) {
    const mutation = useAddReferenceMember(refId, "group");
    const [term, setTerm] = useState("");
    const { data, isPending, isFetchingNextPage, fetchNextPage } =
        useInfiniteFindGroups(25, term);

    if (isPending) {
        return null;
    }

    const groupIds = map(groups, "id");
    const items = flatMap(data.pages, (page) => page.items);
    const filteredItems = filter(items, (item) => !includes(groupIds, item.id));

    function renderRow(item) {
        return (
            <StyledAddGroupItem
                key={item.id}
                onClick={() => mutation.mutate({ id: item.id })}
            >
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
                        <InputSearch
                            name="search"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                        />
                    </Toolbar>
                    {filteredItems.length ? (
                        <StyledScrollList
                            fetchNextPage={fetchNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            isPending={isPending}
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
