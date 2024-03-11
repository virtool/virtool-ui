import { RemoveDialog } from "@base/RemoveDialog";
import React from "react";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { removeSequence } from "../../otus/actions";
import { getActiveIsolateId, getOTUDetailId } from "../../otus/selectors";

export function RemoveSequence({ isolateName, isolateId, otuId, onConfirm }) {
    const history = useHistory();
    const location = useLocation<{ removeSequence: boolean }>();
    console.log(location);

    const sequenceId = location.state?.removeSequence;
    console.log(sequenceId);

    function handleConfirm() {
        onConfirm(otuId, isolateId, sequenceId);
        history.replace({ state: { removeSequence: false } });
    }

    const removeMessage = (
        <span>
            Are you sure you want to remove the sequence from
            <strong> {isolateName}</strong>?
        </span>
    );

    return (
        <RemoveDialog
            name={`${sequenceId}`}
            noun="Sequence"
            onConfirm={handleConfirm}
            onHide={() => history.replace({ state: { removeSequence: false } })}
            show={location.state?.removeSequence}
            message={removeMessage}
        />
    );
}

const mapStateToProps = state => ({
    isolateId: getActiveIsolateId(state),
    otuId: getOTUDetailId(state),
});

const mapDispatchToProps = dispatch => ({
    onConfirm: (otuId, isolateId, sequenceId) => {
        dispatch(removeSequence(otuId, isolateId, sequenceId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(RemoveSequence);
