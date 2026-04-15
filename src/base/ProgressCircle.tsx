import { cn } from "@app/utils";
import type { JobState } from "@jobs/types";
import { Progress } from "radix-ui";

export enum sizes {
	xs = "xs",
	sm = "sm",
	md = "md",
	lg = "lg",
	xl = "xl",
	xxl = "xxl",
}

const colorToHex: Record<string, string> = {
	blue: "#0B7FE5",
	blueLightest: "#CDF1FD",
	green: "#1DAD57",
	greenLightest: "#D1FAD1",
	grey: "#A0AEC0",
	greyLight: "#CBD5E0",
	red: "#E0282E",
	redLightest: "#FDE1D3",
};

const progressCircleSizes: Record<string, number> = {
	xs: 12,
	sm: 16,
	md: 20,
	lg: 28,
	xl: 44,
	xxl: 60,
};

function calculateStrokeWidth(size: number): number {
	return size / 5;
}

function calculateRadius(size: number): number {
	return size / 2 - calculateStrokeWidth(size);
}

function calculateCircumference(size: number): number {
	return calculateRadius(size) * Math.PI * 2;
}

function calculateStrokeDashOffset(size: number, progress: number): number {
	return (1 - progress) * calculateCircumference(size);
}

function getProgressColor(state: JobState): string {
	switch (state) {
		case "succeeded":
			return "green";
		case "running":
			return "blue";
		case "pending":
			return "grey";
		default:
			return "red";
	}
}

function getTrackColor(color: string): string {
	if (color === "grey") {
		return colorToHex.greyLight;
	}
	return colorToHex[`${color}Lightest`] || colorToHex.greyLight;
}

type ProgressCircleProps = {
	progress: number;
	state?: JobState;
	size?: sizes;
};

export default function ProgressCircle({
	progress,
	size = sizes.md,
	state = "pending",
}: ProgressCircleProps) {
	const circleSize = progressCircleSizes[size];
	const color = getProgressColor(state);
	const radius = calculateRadius(circleSize);
	const strokeWidth = calculateStrokeWidth(circleSize);
	const circumference = calculateCircumference(circleSize);
	const center = circleSize / 2;

	const baseCircleStyle = {
		cx: center,
		cy: center,
		r: radius,
		fill: "transparent",
		strokeWidth,
		strokeDasharray: circumference,
	};

	return (
		<Progress.Root value={progress} asChild>
			<svg
				className="-rotate-90"
				style={{ width: circleSize, height: circleSize }}
			>
				<title>Progress: {progress}%</title>
				<circle
					{...baseCircleStyle}
					className={cn(
						"transition-[stroke-dashoffset,stroke] duration-1000",
						state === "pending" && "animate-rotate",
					)}
					stroke={getTrackColor(color)}
					strokeDashoffset={
						state === "pending"
							? calculateStrokeDashOffset(circleSize, 0.75)
							: 0
					}
					style={{
						transformBox: "fill-box",
						transformOrigin: "center",
						animationPlayState: state === "pending" ? "running" : "paused",
					}}
				/>
				{state === "running" && (
					<circle
						cx={center}
						cy={center}
						r={radius / 2.5}
						fill={colorToHex.blue}
						className="animate-fade"
						style={{
							vectorEffect: "non-scaling-stroke",
							transformBox: "fill-box",
							transformOrigin: "center",
						}}
					/>
				)}
				<Progress.Indicator asChild>
					<circle
						{...baseCircleStyle}
						className="transition-[stroke-dashoffset,stroke] duration-1000"
						stroke={colorToHex[color]}
						strokeDashoffset={calculateStrokeDashOffset(
							circleSize,
							progress / 100,
						)}
					/>
				</Progress.Indicator>
			</svg>
		</Progress.Root>
	);
}
