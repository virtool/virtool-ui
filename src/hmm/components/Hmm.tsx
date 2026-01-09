import Container from "@base/Container";
import ContainerNarrow from "@base/ContainerNarrow";
import { Route, Switch } from "wouter";
import HmmDetail from "./HmmDetail";
import HmmList from "./HmmList";

/**
 * The hmm view
 */
export default function HMM() {
    return (
        <Container>
            <ContainerNarrow>
                <Switch>
                    <Route path="/hmm/:hmmId" component={HmmDetail} />
                    <Route path="/hmm/" component={HmmList} />
                </Switch>
            </ContainerNarrow>
        </Container>
    );
}
