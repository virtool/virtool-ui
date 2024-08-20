import React from "react";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom-v5-compat";
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
                    <Route path="/hmm" component={HMMList} exact />
                    <Route path="/hmm/:hmmId" component={HMMDetail} />
                </Routes>
            </ContainerNarrow>
        </Container>
    );
}
