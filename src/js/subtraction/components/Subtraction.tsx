import { Container, ContainerNarrow } from "@base";
import React from "react";
import { Switch } from "react-router-dom";
import { CompatRoute } from "react-router-dom-v5-compat";
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
                    <CompatRoute path="/subtractions" component={SubtractionList} exact />
                    <CompatRoute path="/subtractions/files" component={SubtractionFileManager} />
                    <CompatRoute path="/subtractions/:subtractionId" component={SubtractionDetail} />
                </Switch>
            </ContainerNarrow>
        </Container>
    );
}
