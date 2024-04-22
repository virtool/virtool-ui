import { DialogPortal } from "@radix-ui/react-dialog";
import { Field, Form, Formik } from "formik";
import React from "react";
import { connect } from "react-redux";
import * as Yup from "yup";
import { pushState } from "../../app/actions";
import { getRouterLocationStateValue } from "../../app/selectors";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogOverlay,
    DialogTitle,
    Input,
    InputError,
    InputGroup,
    InputLabel,
    SaveButton,
} from "../../base";
import { useCreateGroup } from "../queries";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Provide a name for the group"),
});

type CreateGroupProps = {
    /** Indicates whether the modal for creating a group is visible */
    show: boolean;
    /** A callback to hide the dialog */
    onHide: () => void;
};

/**
 * A dialog for creating a new group
 */
export function CreateGroup({ show, onHide }: CreateGroupProps) {
    const createGroupMutation = useCreateGroup();

    function handleSubmit(values: { name: string }) {
        createGroupMutation.mutate(
            { name: values.name },
            {
                onSuccess: () => {
                    onHide();
                },
            },
        );
    }

    return (
        <Dialog onOpenChange={onHide} open={show}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Create Group</DialogTitle>
                    <Formik onSubmit={handleSubmit} initialValues={{ name: "" }} validationSchema={validationSchema}>
                        {({ errors, touched }) => (
                            <Form>
                                <InputGroup>
                                    <InputLabel>Name</InputLabel>
                                    <Field name="name" id="name" as={Input} />
                                    <InputError>{touched.name && errors.name}</InputError>
                                </InputGroup>
                                <DialogFooter>
                                    <SaveButton />
                                </DialogFooter>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}

function mapStateToProps(state) {
    return {
        show: Boolean(getRouterLocationStateValue(state, "createGroup")),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onHide: () => {
            dispatch(pushState({ createGroup: false }));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroup);
