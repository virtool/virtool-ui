import { DialogPortal } from "@radix-ui/react-dialog";
import { Field, Form, Formik } from "formik";
import { find } from "lodash-es";
import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import {
    Attribution,
    Badge,
    Box,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogOverlay,
    DialogTitle,
    Input,
    InputError,
    InputGroup,
    SaveButton,
} from "../../base";
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

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required Field"),
});

function getInitialValues(originalRef: ReferenceMinimal) {
    return {
        name: originalRef ? `Clone of ${originalRef.name}` : "",
    };
}

type CloneReferenceProps = {
    /** A list of minimal references */
    references: ReferenceMinimal[];
};

/**
 * Displays a form used for creating a clone of a reference
 */
export default function CloneReference({ references }: CloneReferenceProps) {
    const history = useHistory();
    const mutation = useCloneReference();

    const reference = find(references, { id: (history.location.state?.["id"]) || "" });

    function onHide() {
        history.push({ state: { cloneReference: false } });
    }

    function handleSubmit({ name }: { name: string }) {
        mutation.mutate(
            { name, description: `Cloned from ${reference.name}`, refId: reference.id },
            {
                onSuccess: () => {
                    onHide();
                },
            },
        );
    }

    return (
        <Dialog
            onOpenChange={onHide}
            open={(history.location.state?.["cloneReference"]) || false}
        >
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Clone Reference</DialogTitle>
                    <Formik
                        onSubmit={handleSubmit}
                        initialValues={getInitialValues(reference)}
                        validationSchema={validationSchema}
                    >
                        {({ touched, errors }) => (
                            <Form>
                                <label htmlFor="selectedReference"> Selected reference </label>
                                {reference && (
                                    <ReferenceBox id="selectedReference">
                                        <strong>{reference.name}</strong> <Badge>{reference.otu_count} OTUs</Badge>
                                        <Attribution time={reference.created_at} user={reference.user.handle} />
                                    </ReferenceBox>
                                )}
                                <label htmlFor="name"> Name </label>
                                <InputGroup>
                                    <Field name="name" id="name" as={Input} />
                                    <InputError>{touched.name && errors.name}</InputError>
                                </InputGroup>
                                <DialogFooter>
                                    <SaveButton disabled={!references.length} altText="Clone" />
                                </DialogFooter>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
