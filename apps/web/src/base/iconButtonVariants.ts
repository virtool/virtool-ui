import { cva } from "class-variance-authority";

export const iconButtonVariants = cva(
	"bg-inherit border-none cursor-pointer items-center outline-none p-2.5 rounded-full text-inherit",
	{
		variants: {
			color: {
				black: "text-black hover:bg-black/10 focus:bg-black/20",
				blue: "text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 focus:bg-blue-500/20",
				gray: "text-gray-400 hover:text-gray-500 hover:bg-gray-400/10 focus:bg-gray-400/20",
				grayDark:
					"text-gray-500 hover:text-gray-600 hover:bg-gray-500/10 focus:bg-gray-500/20",
				// `IconColor` carries both spellings. The old hand-written map had no
				// `grey` key, so a grey icon button rendered with no color at all.
				grey: "text-gray-400 hover:text-gray-500 hover:bg-gray-400/10 focus:bg-gray-400/20",
				green:
					"text-green-500 hover:text-green-600 hover:bg-green-500/10 focus:bg-green-500/20",
				orange:
					"text-orange-500 hover:text-orange-600 hover:bg-orange-500/10 focus:bg-orange-500/20",
				purple:
					"text-purple-500 hover:text-purple-600 hover:bg-purple-500/10 focus:bg-purple-500/20",
				red: "text-red-500 hover:text-red-600 hover:bg-red-500/10 focus:bg-red-500/20",
			},
		},
		defaultVariants: { color: "black" },
	},
);
