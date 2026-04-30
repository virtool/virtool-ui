export const bgColorClasses = {
	blue: "bg-blue-600",
	green: "bg-green-600",
	orange: "bg-amber-500",
	purple: "bg-purple-400",
	red: "bg-red-600",
} as const;

export type BarColor = keyof typeof bgColorClasses;
