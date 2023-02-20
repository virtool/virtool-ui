import React from "react";
import { ContainerNarrow } from "../../base";
import Api from "./Api";
import InstanceMessage from "./InstanceMessage";

export const ServerSettings = () => (
    <ContainerNarrow>
        <InstanceMessage />
        <Api />
    </ContainerNarrow>
);
