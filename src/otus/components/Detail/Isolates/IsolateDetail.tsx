import React from "react";
import styled from "styled-components";
import { useDialogParam } from "../../../../app/hooks";
import { formatIsolateName } from "../../../../app/utils";
import Box from "../../../../base/Box";
import Icon from "../../../../base/Icon";
import IconButton from "../../../../base/IconButton";
import Label from "../../../../base/Label";
import { DownloadLink } from "../../../../references/components/Detail/DownloadLink";
import Sequences from "../../../../sequences/components/Sequences";
import { useSetIsolateAsDefault } from "../../../queries";
import { OtuIsolate } from "../../../types";
import EditIsolate from "./EditIsolate";
import RemoveIsolate from "./RemoveIsolate";

const IsolateDetailHeader = styled(Box)`
    align-items: center;
    display: flex;
    font-size: ${(props) => props.theme.fontSize.lg};
    flex-direction: row;
    justify-content: space-between;

    div:first-child {
        font-weight: bold;
    }

    i.fas {
        padding-left: 5px;
    }

    a:last-child {
        margin-left: 5px;
    }
`;

const StyledIsolateDetail = styled.div`
    flex: 1;
    min-height: 0;
    min-width: 0;
`;

type IsolateDetailProps = {
    /** The Isolate that is currently selected */
    activeIsolate: OtuIsolate;
    allowedSourceTypes: string[];
    /** Whether the user has permission to modify the Isolate */
    canModify: boolean;
    otuId: string;
    /** Indicates whether the source types are restricted */
    restrictSourceTypes: boolean;
};

/**
 * Display and edit information for Isolates
 */
export default function IsolateDetail({
    activeIsolate,
    allowedSourceTypes,
    canModify,
    otuId,
    restrictSourceTypes,
}: IsolateDetailProps) {
    const { open: openEditIsolate, setOpen: setOpenEditIsolate } =
        useDialogParam("openEditIsolate");

    const { open: openRemoveIsolate, setOpen: setOpenRemoveIsolate } =
        useDialogParam("openRemoveIsolate");

    const mutation = useSetIsolateAsDefault();

    return (
        <StyledIsolateDetail>
            <EditIsolate
                key={activeIsolate.id}
                otuId={otuId}
                isolateId={activeIsolate.id}
                sourceType={activeIsolate.source_type}
                sourceName={activeIsolate.source_name}
                allowedSourceTypes={allowedSourceTypes}
                restrictSourceTypes={restrictSourceTypes}
                show={openEditIsolate}
                onHide={() => setOpenEditIsolate(false)}
            />

            <RemoveIsolate
                id={activeIsolate.id}
                name={formatIsolateName(activeIsolate)}
                onHide={() => setOpenRemoveIsolate(false)}
                otuId={otuId}
                show={openRemoveIsolate}
            />

            <IsolateDetailHeader>
                <div>{formatIsolateName(activeIsolate)}</div>
                <div>
                    {activeIsolate.default && (
                        <Label color="green">
                            <Icon name="star" /> Default Isolate
                        </Label>
                    )}
                    {canModify && (
                        <>
                            <IconButton
                                name="pen"
                                color="grayDark"
                                tip="edit isolate"
                                onClick={() => setOpenEditIsolate(true)}
                            />
                            {!activeIsolate.default && (
                                <IconButton
                                    name="star"
                                    color="green"
                                    tip="set as default"
                                    onClick={() =>
                                        mutation.mutate({
                                            otuId,
                                            isolateId: activeIsolate.id,
                                        })
                                    }
                                />
                            )}
                            <IconButton
                                name="trash"
                                color="red"
                                tip="remove isolate"
                                onClick={() => setOpenRemoveIsolate(true)}
                            />
                        </>
                    )}
                    <DownloadLink
                        href={`/api/otus/${otuId}/isolates/${activeIsolate.id}.fa`}
                    >
                        FASTA
                    </DownloadLink>
                </div>
            </IsolateDetailHeader>

            <Sequences otuId={otuId} activeIsolate={activeIsolate} />
        </StyledIsolateDetail>
    );
}
