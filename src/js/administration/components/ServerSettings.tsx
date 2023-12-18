import React from "react";
import { ContainerNarrow } from "../../base";
import Api from "./Api";
import InstanceMessage from "./InstanceMessage";

export function ServerSettings() {
    return (
        <ContainerNarrow>
            <InstanceMessage />
            <Api />
        </ContainerNarrow>
    );
}
