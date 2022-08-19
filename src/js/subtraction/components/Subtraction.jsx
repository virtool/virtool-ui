import React from "react";
import { Route, Switch } from "react-router-dom";
import { Container, NarrowContainer } from "../../base";
import { SubtractionFileManager } from "./FileManager";
import SubtractionCreate from "./Create";
import SubtractionDetail from "./Detail/Detail";
import SubtractionList from "./List";

const Subtraction = () => (
    <Container>
        <NarrowContainer>
            <Switch>
                <Route path="/subtractions" component={SubtractionList} exact />
                <Route path="/subtractions/files" component={SubtractionFileManager} />
                <Route path="/subtractions/create" component={SubtractionCreate} />
                <Route path="/subtractions/:subtractionId" component={SubtractionDetail} />
            </Switch>
        </NarrowContainer>
    </Container>
);

export default Subtraction;
