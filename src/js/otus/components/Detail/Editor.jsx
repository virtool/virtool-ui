import { map } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../../app/theme";
import { Badge, Box, BoxGroup, NoneFoundBox, SubviewHeader, SubviewHeaderTitle } from "../../../base";
import { ReferenceRight, useCheckReferenceRight } from "../../../references/hooks";
import { getCanModifyReferenceOTU } from "../../../references/selectors";
import { selectIsolate } from "../../actions";
import IsolateDetail from "./Isolates/IsolateDetail";
import IsolateItem from "./Isolates/IsolateItem";

const IsolateEditorContainer = styled.div`
    display: flex;
`;

const IsolateEditorTitle = styled(SubviewHeaderTitle)`
    align-items: center;
    display: flex;

    strong {
        padding-right: 5px;
    }

    a {
        align-self: flex-end;
        font-size: ${getFontSize("md")};
        font-weight: ${getFontWeight("thick")};
        margin-left: auto;
    }

    ${Badge} {
        font-size: ${getFontSize("md")};
        margin-left: 5px;
    }
`;

const IsolateEditorListContainer = styled(Box)`
    flex: 0 0 auto;
    height: 420px;
    margin: 0 15px 0 0;
    padding: 0;
    overflow-y: scroll;
    width: 240px;
`;

const IsolateEditorList = styled(BoxGroup)`
    border: none;
    box-shadow: ${props => props.theme.boxShadow.inset};
    width: 100%;
`;

function IsolateEditor({
    refId,
    isolates,
    activeIsolateId,
    onSelectIsolate,
    otuId,
    activeIsolate,
    dataType,
    allowedSourceTypes,
    restrictSourceTypes,
}) {
    const { hasPermission: canModify } = useCheckReferenceRight(refId, ReferenceRight.modify);

    const isolateComponents = map(isolates, (isolate, index) => (
        <IsolateItem
            key={index}
            isolate={isolate}
            active={isolate.id === activeIsolateId}
            dataType={dataType}
            onClick={onSelectIsolate}
        />
    ));

    const addIsolateLink = canModify ? <Link to={{ state: { addIsolate: true } }}>Add Isolate</Link> : null;

    const body = isolateComponents.length ? (
        <IsolateEditorContainer>
            <IsolateEditorListContainer>
                <IsolateEditorList>{isolateComponents}</IsolateEditorList>
            </IsolateEditorListContainer>
            <IsolateDetail
                canModify={canModify}
                otuId={otuId}
                activeIsolate={activeIsolate}
                dataType={dataType}
                allowedSourceTypes={allowedSourceTypes}
                restrictSourceTypes={restrictSourceTypes}
                isolates={isolates}
            />
        </IsolateEditorContainer>
    ) : (
        <NoneFoundBox noun="isolates" />
    );

    return (
        <>
            <SubviewHeader>
                <IsolateEditorTitle>
                    Isolates <Badge>{isolateComponents.length}</Badge>
                    {addIsolateLink}
                </IsolateEditorTitle>
            </SubviewHeader>
            {body}
        </>
    );
}

const mapStateToProps = state => ({
    isolates: state.otus.detail.isolates,
    activeIsolateId: state.otus.activeIsolateId,
    activeIsolate: state.otus.activeIsolate,
    activeSequenceId: state.otus.activeSequenceId,
    allowedSourceTypes: state.settings.data.allowed_source_types,
    restrictSourceTypes: state.settings.data.restrict_source_types,
    isRemote: state.references.detail.remotes_from,
    canModify: getCanModifyReferenceOTU(state),
    dataType: state.references.detail.data_type,
});

const mapDispatchToProps = dispatch => ({
    onSelectIsolate: isolateId => {
        dispatch(selectIsolate(isolateId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(IsolateEditor);
