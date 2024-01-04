import React from "react";
import { ContainerNarrow, LoadingPlaceholder } from "../../base";
import { useFetchMessage } from "../../message/querys";
import { useFetchSettings } from "../querys";
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
            <InstanceMessage message={message} />
            <Api settings={settings} />
        </ContainerNarrow>
    );
}
