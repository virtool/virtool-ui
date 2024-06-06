import { Container } from "@base";
import React from "react";
import { Route, Switch } from "react-router-dom";
import JobDetail from "./JobDetail";
import JobsList from "./JobList";

export default function Jobs() {
    return (
        <Container>
            <Switch>
                <Route path="/jobs" component={JobsList} exact />
                <Route path="/jobs/:jobId" component={JobDetail} />
            </Switch>
        </Container>
    );
}
