import { Container, ContainerNarrow } from "@base/index";
import React from "react";
import { Route, Switch } from "wouter";
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
                    <Route path="/hmm/:hmmId" component={HMMDetail} />
                    <Route path="/hmm/" component={HMMList} />
                </Switch>
            </ContainerNarrow>
        </Container>
    );
}
