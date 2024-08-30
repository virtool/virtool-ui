import { Container, ContainerNarrow } from "@base";
import React from "react";
import { Route, Routes } from "react-router-dom-v5-compat";
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
                    <Route path="/" element={<SubtractionList />} />
                    <Route path="/files" element={<SubtractionFileManager />} />
                    <Route path="/:subtractionId" element={<SubtractionDetail />} />
                </Routes>
            </ContainerNarrow>
        </Container>
    );
}
