import { DialogPortal } from "@radix-ui/react-dialog";
import { get } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "../../../base";
import { clearError } from "../../../errors/actions";
import { editOTU, hideOTUModal } from "../../actions";
import { OTUForm } from "../OTUForm";

type EditOTUProps = {
    abbreviation: string;
    error: string;
    name: string;
    onHide: () => void;
    onSave: (otuId: string, name: string, abbreviation: string) => void;
    otuId: string;
    show: boolean;
};

/**
 * Displays a dialog for editing an OTU
 */
export function EditOTU({ show, onHide, otuId, onSave, error, name, abbreviation }: EditOTUProps) {
    function handleSubmit({ name, abbreviation }) {
        onSave(otuId, name, abbreviation);
    }

    return (
        <Dialog open={show} onOpenChange={onHide}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Edit OTU</DialogTitle>
                    <OTUForm name={name} abbreviation={abbreviation} error={error} onSubmit={handleSubmit} />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}

const mapStateToProps = state => ({
    show: state.otus.edit,
    error: get(state, "errors.EDIT_OTU_ERROR.message", ""),
});

const mapDispatchToProps = dispatch => ({
    onHide: () => {
        dispatch(hideOTUModal());
    },

    onSave: (otuId, name, abbreviation) => {
        dispatch(editOTU(otuId, name, abbreviation));
    },

    onClearError: () => {
        dispatch(clearError("EDIT_OTU_ERROR"));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditOTU);
