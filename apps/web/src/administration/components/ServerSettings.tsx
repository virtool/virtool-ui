import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import QueryError from "@base/QueryError";
import { useFetchSettings } from "../queries";
import Api from "./Api";
import Banners from "./Banners";

export default function ServerSettings() {
	const {
		data: settings,
		isPending: isPendingSettings,
		isError: isErrorSettings,
	} = useFetchSettings();

	if (isErrorSettings && !settings) {
		return <QueryError noun="server settings" />;
	}

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
