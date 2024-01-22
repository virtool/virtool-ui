import React from "react";
import { useLocation } from "react-router-dom";
import { ContainerNarrow, Tabs, TabsLink, ViewHeader, ViewHeaderTitle } from "../../base";
import EmptyReference from "./EmptyReference";
import { ImportReference } from "./ImportReference";

type LocationState = {
    emptyReference: boolean;
    importReference: boolean;
};

/**
 * The create reference view with options to create an empty reference or import a reference
 */
export function CreateReference() {
    const location = useLocation<LocationState>();

    return (
        <ContainerNarrow>
            <ViewHeader title="Create Reference">
                <ViewHeaderTitle>Create Reference</ViewHeaderTitle>
            </ViewHeader>
            <Tabs>
                <TabsLink to={{ state: { emptyReference: true } }} isActive={() => location.state.emptyReference}>
                    Empty
                </TabsLink>
                <TabsLink to={{ state: { importReference: true } }} isActive={() => location.state.importReference}>
                    Import
                </TabsLink>
            </Tabs>

            {location.state.importReference ? <ImportReference /> : <EmptyReference />}
        </ContainerNarrow>
    );
}
