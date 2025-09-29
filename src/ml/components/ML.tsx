import Container from "@base/Container";
import { Route, Switch } from "wouter";
import { MLModels } from "./MLModels";

/**
 * The root ML view defining available ML views
 *
 * @returns The ML view
 * */
export default function ML() {
    return (
        <Container>
            <Switch>
                <Route path="/ml" component={MLModels} />
            </Switch>
        </Container>
    );
}
