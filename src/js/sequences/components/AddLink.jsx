import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getColor } from "../../app/theme";
import { Icon } from "../../base";
import { getTargets } from "../../otus/selectors";
import { getCanModifyReferenceOTU, getDataType } from "../../references/selectors";
import { getUnreferencedTargets } from "../selectors";

const AddSequenceLinkMessage = styled.span`
    color: ${getColor};
    margin-left: auto;
`;

const StyledAddSequenceLink = styled(Link)`
    margin-left: auto;
`;

export const AddSequenceLink = ({ canModify, dataType, hasUnreferencedTargets, hasTargets }) => {
    if (canModify) {
        if (dataType === "barcode") {
            if (!hasTargets) return null;

            if (!hasUnreferencedTargets) {
                return (
                    <AddSequenceLinkMessage color="green">
                        <Icon name="check-double" /> All targets defined
                    </AddSequenceLinkMessage>
                );
            }
        }

        return <StyledAddSequenceLink to={{ state: { addSequence: true } }}>Add Sequence</StyledAddSequenceLink>;
    }

    return null;
};

export const mapStateToProps = state => ({
    canModify: getCanModifyReferenceOTU(state),
    dataType: getDataType(state),
    hasUnreferencedTargets: Boolean(getUnreferencedTargets(state)?.length),
    hasTargets: Boolean(getTargets(state)?.length)
});

export default connect(mapStateToProps)(AddSequenceLink);
