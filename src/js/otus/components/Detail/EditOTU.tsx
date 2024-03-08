import { DialogPortal } from "@radix-ui/react-dialog";
import { get } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "../../../base";
import { clearError } from "../../../errors/actions";
import { editOTU } from "../../actions";
import { OTUForm } from "../OTUForm";

type EditOTUProps = {
    abbreviation: string;
    error: string;
    name: string;
    onSave: (otuId: string, name: string, abbreviation: string) => void;
    otuId: string;
};

/**
 * Displays a dialog for editing an OTU
 */
export function EditOTU({ otuId, onSave, error, name, abbreviation }: EditOTUProps) {
    const location = useLocation<{ editOTU: boolean }>();
    const history = useHistory();

    function handleSubmit({ name, abbreviation }) {
        onSave(otuId, name, abbreviation);
        history.replace({ state: { editOTU: false } });
    }

    return (
        <Dialog open={location.state?.editOTU} onOpenChange={() => history.replace({ state: { editOTU: false } })}>
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
    error: get(state, "errors.EDIT_OTU_ERROR.message", ""),
});

const mapDispatchToProps = dispatch => ({
    onSave: (otuId, name, abbreviation) => {
        dispatch(editOTU(otuId, name, abbreviation));
    },

    onClearError: () => {
        dispatch(clearError("EDIT_OTU_ERROR"));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditOTU);
