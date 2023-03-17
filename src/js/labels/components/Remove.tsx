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

interface RemoveLabelProps {
    id: string;
    name: string;
}

export function RemoveLabel({ id, name }: RemoveLabelProps) {
    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();

    const mutation = useMutation(
        () => {
            return Request.delete(`/api/labels/${id}`);
        },
        {
            onSuccess: () => {
                setOpen(false);
                queryClient.invalidateQueries("labels");
            }
        }
    );

    return (
        <Dialog open={open} onOpenChange={open => setOpen(open)}>
            <StyledButtonSmall as={DialogTrigger}>Delete</StyledButtonSmall>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Delete Label</DialogTitle>
                    <RemoveLabelQuestion>
                        Are you sure you want to delete the label <strong>{name}</strong>?
                    </RemoveLabelQuestion>
                    <RemoveLabelFooter>
                        <Button type="button" color="red" onClick={mutation.mutate}>
                            Delete
                        </Button>
                    </RemoveLabelFooter>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
