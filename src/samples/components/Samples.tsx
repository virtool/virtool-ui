import Container from "@base/Container";
import { Labels } from "@labels/components/Labels";
import { Route, Switch } from "wouter";
import CreateSample from "./Create/CreateSample";
import SampleDetail from "./Detail/SampleDetail";
import SampleFileManager from "./SampleFileManager";
import SamplesSettings from "./SampleSettings";
import SamplesList from "./SamplesList";

export default function Samples() {
	return (
		<Container>
			<Switch>
				<Route path="/samples/settings" component={SamplesSettings} />
				<Route path="/samples/files" component={SampleFileManager} />
				<Route path="/samples/labels" component={Labels} />
				<Route path="/samples/create" component={CreateSample} />
				<Route path="/samples/:sampleId/*?" component={SampleDetail} />
				<Route path="/samples/" component={SamplesList} />
			</Switch>
		</Container>
	);
}
