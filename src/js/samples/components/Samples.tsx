import { Container, ContainerNarrow } from "@base";
import { FileManager } from "@files/components/FileManager";
import { FileType } from "@files/types";
import { Labels } from "@labels/components/Labels";
import React from "react";
import { Route, Switch } from "react-router-dom";
import CreateSample from "./Create/CreateSample";
import SampleDetail from "./Detail/SampleDetail";
import SamplesSettings from "./SampleSettings";
import SamplesList from "./SamplesList";

/**
 * Displays the file manager for samples allowing users to upload/delete files
 */
function SampleFileManager() {
    return (
        <ContainerNarrow>
            <FileManager fileType={FileType.reads} message="" />
        </ContainerNarrow>
    );
}

/**
 * The samples view with routes to sample-related components
 */
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
