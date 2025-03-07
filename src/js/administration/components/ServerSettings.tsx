import { LoadingPlaceholder } from "@base";
import ContainerNarrow from "@base/ContainerNarrow";
import { useFetchMessage } from "@message/queries";
import React from "react";
import { useFetchSettings } from "../queries";
import Api from "./Api";
import InstanceMessage from "./InstanceMessage";

export function ServerSettings() {
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
