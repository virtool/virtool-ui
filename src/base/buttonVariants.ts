import { cva } from "class-variance-authority";

export const buttonVariants = cva(
	"cursor-pointer items-center inline-flex font-medium px-4 select-none hover:shadow-lg",
	{
		variants: {
			color: {
				gray: "bg-gray-200 text-black",
				blue: "bg-blue-600 text-white",
				green: "bg-green-600 text-white",
				red: "bg-red-600 text-white",
				purple: "bg-purple-600 text-white",
			},
			size: {
				large: "min-h-10 text-lg rounded-md",
				small: "min-h-8 text-sm rounded-md",
			},
		},
		defaultVariants: { color: "gray", size: "large" },
	},
);
