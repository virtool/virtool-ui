import React from "react";
import { useLocation } from "react-router-dom";
import { ContainerNarrow, Tabs, TabsLink, ViewHeader, ViewHeaderTitle } from "../../base";
import EmptyReference from "./Empty";
import { ImportReference } from "./ImportReference";

export function CreateReference() {
    const location = useLocation();

    return (
        <ContainerNarrow>
            <ViewHeader title="Create Reference">
                <ViewHeaderTitle>Create Reference</ViewHeaderTitle>
            </ViewHeader>
            <Tabs>
                <TabsLink
                    to={{ state: { emptyReference: true } }}
                    isActive={(_, location) => location.state.emptyReference}
                >
                    Empty
                </TabsLink>
                <TabsLink
                    to={{ state: { importReference: true } }}
                    isActive={(_, location) => location.state.importReference}
                >
                    Import
                </TabsLink>
            </Tabs>

            {location.state.importReference ? <ImportReference /> : <EmptyReference />}
        </ContainerNarrow>
    );
}
