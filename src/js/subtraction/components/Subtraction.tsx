import { Container, ContainerNarrow } from "@base";
import React from "react";
import { Route, Switch } from "react-router-dom";
import SubtractionDetail from "./Detail/SubtractionDetail";
import { SubtractionFileManager } from "./SubtractionFileManager";
import SubtractionList from "./SubtractionList";

/**
 * The subtraction view
 */
export default function Subtraction() {
    return (
        <Container>
            <ContainerNarrow>
                <Switch>
                    <Route path="/subtractions" component={SubtractionList} exact />
                    <Route path="/subtractions/files" component={SubtractionFileManager} />
                    <Route path="/subtractions/:subtractionId" component={SubtractionDetail} />
                </Switch>
            </ContainerNarrow>
        </Container>
    );
}
