import { Container, ContainerNarrow } from "@base";
import React from "react";
import { Route, Switch } from "wouter";
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
                    <Route path="/files/" component={SubtractionFileManager} nest />
                    <Route path="/:subtractionId" component={SubtractionDetail} nest />
                    <Route path="/" component={SubtractionList} nest />
                </Switch>
            </ContainerNarrow>
        </Container>
    );
}
