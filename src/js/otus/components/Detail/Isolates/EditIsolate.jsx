import { DialogPortal } from "@radix-ui/react-dialog";
import { capitalize } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "../../../../base";
import { editIsolate, hideOTUModal } from "../../../actions";
import IsolateForm from "./IsolateForm";

function EditIsolate(props) {
    function handleSubmit({ sourceName, sourceType }) {
        props.onSave(props.otuId, props.isolateId, sourceType, sourceName);
    }

    return (
        <Dialog open={props.show} onOpenChange={props.onHide}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Edit Isolate</DialogTitle>
                    <IsolateForm
                        sourceType={capitalize(props.sourceType)}
                        sourceName={props.sourceName}
                        allowedSourceTypes={props.allowedSourceTypes}
                        restrictSourceTypes={props.restrictSourceTypes}
                        onSubmit={handleSubmit}
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}

const mapStateToProps = state => ({
    show: state.otus.editIsolate,
    allowedSourceTypes: state.references.detail.source_types,
    restrictSourceTypes: state.references.detail.restrict_source_types,
});

const mapDispatchToProps = dispatch => ({
    onHide: () => {
        dispatch(hideOTUModal());
    },

    onSave: (otuId, isolateId, sourceType, sourceName) => {
        dispatch(editIsolate(otuId, isolateId, sourceType, sourceName));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditIsolate);
