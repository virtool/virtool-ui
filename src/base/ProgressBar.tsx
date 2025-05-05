import React from "react";
import { StyledProgress } from "./styled/StyledProgress";

interface ProgressBarProps {
    now: number;
    color?: string;
}

export default function ProgressBar({ now, color }: ProgressBarProps) {
    return <StyledProgress max="100" value={now} color={color} />;
}
