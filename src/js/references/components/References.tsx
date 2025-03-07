import { useFetchSettings } from "@administration/queries";
import { LoadingPlaceholder } from "@base";
import Container from "@base/Container";
import React from "react";
import { Redirect, Route, Switch } from "wouter";
import ReferenceDetail from "./Detail/ReferenceDetail";
import ReferenceList from "./ReferenceList";
import ReferenceSettings from "./ReferenceSettings";

/**
 * The references view with routes to reference-related components
 */
export default function References() {
    const { isPending } = useFetchSettings();

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    return (
        <Container>
            <Switch>
                <Route
                    path="/refs/settings/*"
                    component={() => <Redirect to="/settings" replace />}
                />
                <Route path="/refs/settings" component={ReferenceSettings} />
                <Route path="/refs/:refId/*?" component={ReferenceDetail} />
                <Route path="/refs/" component={ReferenceList} />
            </Switch>
        </Container>
    );
}
