import { Container } from "@base";
import React from "react";
import { Route, Switch } from "wouter";
import JobDetail from "./JobDetail";
import JobsList from "./JobList";

/**
 * The jobs view with routes to job-related components
 */
export default function Jobs() {
    return (
        <Container>
            <Switch>
                <Route path="/:jobId" component={JobDetail} nest />
                <Route path="/" component={JobsList} nest />
            </Switch>
        </Container>
    );
}
