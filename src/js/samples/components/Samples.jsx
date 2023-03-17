import React from "react";
import { Route, Switch } from "react-router-dom";
import { Container, ContainerNarrow } from "../../base";

import FileManager from "../../files/components/Manager";
import { Labels } from "../../labels/components/Labels";
import CreateSample from "./Create/Create";
import SampleDetail from "./Detail/Detail";
import SamplesList from "./List";
import SamplesSettings from "./Settings";

export const SampleFileManager = () => (
    <ContainerNarrow>
        <FileManager fileType="reads" />
    </ContainerNarrow>
);

export const Samples = () => (
    <Container>
        <Switch>
            <Route path="/samples/settings" component={SamplesSettings} />
            <Route path="/samples/files" component={SampleFileManager} />
            <Route path="/samples/labels" component={Labels} />
            <Route path="/samples/create" component={CreateSample} />
            <Route path="/samples/:sampleId" component={SampleDetail} />
            <Route path="/samples" component={SamplesList} />
        </Switch>
    </Container>
);

export default Samples;
