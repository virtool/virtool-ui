import { useDialogParam, useNaiveUrlSearchParam } from "@/hooks";
import { getFontSize, getFontWeight } from "@app/theme";
import NoneFoundBox from '@base/NoneFoundBox';
import SubviewHeader from '@base/SubviewHeader';
import SubviewHeaderTitle from '@base/SubviewHeaderTitle';
import ScrollArea from '@base/ScrollArea';
import ViewHeaderTitleBadge from '@base/ViewHeaderTitleBadge';
import { useCurrentOtuContext } from "@otus/queries";
import { ReferenceRight, useCheckReferenceRight } from "@references/hooks";
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

const AddIsolateLink = styled.a`
    margin-left: auto;
    cursor: pointer;
`;

/**
 * Displays a component for managing the isolates
 */
export default function IsolateEditor() {
    const { otu, reference } = useCurrentOtuContext();
    const { isolates } = otu;
    const { value: activeIsolateId } = useNaiveUrlSearchParam(
        "activeIsolate",
        isolates[0]?.id,
    );
    const { setOpen: setOpenAddIsolate } = useDialogParam("openAddIsolate");
    const { restrict_source_types, source_types } = reference;

    const { hasPermission: canModify } = useCheckReferenceRight(
        reference.id,
        ReferenceRight.modify,
    );

    const activeIsolate = isolates.length
        ? find(isolates, { id: activeIsolateId || isolates[0]?.id })
        : null;

    const isolateComponents = map(isolates, (isolate, index) => (
        <IsolateItem
            key={index}
            isolate={isolate}
            active={isolate.id === activeIsolate.id}
        />
    ));

    const addIsolateLink = canModify ? (
        <AddIsolateLink onClick={() => setOpenAddIsolate(true)}>
            Add Isolate
        </AddIsolateLink>
    ) : null;

    const body = isolateComponents.length ? (
        <IsolateEditorContainer>
            <ScrollArea>{isolateComponents}</ScrollArea>
            <IsolateDetail
                canModify={canModify}
                otuId={otu.id}
                activeIsolate={activeIsolate}
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
                    Isolates{" "}
                    <ViewHeaderTitleBadge>
                        {isolateComponents.length}
                    </ViewHeaderTitleBadge>
                    {addIsolateLink}
                </IsolateEditorTitle>
            </SubviewHeader>
            {body}
        </>
    );
}
