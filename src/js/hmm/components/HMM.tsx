import React from "react";
import { Route, Routes } from "react-router-dom-v5-compat";
import { Container, ContainerNarrow } from "../../base";
import HMMDetail from "./HMMDetail";
import HMMList from "./HMMList";

/**
 * The hmm view
 */
export default function HMM() {
    return (
        <Container>
            <ContainerNarrow>
                <Routes>
                    <Route path="" element={<HMMList />} />
                    <Route path=":hmmId" element={<HMMDetail />} />
                </Routes>
            </ContainerNarrow>
        </Container>
    );
}
