import React from "react";
import { Route, Switch } from "wouter";
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
                    <Route path="/:hmmId" component={HMMDetail} nest />
                    <Route path="/" component={HMMList} nest />
                </Switch>
            </ContainerNarrow>
        </Container>
    );
}
