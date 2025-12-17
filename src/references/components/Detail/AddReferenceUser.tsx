import { getBorder } from "@app/theme";
import BoxGroup from "@base/BoxGroup";
import CompactScrollList from "@base/CompactScrollList";
import { Dialog, DialogContent, DialogTitle } from "@base/Dialog";
import InitialIcon from "@base/InitialIcon";
import InputSearch from "@base/InputSearch";
import NoneFoundSection from "@base/NoneFoundSection";
import SelectBoxGroupSection from "@base/SelectBoxGroupSection";
import Toolbar from "@base/Toolbar";
import { useAddReferenceMember } from "@references/queries";
import { ReferenceUser } from "@references/types";
import { useInfiniteFindUsers } from "@users/queries";
import { useState } from "react";
import styled from "styled-components";

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
    border: ${(props) => getBorder(props)};
    border-radius: ${(props) => props.theme.borderRadius.sm};
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
export default function AddReferenceUser({
    users,
    onHide,
    refId,
    show,
}: AddReferenceUserProps) {
    const mutation = useAddReferenceMember(refId, "user");
    const [term, setTerm] = useState("");
    const { data, isPending, isFetchingNextPage, fetchNextPage } =
        useInfiniteFindUsers(25, term);

    if (isPending) {
        return null;
    }

    const userIds = users.map((u) => u.id);
    const items = data.pages.flatMap((page) => page.documents);
    const filteredItems = items.filter((item) => !userIds.includes(item.id));

    function renderRow(item) {
        return (
            <StyledAddUserItem
                key={item.id}
                onClick={() => mutation.mutate({ id: item.id })}
            >
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
            <DialogContent>
                <AddReferenceUserHeader>Add User</AddReferenceUserHeader>
                <Toolbar>
                    <div className="flex-grow">
                        <InputSearch
                            name="search"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                        />
                    </div>
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
                        <NoneFoundSection noun="other users" />
                    </BoxGroup>
                )}
            </DialogContent>
        </Dialog>
    );
}
