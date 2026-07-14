import { cn } from "@app/cn";
import { cva } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";
import { type ComponentProps, createContext, useContext } from "react";

type TabsVariant = "segmented" | "vertical";

const TabsVariantContext = createContext<TabsVariant>("segmented");

const rootVariants = cva("", {
	variants: {
		variant: {
			segmented: "",
			vertical: "gap-x-4 grid grid-cols-4",
		},
	},
	defaultVariants: { variant: "segmented" },
});

const listVariants = cva("flex", {
	variants: {
		variant: {
			segmented:
				"bg-gray-100 h-12 items-center justify-center p-1 rounded-lg text-gray-500 text-lg",
			vertical:
				"bg-white border border-gray-300 col-span-1 flex-col overflow-hidden rounded-sm self-start",
		},
	},
	defaultVariants: { variant: "segmented" },
});

const triggerVariants = cva("cursor-pointer", {
	variants: {
		variant: {
			segmented:
				"data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-gray-900 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/50 font-medium hover:text-gray-700 inline-flex items-center justify-center px-3 py-1 rounded-md transition-all whitespace-nowrap",
			vertical:
				"data-[state=active]:font-medium data-[state=active]:shadow-[inset_3px_0_0_var(--color-virtool)] data-[state=active]:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-600/50 focus-visible:ring-inset focus:outline-none hover:bg-gray-50 hover:text-gray-700 px-6 py-3 text-gray-500 text-left transition-colors",
		},
	},
	defaultVariants: { variant: "segmented" },
});

const contentVariants = cva("", {
	variants: {
		variant: {
			segmented:
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/50 mt-2",
			vertical: "col-span-3 focus:outline-none",
		},
	},
	defaultVariants: { variant: "segmented" },
});

type TabsProps = ComponentProps<typeof TabsPrimitive.Root> & {
	variant?: TabsVariant;
};

/**
 * An accessible tabs widget wrapping Radix Tabs, where each tab reveals its own
 * panel. Use `variant="vertical"` for a master-detail layout. For route
 * navigation use NavTabs instead.
 */
export function Tabs({
	variant = "segmented",
	className,
	orientation,
	...props
}: TabsProps) {
	return (
		<TabsVariantContext.Provider value={variant}>
			<TabsPrimitive.Root
				className={cn(rootVariants({ variant }), className)}
				orientation={
					orientation ?? (variant === "vertical" ? "vertical" : "horizontal")
				}
				{...props}
			/>
		</TabsVariantContext.Provider>
	);
}

export function TabsList({
	className,
	...props
}: ComponentProps<typeof TabsPrimitive.List>) {
	const variant = useContext(TabsVariantContext);

	return (
		<TabsPrimitive.List
			className={cn(listVariants({ variant }), className)}
			{...props}
		/>
	);
}

export function TabsTrigger({
	className,
	...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
	const variant = useContext(TabsVariantContext);

	return (
		<TabsPrimitive.Trigger
			className={cn(triggerVariants({ variant }), className)}
			{...props}
		/>
	);
}

export function TabsContent({
	className,
	...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
	const variant = useContext(TabsVariantContext);

	return (
		<TabsPrimitive.Content
			className={cn(contentVariants({ variant }), className)}
			{...props}
		/>
	);
}
