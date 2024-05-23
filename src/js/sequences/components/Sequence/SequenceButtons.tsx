import { CloseButton, IconLink } from "@base";
import { useGetActiveIsolateId } from "@otus/hooks";
import { useCurrentOTUContext } from "@otus/queries";
import { DownloadLink } from "@references/components/Detail/DownloadLink";
import { ReferenceRight, useCheckReferenceRight } from "@references/hooks";
import React from "react";
import styled from "styled-components";

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

    > &:last-child {
        margin-left: 20px;
    }
`;

const StyledButton = styled(IconLink)`
    padding: 0 5px;
`;

/**
 * Displays icons for the sequence item to close, edit, or remove
 */
export default function SequenceButtons({ id, onCollapse }) {
    const { otu, reference } = useCurrentOTUContext();
    const { hasPermission: canModify } = useCheckReferenceRight(reference.id, ReferenceRight.modify_otu);
    const isolateId = useGetActiveIsolateId(otu);

    const href = `/api/otus/${otu.id}/isolates/${isolateId}/sequences/${id}.fa`;

    return (
        <SequenceHeaderButtons>
            {canModify && (
                <IconLink name="pencil-alt" color="orange" tip="Edit Sequence" to={{ state: { editSequence: id } }} />
            )}
            {canModify && (
                <StyledButton name="trash" color="red" tip="Remove Sequence" to={{ state: { removeSequence: id } }} />
            )}
            <DownloadLink href={href}>FASTA</DownloadLink>
            <CloseButton onClick={onCollapse} />
        </SequenceHeaderButtons>
    );
}
