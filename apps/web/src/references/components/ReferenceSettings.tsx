import { useSuspenseSettings } from "@administration/queries";
import ContainerNarrow from "@base/ContainerNarrow";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { GlobalSourceTypes } from "./SourceTypes/GlobalSourceTypes";

export default function ReferenceSettings() {
	const { data } = useSuspenseSettings();

	return (
		<ContainerNarrow>
			<ViewHeader title="Reference Settings">
				<ViewHeaderTitle>Settings</ViewHeaderTitle>
			</ViewHeader>
			<GlobalSourceTypes sourceTypes={data.default_source_types} />
		</ContainerNarrow>
	);
}
