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

function calculateStrokeWidth({ size }: ProgressCircleBaseProps): number {
    return size / 5;
}

/**
 * Calculate the radius of the circle based on the total size and stroke width
 *
 * @param size - The total size of the progress circle in pixels
 * @returns The stroke width in pixels
 */
function calculateProgressCircleRadius({ size }: ProgressCircleBaseProps): number {
    return size / 2 - calculateStrokeWidth({ size });
}

/**
 * Calculate the circumference of the circle taking into account the stroke width
 *
 * @param size - The total size of the progress circle in pixels
 * @returns The circumference of the circle in pixels
 */
function calculateCircumference({ size }: ProgressCircleBaseProps): number {
    return calculateProgressCircleRadius({ size }) * Math.PI * 2;
}

/**
 * Calculate stroke offset needed to display the correct amount of progress
 *
 * @param size - The total size of the progress circle in pixels
 * @param progress - the amount of progress from 0 to 1
 * @returns the stroke offset in pixels
 */
function calculateStrokeDashOffset({ progress, ...props }: ProgressCircleIndicatorProps): number {
    return (1 - progress) * calculateCircumference(props);
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
 * Circle component containing shared ProgressCircle styles
 *
 * @param size - The total size of the progress circle in pixels
 * @returns The ProgressCircle indicator
 */

const ProgressCircleBase = styled.circle<ProgressCircleBaseProps>`
    cx: ${props => props.size / 2}px;
    cy: ${props => props.size / 2}px;
    r: ${calculateProgressCircleRadius}px;
    fill: transparent;
    stroke-width: ${calculateStrokeWidth}px;
    stroke: ${getColor};
    stroke-dasharray: ${calculateCircumference}px;
    transition: stroke-dashoffset 1s, stroke 1s;
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
    stroke-dashoffset: ${calculateStrokeDashOffset}px;
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
        props.state === "waiting" ? `${calculateStrokeDashOffset({ progress: 0.75, size: props.size })}px` : "0px"};
    transform-box: fill-box;
    transform-origin: center;
    animation: ${rotate} 0.75s linear infinite;
    animation-play-state: ${props => (props.state === "waiting" ? "running" : "paused")};
`;

const fade = keyframes`
    from {
        opacity: .6;
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
    r: ${props => calculateProgressCircleRadius(props) / 2.5}px;
    fill: ${props => getColor({ theme: props.theme, color: "blue" })};
    opacity: ${props => (props.state === "waiting" ? 0 : 1)};
    animation: ${fade} 1.25s ease-in-out infinite alternate;
    vector-effect: non-scaling-stroke;
    transform-box: fill-box;
    transform-origin: center;
`;

const progressCircleSizes = {
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
function determineProgressColour(state: JobState): string {
    switch (state) {
        case "complete":
            return "green";
        case "preparing":
        case "running":
            return "blue";
        case "waiting":
            return "grey";
        default:
            return "red";
    }
}
type ProgressCircleProps = {
    progress: number;
    state?: JobState;
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

export function ProgressCircle({ progress, size = sizes.md, state = JobState.waiting }: ProgressCircleProps) {
    const circleSize = progressCircleSizes[size];
    const color = determineProgressColour(state);

    return (
        <Root value={progress} asChild>
            <StyledProgressCircle size={circleSize}>
                <ProgressCircleTrack
                    color={color === "grey" ? `${color}Light` : `${color}Lightest`}
                    size={circleSize}
                    state={state}
                />
                {(state === "preparing" || state === "running") && (
                    <ProgressCircleCenter color={color} size={circleSize} state={state} />
                )}
                <Indicator asChild>
                    <ProgressCircleIndicator color={color} size={circleSize} progress={progress / 100} />
                </Indicator>
            </StyledProgressCircle>
        </Root>
    );
}
