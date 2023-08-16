import { Indicator, Root } from "@radix-ui/react-progress";
import React from "react";
import styled, { keyframes } from "styled-components";
import { getColor, sizes } from "../app/theme";
import { JobState } from "../jobs/types";

/**
 * Calculate the stroke width based on the total size of the progress circle
 *
 * @param size - The total size of the progress circle in pixels
 * @returns  The stroke width in pixels
 */

function getStrokeWidth(size: number): number {
    return size / 5;
}

/**
 * Calculate the radius of the circle based on the total size and stroke width
 *
 * @param size - The total size of the progress circle in pixels
 * @returns The stroke width in pixels
 */
function getRadius(size: number): number {
    return size / 2 - getStrokeWidth(size);
}

/**
 * Calculate the circumference of the circle taking into account the stroke width
 *
 * @param size - The total size of the progress circle in pixels
 * @returns The circumference of the circle in pixels
 */
function getCircumference(size: number): number {
    return getRadius(size) * Math.PI * 2;
}

/**
 * Calculate stroke offset needed to display the correct amount of progress
 *
 * @param size - The total size of the progress circle in pixels
 * @param progress - the amount of progress from 0 to 1
 * @returns the stroke offset in pixels
 */
function getStrokeDashoffset({ progress, size }: { progress: number; size: number }): number {
    return (1 - progress) * getCircumference(size);
}

const rotate = keyframes`
        0% {
            transform: rotate(0deg);
        }
        50% { 
            transform: rotate(180deg);
        }
        100% {
            transform: rotate(360deg);
        }
    `;

type ProgressCircleBaseProps = {
    size: number;
};

/**
 * The root progress circle component.
 *
 * @param size - The total size of the progress circle in pixels
 */
const StyledProgressCircle = styled.svg<ProgressCircleBaseProps>`
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    transform: rotate(-90deg);
`;

/**
 * Base component containing shared ProgressCircle styles
 *
 * @param size - The total size of the progress circle in pixels
 * @returns The ProgressCircle indicator
 */

const ProgressCircleBase = styled.circle<ProgressCircleBaseProps>`
    cx: ${props => props.size / 2}px;
    cy: ${props => props.size / 2}px;
    r: ${props => getRadius(props.size)}px;
    fill: transparent;
    stroke-width: ${props => getStrokeWidth(props.size)}px;
    stroke: ${getColor};
    stroke-dasharray: ${props => getCircumference(props.size)}px;
    transition: stroke-dashoffset 1s;
`;

type ProgressCircleIndicatorProps = ProgressCircleBaseProps & {
    progress: number;
};

/**
 * Indicator for the amount of progress that has been made.
 *
 * @param size - The total size of the progress circle in pixels
 * @param progress - The amount of progress that has been made from 0 to 1
 * @returns The ProgressCircle indicator
 */
const ProgressCircleIndicator = styled(ProgressCircleBase)<ProgressCircleIndicatorProps>`
    stroke-dashoffset: ${getStrokeDashoffset}px;
`;

type ProgressCircleTrackProps = ProgressCircleBaseProps & {
    state: JobState;
};

/**
 * The indeterminate loader and track for the determinate progress circle.
 *
 * @param size - The total size of the progress circle in pixels
 * @param state - The current state of the job or task
 * @returns The progress circle track
 */
const ProgressCircleTrack = styled(ProgressCircleBase)<ProgressCircleTrackProps>`
    stroke-dashoffset: ${props =>
        props.state === "waiting" ? `${getStrokeDashoffset({ progress: 0.75, size: props.size })}px` : "0px"};
    transform-box: fill-box;
    transform-origin: center;
    animation: ${rotate} 0.75s linear infinite;
    animation-play-state: ${props => (props.state == "waiting" ? "running" : "paused")};
`;

const ProgressCirclePulseAnimation = keyframes`
    from {
        transform: scale(1);
    }
    to {
        transform: scale(1.2);
    }
`;

/**
 * Pulsing outer ring for conveying that a job is running.
 *
 * @param size - The total size of the progress circle in pixels
 * @param state - The current state of the job or task
 * @returns An indeterminate pulsing progress indicator
 */
const ProgressCirclePulse = styled.circle<ProgressCircleTrackProps>`
    cx: ${props => props.size / 2}px;
    cy: ${props => props.size / 2}px;
    r: ${props => getRadius(props.size) + getStrokeWidth(props.size) / 2}px;
    fill: transparent;
    stroke: ${getColor};
    stroke-width: ${props => getStrokeWidth(props.size) / 4}px;
    opacity: ${props => (props.state === "preparing" || props.state === "running" ? 1 : 0)};
    animation: ${ProgressCirclePulseAnimation} 1.75s linear infinite alternate;
    vector-effect: non-scaling-stroke;
    transform-box: fill-box;
    transform-origin: center;
`;

const fade = keyframes`
    from {
        opacity: .4;
        transform: scale(1);
    }
    to {
        opacity: 1;
        transform: scale(1.1);
    }
`;

/**
 * Pulsing inner circle for visually indicating that a job is running.
 *
 * @param size - The total size of the progress circle in pixels
 * @param state - The current state of the job or task
 * @returns An Indeterminately pulsing progress indicator
 */
const ProgressCircleCenter = styled.circle<ProgressCircleTrackProps>`
    cx: ${props => props.size / 2}px;
    cy: ${props => props.size / 2}px;
    r: ${props => getRadius(props.size) / 3}px;
    fill: ${getColor};
    opacity: ${props => (props.state == "waiting" ? 0 : 1)};
    animation: ${props => (props.state === "preparing" || props.state === "running" ? fade : "none")} 1.75s ease-in-out
        infinite alternate;
    vector-effect: non-scaling-stroke;
    transform-box: fill-box;
    transform-origin: center;
`;

const ProgressCircleSize = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 28,
    xl: 44,
    xxl: 60,
};

/**
 * Determine the appropriate color for the ProgressCircle based on the state of the job or task.
 *
 * @param state - The current state of the job or task
 * @returns The color of the progress circle
 */
function getProgressColour(state: JobState): string {
    switch (state) {
        case "complete":
            return "green";
        case "preparing":
        case "running":
            return "blue";
        case "waiting":
            return "greyLight";
        default:
            return "red";
    }
}
type ProgressCircleProps = {
    progress: number;
    state: JobState;
    size?: sizes;
};

/**
 * Circular progress bar for displaying the progress of a job or task.
 *
 * @param progress - The progress of the circle in percent
 * @param state - The state of the running job or task
 * @param size - The size of the progress circle
 * @returns A determinate or indeterminate progress circle
 */

export function ProgressCircle({ progress, size = sizes.md, state = "waiting" }: ProgressCircleProps) {
    const circleSize = ProgressCircleSize[size];
    const color = getProgressColour(state);

    return (
        <Root value={progress} asChild>
            <StyledProgressCircle size={circleSize}>
                <ProgressCirclePulse color={color} size={circleSize} state={state} />
                <ProgressCircleTrack color="greyLight" size={circleSize} state={state} />
                <ProgressCircleCenter color={color} size={circleSize} state={state} />
                <Indicator asChild>
                    <ProgressCircleIndicator color={color} size={circleSize} progress={progress / 100} />
                </Indicator>
            </StyledProgressCircle>
        </Root>
    );
}
