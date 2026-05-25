import { cn } from "@/app/utils";
import { useFetchMessage } from "../queries";
import type { MessageColor } from "../types";

const bannerColorClasses: Record<MessageColor, string> = {
	red: "bg-red-500",
	orange: "bg-orange-500",
	yellow: "bg-yellow-500",
	blue: "bg-blue-500",
	purple: "bg-purple-500",
	grey: "bg-gray-500",
};

/**
 * Displays the banner containing the instance message
 */
export default function MessageBanner() {
	const { data, isPending } = useFetchMessage();

	return !isPending && data?.active ? (
		<div
			className={cn(
				bannerColorClasses[data.color],
				"font-medium",
				"px-3",
				"py-1",
				"text-white",
				"text-lg",
			)}
		>
			{data.message}
		</div>
	) : null;
}
