import React from "react";
import { Route, Switch } from "react-router-dom";
import { Container, ContainerNarrow } from "../../base";
import { FileManager } from "../../files/components/Manager";
import { FileType } from "../../files/types";
import { Labels } from "../../labels/components/Labels";
import CreateSample from "./Create/CreateSample";
import SampleDetail from "./Detail/Detail";
import SamplesSettings from "./SampleSettings";
import SamplesList from "./SamplesList";

function SampleFileManager() {
    return (
        <ContainerNarrow>
            <FileManager fileType={FileType.reads} message="" tip="" />
        </ContainerNarrow>
    );
}

export default function Samples() {
    return (
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
}
