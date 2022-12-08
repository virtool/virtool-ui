import React from "react";
import { NarrowContainer } from "../../base";
import Api from "./Api";
import InstanceMessage from "./InstanceMessage";

export const ServerSettings = () => (
    <NarrowContainer>
        <InstanceMessage />
        <Api />
    </NarrowContainer>
);
