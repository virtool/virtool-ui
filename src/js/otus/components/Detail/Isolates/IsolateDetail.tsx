import IsolateSequences from "@sequences/components/IsolateSequences";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Box, Icon, Label } from "../../../../base";
import { DownloadLink } from "../../../../references/components/Detail/DownloadLink";
import { ReferenceDataType } from "../../../../references/types";
import { formatIsolateName } from "../../../../utils/utils";
import { useSetIsolateAsDefault } from "../../../queries";
import { OTUIsolate } from "../../../types";
import EditIsolate from "./EditIsolate";
import RemoveIsolate from "./RemoveIsolate";

const IsolateDetailHeader = styled(Box)`
    align-items: center;
    display: flex;
    font-size: ${props => props.theme.fontSize.lg};
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
    activeIsolate: OTUIsolate;
    allowedSourceTypes: string[];
    /** Whether the user has permission to modify the Isolate */
    canModify: boolean;
    dataType: ReferenceDataType;
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
    dataType,
    otuId,
    restrictSourceTypes,
}: IsolateDetailProps) {
    const history = useHistory();
    const location = useLocation<{ editIsolate: boolean; removeIsolate: boolean }>();
    const mutation = useSetIsolateAsDefault();

    const defaultIsolateLabel = activeIsolate.default && dataType !== "barcode" && (
        <Label color="green">
            <Icon name="star" /> Default Isolate
        </Label>
    );

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
                show={location.state?.editIsolate}
                onHide={() => history.replace({ state: { editIsolate: false } })}
            />

            <RemoveIsolate
                id={activeIsolate.id}
                name={formatIsolateName(activeIsolate)}
                onHide={() => history.replace({ state: { removeIsolate: false } })}
                otuId={otuId}
                show={location.state?.removeIsolate}
            />

            <IsolateDetailHeader>
                <div>{formatIsolateName(activeIsolate)}</div>
                <div>
                    {defaultIsolateLabel}
                    {canModify && (
                        <>
                            <Icon
                                name="pencil-alt"
                                color="orange"
                                tip="Edit Isolate"
                                tipPlacement="left"
                                onClick={() => history.push({ state: { editIsolate: true } })}
                            />
                            {!activeIsolate.default && dataType !== "barcode" && (
                                <Icon
                                    name="star"
                                    color="green"
                                    tip="Set as Default"
                                    tipPlacement="left"
                                    onClick={() => mutation.mutate({ otuId, isolateId: activeIsolate.id })}
                                />
                            )}
                            <Icon
                                name="trash"
                                color="red"
                                tip="Remove Isolate"
                                tipPlacement="left"
                                onClick={() => history.push({ state: { removeIsolate: true } })}
                            />
                        </>
                    )}
                    <DownloadLink href={`/api/otus/${otuId}/isolates/${activeIsolate.id}.fa`}>FASTA</DownloadLink>
                </div>
            </IsolateDetailHeader>

            <IsolateSequences otuId={otuId} activeIsolate={activeIsolate} />
        </StyledIsolateDetail>
    );
}
