import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useFetchSettings } from "../../administration/querys";
import { Container, LoadingPlaceholder } from "../../base";
import { CreateReference } from "./Create";
import ReferenceDetail from "./Detail/Detail";
import ReferenceList from "./List";
import { ReferenceSettings } from "./ReferenceSettings";

export function References() {
    const { isLoading } = useFetchSettings();

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    return (
        <Container>
            <Switch>
                <Route path="/refs" component={ReferenceList} exact />
                <Redirect from="/refs/settings/*" to="/refs/settings" />
                <Route path="/refs/settings" component={ReferenceSettings} />
                <Route path="/refs/add" component={CreateReference} />
                <Route path="/refs/:refId" component={ReferenceDetail} />
            </Switch>
        </Container>
    );
}

export default References;
