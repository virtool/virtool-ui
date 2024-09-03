import React from "react";
import { Route, Routes } from "react-router-dom-v5-compat";
import { Container } from "../../base";
import { MLModels } from "./MLModels";

/**
 * The root ML view defining available ML views
 *
 * @returns The ML view
 * */
export default function ML() {
    return (
        <Container>
            <Routes>
                <Route path="/" element={<MLModels />} />
            </Routes>
        </Container>
    );
}
