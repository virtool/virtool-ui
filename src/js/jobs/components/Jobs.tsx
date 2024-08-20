import { Container } from "@base";
import React from "react";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom-v5-compat";
import JobDetail from "./JobDetail";
import JobsList from "./JobList";

/**
 * The jobs view with routes to job-related components
 */
export default function Jobs() {
    return (
        <Container>
            <Routes>
                <Route path="/jobs" component={JobsList} exact />
                <Route path="/jobs/:jobId" component={JobDetail} />
            </Routes>
        </Container>
    );
}
