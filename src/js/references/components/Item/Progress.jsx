import React from "react";
import { ProgressBarAffixed } from "../../../base";

export const ReferenceItemProgress = ({ now }) => {
    if (now < 100) {
        return <ProgressBarAffixed color="green" now={now} bottom />;
    }

    return null;
};
