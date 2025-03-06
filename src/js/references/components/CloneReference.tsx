import {
    Badge,
    Box,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogOverlay,
    DialogTitle,
    InputError,
    InputGroup,
    InputLabel,
    InputSimple,
    SaveButton,
} from "@/base";
import { useUrlSearchParam } from "@/hooks";
import Attribution from "@base/Attribution";
import { DialogPortal } from "@radix-ui/react-dialog";
import { find } from "lodash-es";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useCloneReference } from "../queries";
import { ReferenceMinimal } from "../types";

const ReferenceBox = styled(Box)`
    display: flex;
    align-items: center;

    span:last-child {
        margin-left: auto;
    }
`;

type FormValues = {
    name: string;
};

type CloneReferenceProps = {
    /** A list of minimal references */
    references: ReferenceMinimal[];
};

/**
 * Displays a form used for creating a clone of a reference
 */
export default function CloneReference({ references }: CloneReferenceProps) {
    const {
        formState: { errors },
        register,
        handleSubmit,
        setValue,
    } = useForm<FormValues>();
    const mutation = useCloneReference();
    const { value: cloneReferenceId, unsetValue: unsetCloneReferenceId } =
        useUrlSearchParam("cloneReferenceId");
    const reference = find(references, { id: cloneReferenceId || "" });

    useEffect(() => {
        if (reference) {
            setValue("name", `Clone of ${reference.name}`);
        }
    }, [reference, setValue]);

    function onSubmit({ name }: FormValues) {
        mutation.mutate(
            {
                name,
                description: `Cloned from ${reference.name}`,
                refId: reference.id,
            },
            {
                onSuccess: () => {
                    unsetCloneReferenceId();
                },
            },
        );
    }

    return (
        <Dialog
            onOpenChange={() => unsetCloneReferenceId()}
            open={Boolean(cloneReferenceId)}
        >
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Clone Reference</DialogTitle>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputLabel htmlFor="selectedReference">
                            Selected reference
                        </InputLabel>
                        {reference && (
                            <ReferenceBox id="selectedReference">
                                <strong>{reference.name}</strong>
                                <Badge className="ml-1.5">
                                    {reference.otu_count} OTUs
                                </Badge>
                                <Attribution
                                    time={reference.created_at}
                                    user={reference.user.handle}
                                />
                            </ReferenceBox>
                        )}
                        <InputGroup>
                            <InputLabel htmlFor="name">Name</InputLabel>
                            <InputSimple
                                id="name"
                                {...register("name", {
                                    required: "Required Field",
                                })}
                            />
                            <InputError>{errors.name?.message}</InputError>
                        </InputGroup>
                        <DialogFooter>
                            <SaveButton
                                disabled={!references.length}
                                altText="Clone"
                            />
                        </DialogFooter>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
