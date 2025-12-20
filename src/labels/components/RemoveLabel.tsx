import IconButton from "@/base/IconButton";
import { getFontSize } from "@app/theme";
import Button from "@base/Button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@base/Dialog";
import { useState } from "react";
import styled from "styled-components";
import { useRemoveLabel } from "../queries";

const RemoveLabelQuestion = styled.p`
    font-size: ${getFontSize("lg")};
`;

const RemoveLabelFooter = styled.footer`
    display: flex;
    margin-top: 30px;
`;

type RemoveLabelProps = {
    id: number;
    name: string;
};

/**
 * Displays a dialog for removing a label
 */
export function DeleteLabel({ id, name }: RemoveLabelProps) {
    const [open, setOpen] = useState(false);
    const mutation = useRemoveLabel();

    function handleSubmit() {
        mutation.mutate(
            { labelId: id },
            {
                onSuccess: () => {
                    setOpen(false);
                },
            },
        );
    }

    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogTrigger asChild>
                <IconButton color="red" name="trash" tip="Delete" />
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Delete Label</DialogTitle>
                <RemoveLabelQuestion>
                    Are you sure you want to delete the label{" "}
                    <strong>{name}</strong>?
                </RemoveLabelQuestion>
                <RemoveLabelFooter>
                    <Button type="button" color="red" onClick={handleSubmit}>
                        Delete
                    </Button>
                </RemoveLabelFooter>
            </DialogContent>
        </Dialog>
    );
}
