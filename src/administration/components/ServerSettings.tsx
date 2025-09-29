import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { useFetchMessage } from "@message/queries";
import { useFetchSettings } from "../queries";
import Api from "./Api";
import InstanceMessage from "./InstanceMessage";

export default function ServerSettings() {
    const { data: message, isPending: isPendingMessage } = useFetchMessage();
    const { data: settings, isPending: isPendingSettings } = useFetchSettings();

    if (isPendingSettings || isPendingMessage) {
        return <LoadingPlaceholder />;
    }

    return (
        <ContainerNarrow>
            <Api settings={settings} />
            <InstanceMessage message={message} />
        </ContainerNarrow>
    );
}
