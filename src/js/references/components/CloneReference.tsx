import {
    Attribution,
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
} from "@base";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useLocationState } from "@utils/hooks";
import { find } from "lodash-es";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useCloneReference } from "../queries";
import { ReferenceMinimal } from "../types";

const ReferenceBox = styled(Box)`
    display: flex;
    align-items: center;

    ${Badge} {
        margin-left: 5px;
    }

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
    const [locationState, setLocationState] = useLocationState();
    const reference = find(references, { id: locationState?.cloneReference || "" });

    useEffect(() => {
        reference && setValue("name", `Clone of ${reference.name}`);
    }, [reference]);

    function onSubmit({ name }: FormValues) {
        mutation.mutate(
            { name, description: `Cloned from ${reference.name}`, refId: reference.id },
            {
                onSuccess: () => {
                    setLocationState({ cloneReference: false });
                },
            },
        );
    }

    return (
        <Dialog
            onOpenChange={() => setLocationState({ cloneReference: false })}
            open={Boolean(locationState?.cloneReference)}
        >
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Clone Reference</DialogTitle>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputLabel htmlFor="selectedReference">Selected reference</InputLabel>
                        {reference && (
                            <ReferenceBox id="selectedReference">
                                <strong>{reference.name}</strong> <Badge>{reference.otu_count} OTUs</Badge>
                                <Attribution time={reference.created_at} user={reference.user.handle} />
                            </ReferenceBox>
                        )}
                        <InputGroup>
                            <InputLabel htmlFor="name">Name</InputLabel>
                            <InputSimple id="name" {...register("name", { required: "Required Field" })} />
                            <InputError>{errors.name?.message}</InputError>
                        </InputGroup>
                        <DialogFooter>
                            <SaveButton disabled={!references.length} altText="Clone" />
                        </DialogFooter>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
