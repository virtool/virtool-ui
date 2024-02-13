import { DialogPortal } from "@radix-ui/react-dialog";
import { filter, flatMap, includes, map } from "lodash-es";
import React from "react";
import { InfiniteData } from "react-query";
import { FetchNextPageOptions, InfiniteQueryObserverResult } from "react-query/types/core/types";
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
import { GroupSearchResults } from "../../../groups/types";
import { UserResponse } from "../../../users/types";
import { useAddReferenceMember } from "../../querys";
import { ReferenceGroup, ReferenceUser } from "../../types";

const StyledAddMemberItem = styled(SelectBoxGroupSection)`
    display: flex;
    align-items: center;

    .InitialIcon {
        margin-right: 5px;
    }
`;

const AddReferenceMemberHeader = styled(DialogTitle)`
    text-transform: capitalize;
`;

const StyledScrollList = styled(CompactScrollList)`
    border: ${props => getBorder(props)};
    border-radius: ${props => props.theme.borderRadius.sm};
    overflow-y: auto;
    height: 320px;
`;

type AddReferenceMemberProps = {
    /** The data of the member on current page */
    data: InfiniteData<UserResponse | GroupSearchResults>;
    /** Fetches the next page of data */
    fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult>;
    /** Whether the next page is being fetched */
    isFetchingNextPage: boolean;
    /** Whether the data is loading */
    isLoading: boolean;
    /** The list of users or groups associated with the reference */
    members: ReferenceGroup[] | ReferenceUser[];
    /** Whether the member is a user or a group */
    noun: string;
    /** A function to handle input change */
    setTerm: (term: string) => void;
    /** A callback to hide the dialog */
    onHide: () => void;
    refId: string;
    /** Indicates whether the dialog for adding a reference member is visible */
    show: boolean;
    /** The search term to filter the data by */
    term: string;
};

/**
 * Displays a dialog for adding a reference member
 */
export default function AddReferenceMember({
    data,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    members,
    noun,
    setTerm,
    onHide,
    refId,
    show,
    term,
}: AddReferenceMemberProps) {
    const mutation = useAddReferenceMember(refId, noun);

    const memberIds = map(members, "id");
    const items = flatMap(data.pages, page => page.items);
    const filteredItems = filter(items, item => !includes(memberIds, item.id));

    function renderRow(item) {
        const name = item.handle ? item.handle : item.name;

        return (
            <StyledAddMemberItem key={item.id} onClick={() => mutation.mutate({ id: item.id })}>
                <InitialIcon size="md" handle={name} />
                {name}
            </StyledAddMemberItem>
        );
    }

    function onOpenChange() {
        onHide();
        setTerm("");
    }

    return (
        <>
            <Dialog open={show} onOpenChange={onOpenChange}>
                <DialogPortal>
                    <DialogOverlay />
                    <DialogContent>
                        <AddReferenceMemberHeader>{`Add ${noun}`}</AddReferenceMemberHeader>
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
                                <NoneFoundSection noun={`other ${noun}s`} />
                            </BoxGroup>
                        )}
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </>
    );
}
