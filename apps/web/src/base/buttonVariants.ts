import { cva } from "class-variance-authority";

export const buttonVariants = cva(
	"cursor-pointer items-center inline-flex font-medium px-4 rounded-md select-none hover:shadow-lg",
	{
		variants: {
			color: {
				gray: "bg-gray-200 text-black hover:text-black",
				blue: "bg-blue-600 text-white hover:text-white",
				green: "bg-green-600 text-white hover:text-white",
				red: "bg-red-600 text-white hover:text-white",
				purple: "bg-purple-600 text-white hover:text-white",
			},
			size: {
				large: "min-h-10 text-lg",
				small: "min-h-8 text-sm",
			},
		},
		defaultVariants: { color: "gray", size: "large" },
	},
);
