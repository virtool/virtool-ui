import React from "react";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Box, Icon, Label } from "../../../../base";
import { DownloadLink } from "../../../../references/components/Detail/DownloadLink";
import { getCanModifyReferenceOTU, getReferenceDetailId } from "../../../../references/selectors";
import IsolateSequences from "../../../../sequences/components/Sequences";
import { setIsolateAsDefault, showRemoveIsolate } from "../../../actions";
import EditIsolate from "./EditIsolate";
import RemoveIsolate from "./Remove";

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

export function Detail(props) {
    const history = useHistory();
    const location = useLocation();

    const handleSetDefaultIsolate = () => {
        props.setIsolateAsDefault(props.otuId, props.activeIsolate.id);
    };

    const isolate = props.activeIsolate;

    const defaultIsolateLabel = isolate.default && props.dataType !== "barcode" && (
        <Label color="green">
            <Icon name="star" /> Default Isolate
        </Label>
    );

    let modifyIcons;

    if (props.canModify) {
        modifyIcons = (
            <>
                <Icon
                    name="pencil-alt"
                    color="orange"
                    tip="Edit Isolate"
                    tipPlacement="left"
                    onClick={() => history.push({ state: { editIsolate: true } })}
                />
                {!isolate.default && props.dataType !== "barcode" && (
                    <Icon
                        name="star"
                        color="green"
                        tip="Set as Default"
                        tipPlacement="left"
                        onClick={handleSetDefaultIsolate}
                    />
                )}
                <Icon
                    name="trash"
                    color="red"
                    tip="Remove Isolate"
                    tipPlacement="left"
                    onClick={props.showRemoveIsolate}
                />
            </>
        );
    }

    return (
        <StyledIsolateDetail>
            <EditIsolate
                key={isolate.id}
                otuId={props.otuId}
                isolateId={isolate.id}
                sourceType={isolate.source_type}
                sourceName={isolate.source_name}
                allowedSourceTypes={props.allowedSourceTypes}
                restrictSourceTypes={props.restrictSourceTypes}
                show={location.state?.editIsolate}
                onHide={() => history.replace({ state: { editIsolate: false } })}
            />

            <RemoveIsolate />

            <IsolateDetailHeader>
                <div>{isolate.name}</div>
                <div>
                    {defaultIsolateLabel}
                    {modifyIcons}
                    <DownloadLink href={`/api/otus/${props.otuId}/isolates/${props.activeIsolate.id}.fa`}>
                        FASTA
                    </DownloadLink>
                </div>
            </IsolateDetailHeader>

            <IsolateSequences canModify={props.canModify} />
        </StyledIsolateDetail>
    );
}

const mapStateToProps = state => ({
    isolates: state.otus.detail.isolates,
    otuId: state.otus.detail.id,
    refId: getReferenceDetailId(state),
    activeIsolate: state.otus.activeIsolate,
    activeIsolateId: state.otus.activeIsolateId,
    activeSequenceId: state.otus.activeSequenceId,
    editing: state.otus.editingIsolate,
    allowedSourceTypes: state.settings.data.allowed_source_types,
    restrictSourceTypes: state.settings.data.restrict_source_types,
    canModify: getCanModifyReferenceOTU(state),
    dataType: state.references.detail.data_type,
});

const mapDispatchToProps = dispatch => ({
    setIsolateAsDefault: (otuId, isolateId) => {
        dispatch(setIsolateAsDefault(otuId, isolateId));
    },

    showRemoveIsolate: () => {
        dispatch(showRemoveIsolate());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
