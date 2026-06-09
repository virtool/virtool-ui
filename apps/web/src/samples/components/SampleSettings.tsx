import { useSuspenseSettings } from "@administration/queries";
import ContainerNarrow from "@base/ContainerNarrow";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import SampleRights from "./SampleRights";

export default function SamplesSettings() {
	const { data } = useSuspenseSettings();

	return (
		<ContainerNarrow>
			<ViewHeader title="Sample Settings">
				<ViewHeaderTitle>Sample Settings</ViewHeaderTitle>
			</ViewHeader>
			<SampleRights settings={data} />
		</ContainerNarrow>
	);
}
