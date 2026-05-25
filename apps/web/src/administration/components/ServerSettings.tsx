import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { useFetchSettings } from "../queries";
import Api from "./Api";
import InstanceMessages from "./InstanceMessages";

export default function ServerSettings() {
	const { data: settings, isPending: isPendingSettings } = useFetchSettings();

	if (isPendingSettings) {
		return <LoadingPlaceholder />;
	}

	return (
		<ContainerNarrow>
			<Api settings={settings} />
			<InstanceMessages />
		</ContainerNarrow>
	);
}
