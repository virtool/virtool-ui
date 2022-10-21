import React from "react";
import { Route, Switch } from "react-router-dom";
import { Container, NarrowContainer } from "../../base";

import HMMList from "./List";
import HMMDetail from "./Detail";

const HMM = () => (
    <Container>
        <NarrowContainer>
            <Switch>
                <Route path="/hmm" component={HMMList} exact />
                <Route path="/hmm/:hmmId" component={HMMDetail} />
            </Switch>
        </NarrowContainer>
    </Container>
);

export default HMM;
