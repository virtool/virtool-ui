import React from "react";
import { Route, Switch } from "react-router-dom";
import { Container, ContainerNarrow } from "../../base";

import HMMList from "./List";
import HMMDetail from "./Detail";

const HMM = () => (
    <Container>
        <ContainerNarrow>
            <Switch>
                <Route path="/hmm" component={HMMList} exact />
                <Route path="/hmm/:hmmId" component={HMMDetail} />
            </Switch>
        </ContainerNarrow>
    </Container>
);

export default HMM;
