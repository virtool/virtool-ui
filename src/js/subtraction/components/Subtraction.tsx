import { Container, ContainerNarrow } from "@base";
import React from "react";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom-v5-compat";
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
                <Routes>
                    <Route path="/subtractions" component={SubtractionList} exact />
                    <Route path="/subtractions/files" component={SubtractionFileManager} />
                    <Route path="/subtractions/:subtractionId" component={SubtractionDetail} />
                </Routes>
            </ContainerNarrow>
        </Container>
    );
}
