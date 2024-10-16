import { CloseButton } from "@base";
import { IconButton } from "@base/IconButton";
import { useGetActiveIsolateId } from "@otus/hooks";
import { useCurrentOTUContext } from "@otus/queries";
import { DownloadLink } from "@references/components/Detail/DownloadLink";
import { ReferenceRight, useCheckReferenceRight } from "@references/hooks";
import { useUrlSearchParam } from "@utils/hooks";
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

/**
 * Displays icons for the sequence item to close, edit, or remove
 */
export default function SequenceButtons({ id, onCollapse }) {
    const [, setOpenEditSequence] = useUrlSearchParam("openEditSequence");
    const [, setOpenRemoveSequence] = useUrlSearchParam("removeSequence");
    const { otu, reference } = useCurrentOTUContext();
    const { hasPermission: canModify } = useCheckReferenceRight(reference.id, ReferenceRight.modify_otu);
    const isolateId = useGetActiveIsolateId(otu);

    const href = `/api/otus/${otu.id}/isolates/${isolateId}/sequences/${id}.fa`;

    return (
        <SequenceHeaderButtons>
            {canModify && (
                <IconButton name="pen" color="grayDark" tip="edit sequence" onClick={() => setOpenEditSequence(id)} />
            )}
            {canModify && (
                <IconButton name="trash" color="red" tip="remove sequence" onClick={() => setOpenRemoveSequence(id)} />
            )}
            <DownloadLink href={href}>FASTA</DownloadLink>
            <CloseButton onClick={onCollapse} />
        </SequenceHeaderButtons>
    );
}
