import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { mapSettingsStateToProps } from "../../administration/mappers";
import { Container, LoadingPlaceholder, ContainerNarrow, ViewHeader, ViewHeaderTitle } from "../../base";
import SourceTypes from "./SourceTypes/SourceTypes";
import ReferenceList from "./List";
import ReferenceDetail from "./Detail/Detail";
import AddReference from "./Add";

export const ReferenceSettings = () => (
    <ContainerNarrow>
        <ViewHeader title="Reference Settings">
            <ViewHeaderTitle>Settings</ViewHeaderTitle>
        </ViewHeader>
        <SourceTypes global />
    </ContainerNarrow>
);

export const References = ({ loading }) => {
    if (loading) {
        return <LoadingPlaceholder />;
    }

    return (
        <Container>
            <Switch>
                <Route path="/refs" component={ReferenceList} exact />
                <Redirect from="/refs/settings/*" to="/refs/settings" />
                <Route path="/refs/settings" component={ReferenceSettings} />
                <Route path="/refs/add" component={AddReference} />
                <Route path="/refs/:refId" component={ReferenceDetail} />
            </Switch>
        </Container>
    );
};

export default connect(mapSettingsStateToProps)(References);
