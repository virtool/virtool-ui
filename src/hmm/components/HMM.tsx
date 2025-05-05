import React from "react";
import { Route, Switch } from "wouter";
import Container from "../../base/Container";
import ContainerNarrow from "../../base/ContainerNarrow";
import HmmDetail from "./HmmDetail";
import HMMList from "./HMMList";

/**
 * The hmm view
 */
export default function HMM() {
    return (
        <Container>
            <ContainerNarrow>
                <Switch>
                    <Route path="/hmm/:hmmId" component={HmmDetail} />
                    <Route path="/hmm/" component={HMMList} />
                </Switch>
            </ContainerNarrow>
        </Container>
    );
}
