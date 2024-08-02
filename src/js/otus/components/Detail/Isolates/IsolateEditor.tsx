import { Box, BoxGroup, NoneFoundBox, SubviewHeader, SubviewHeaderTitle } from "@/base";
import { getFontSize, getFontWeight } from "@app/theme";
import { ViewHeaderTitleBadge } from "@base/ViewHeaderTitleBadge";
import { useCurrentOTUContext } from "@otus/queries";
import { ReferenceRight, useCheckReferenceRight } from "@references/hooks";
import { useLocationState } from "@utils/hooks";
import { merge } from "lodash";
import { find, map } from "lodash-es";
import React from "react";
import styled from "styled-components";
import IsolateDetail from "./IsolateDetail";
import IsolateItem from "./IsolateItem";

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

const AddIsolateLink = styled.a`
    margin-left: auto;
    cursor: pointer;
`;

/**
 * Displays a component for managing the isolates
 */
export default function IsolateEditor() {
    const [locationState, setLocationState] = useLocationState();
    const { otu, reference } = useCurrentOTUContext();
    const { isolates } = otu;
    const { data_type, restrict_source_types, source_types } = reference;

    const { hasPermission: canModify } = useCheckReferenceRight(reference.id, ReferenceRight.modify);

    const activeIsolateId = locationState?.activeIsolateId || otu.isolates[0]?.id;
    const activeIsolate = isolates.length ? find(isolates, { id: activeIsolateId }) : null;

    const isolateComponents = map(isolates, (isolate, index) => (
        <IsolateItem key={index} isolate={isolate} active={isolate.id === activeIsolate.id} dataType={data_type} />
    ));

    const addIsolateLink = canModify ? (
        <AddIsolateLink onClick={() => setLocationState(merge(locationState, { addIsolate: true }))}>
            Add Isolate
        </AddIsolateLink>
    ) : null;

    const body = isolateComponents.length ? (
        <IsolateEditorContainer>
            <IsolateEditorListContainer>
                <IsolateEditorList>{isolateComponents}</IsolateEditorList>
            </IsolateEditorListContainer>
            <IsolateDetail
                canModify={canModify}
                otuId={otu.id}
                activeIsolate={activeIsolate}
                dataType={data_type}
                allowedSourceTypes={source_types}
                restrictSourceTypes={restrict_source_types}
            />
        </IsolateEditorContainer>
    ) : (
        <NoneFoundBox noun="isolates" />
    );

    return (
        <>
            <SubviewHeader>
                <IsolateEditorTitle>
                    Isolates <ViewHeaderTitleBadge>{isolateComponents.length}</ViewHeaderTitleBadge>
                    {addIsolateLink}
                </IsolateEditorTitle>
            </SubviewHeader>
            {body}
        </>
    );
}
