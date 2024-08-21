import { useFetchSettings } from "@administration/queries";
import { Container, LoadingPlaceholder } from "@base";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import ReferenceDetail from "./Detail/ReferenceDetail";
import ReferenceList from "./ReferenceList";
import { ReferenceSettings } from "./ReferenceSettings";

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
                <Route path="/refs" component={ReferenceList} exact />
                <Redirect to="/refs/settings" />
                <Route path="/refs/settings" component={ReferenceSettings} />
                <Route path="/refs/:refId" component={ReferenceDetail} />
            </Switch>
        </Container>
    );
}
