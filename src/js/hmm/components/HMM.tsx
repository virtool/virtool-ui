import React from "react";
import { Route, Switch } from "react-router-dom";
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
                <Switch>
                    <Route path="/hmm" component={HMMList} exact />
                    <Route path="/hmm/:hmmId" component={HMMDetail} />
                </Switch>
            </ContainerNarrow>
        </Container>
    );
}
