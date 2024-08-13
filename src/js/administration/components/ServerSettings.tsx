import { ContainerNarrow, LoadingPlaceholder } from "@base";
import { useFetchMessage } from "@message/queries";
import React from "react";
import { useFetchSettings } from "../queries";
import Api from "./Api";
import InstanceMessage from "./InstanceMessage";

export function ServerSettings() {
    const { data: message, isLoading: isLoadingMessage } = useFetchMessage();
    const { data: settings, isLoading: isLoadingSettings } = useFetchSettings();

    if (isLoadingSettings || isLoadingMessage) {
        return <LoadingPlaceholder />;
    }

    return (
        <ContainerNarrow>
            <Api settings={settings} />
            <InstanceMessage message={message} />
        </ContainerNarrow>
    );
}
