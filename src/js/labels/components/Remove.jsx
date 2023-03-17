import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import styled from "styled-components";
import { Request } from "../../app/request";
import { getFontSize } from "../../app/theme";
import { Button, Dialog, DialogContent, DialogOverlay, DialogTitle } from "../../base";
import { StyledButtonSmall } from "../../base/styled/StyledButtonSmall";

const RemoveLabelQuestion = styled.p`
    font-size: ${getFontSize("lg")};
`;

const RemoveLabelFooter = styled.footer`
    display: flex;
    margin-top: 30px;
`;

export function RemoveLabel({ id, name }) {
    const [show, setShow] = useState(false);

    const queryClient = useQueryClient();

    const mutation = useMutation(() => {
        return Request.delete(`/api/labels/${id}`);
    });

    const handleDelete = () => {
        mutation.mutate(["label", id], {
            onSuccess: () => {
                setShow(false);
                queryClient.invalidateQueries("labels");
            }
        });
    };

    return (
        <Dialog show={show} onOpenChange={open => setShow(open)}>
            <StyledButtonSmall as={DialogTrigger}>Delete</StyledButtonSmall>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Delete Label</DialogTitle>
                    <RemoveLabelQuestion>
                        Are you sure you want to delete the label <strong>{name}</strong>?
                    </RemoveLabelQuestion>
                    <RemoveLabelFooter>
                        <Button type="button" color="red" onClick={handleDelete}>
                            Delete
                        </Button>
                    </RemoveLabelFooter>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
