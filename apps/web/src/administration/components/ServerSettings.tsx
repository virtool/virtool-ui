import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { useFetchSettings } from "../queries";
import Api from "./Api";
import Banners from "./Banners";

export default function ServerSettings() {
	const { data: settings, isPending: isPendingSettings } = useFetchSettings();

	if (isPendingSettings) {
		return <LoadingPlaceholder />;
	}

	return (
		<ContainerNarrow>
			<Api settings={settings} />
			<Banners />
		</ContainerNarrow>
	);
}
