import { cn } from "@/app/utils";
import { useFetchBanner } from "../queries";
import type { BannerColor } from "../types";

const bannerColorClasses: Record<BannerColor, string> = {
	red: "bg-red-500",
	orange: "bg-orange-500",
	yellow: "bg-yellow-500",
	blue: "bg-blue-500",
	purple: "bg-purple-500",
	grey: "bg-gray-500",
};

/**
 * Displays the active banner.
 */
export default function Banner() {
	const { data, isPending } = useFetchBanner();

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
