import React from "react";
import { Route, Switch } from "react-router-dom";
import { Container, ContainerNarrow } from "../../base";
import SubtractionCreate from "./Create";
import SubtractionDetail from "./Detail/Detail";
import { SubtractionFileManager } from "./FileManager";
import SubtractionList from "./List";

const Subtraction = () => (
    <Container>
        <ContainerNarrow>
            <Switch>
                <Route path="/subtractions" component={SubtractionList} exact />
                <Route path="/subtractions/files" component={SubtractionFileManager} />
                <Route path="/subtractions/create" component={SubtractionCreate} />
                <Route path="/subtractions/:subtractionId" component={SubtractionDetail} />
            </Switch>
        </ContainerNarrow>
    </Container>
);

export default Subtraction;
