import React, { useCallback } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { CloseButton, Icon, IconLink } from "../../../base";
import { showRemoveSequence } from "../../../otus/actions";
import { getActiveIsolateId, getOTUDetailId } from "../../../otus/selectors";
import { DownloadLink } from "../../../references/components/Detail/DownloadLink";
import { getCanModifyReferenceOTU } from "../../../references/selectors";

const SequenceHeaderButtons = styled.span`
    align-items: center;
    display: flex;
    margin-left: auto;
    padding-left: 20px;

    button {
        margin-left: 2px;
    }

    i.fas {
        font-size: ${props => props.theme.fontSize.lg};
        margin-right: 5px;
    }

    > :last-child {
        margin-left: 20px;
    }
`;

export const SequenceButtons = ({ canModify, id, isolateId, otuId, onCollapse, onRemoveSequence }) => {
    const removeSequence = useCallback(() => onRemoveSequence(id), [id]);

    const href = `/api/otus/${otuId}/isolates/${isolateId}/sequences/${id}.fa`;

    return (
        <SequenceHeaderButtons>
            {canModify && (
                <IconLink name="pencil-alt" color="orange" tip="Edit Sequence" to={{ state: { editSequence: id } }} />
            )}
            {canModify && <Icon name="trash" color="red" tip="Remove Sequence" onClick={removeSequence} />}
            <DownloadLink href={href}>FASTA</DownloadLink>
            <CloseButton onClick={onCollapse} />
        </SequenceHeaderButtons>
    );
};

export const mapStateToProps = state => ({
    canModify: getCanModifyReferenceOTU(state),
    isolateId: getActiveIsolateId(state),
    otuId: getOTUDetailId(state),
});

export const mapDispatchToProps = dispatch => ({
    onRemoveSequence: id => dispatch(showRemoveSequence(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SequenceButtons);
