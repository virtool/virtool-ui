import { getColor } from "@app/theme";
import { Icon } from "@base";
import { useCurrentOTUContext } from "@otus/queries";
import { ReferenceRight, useCheckReferenceRight } from "@references/hooks";
import { ReferenceDataType } from "@references/types";
import { useGetUnreferencedTargets } from "@sequences/hooks";
import { useLocationState } from "@utils/hooks";
import { merge } from "lodash";
import React from "react";
import styled from "styled-components";

const AddSequenceLinkMessage = styled.span`
    color: ${getColor};
    margin-left: auto;
`;

const StyledAddSequenceLink = styled.a`
    margin-left: auto;
    cursor: pointer;
`;

type AddSequenceLinkProps = {
    dataType: ReferenceDataType;
    refId: string;
};

/**
 * Displays a link to add a sequence
 */
export default function AddSequenceLink({ dataType, refId }: AddSequenceLinkProps) {
    const [locationState, setLocationState] = useLocationState();
    const { reference } = useCurrentOTUContext();
    const { hasPermission: canModify } = useCheckReferenceRight(refId, ReferenceRight.modify_otu);
    const unreferencedTargets = useGetUnreferencedTargets();
    const hasUnreferencedTargets = Boolean(unreferencedTargets?.length);
    const hasTargets = Boolean(reference.targets?.length);

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

        return (
            <StyledAddSequenceLink onClick={() => setLocationState(merge(locationState, { addSequence: true }))}>
                Add Sequence
            </StyledAddSequenceLink>
        );
    }

    return null;
}
