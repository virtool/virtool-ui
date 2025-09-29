import Container from "@base/Container";
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
                <Route path="/jobs/:jobId" component={JobDetail} />
                <Route path="/jobs" component={JobsList} />
            </Switch>
        </Container>
    );
}
