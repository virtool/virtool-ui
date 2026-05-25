import { cn } from "@/app/utils";
import { useFetchBanner } from "../queries";
import { bannerColorClasses } from "../types";

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
