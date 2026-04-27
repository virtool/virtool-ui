import { useMatchPartialPath } from "@app/hooks";
import { cn } from "@app/utils";
import Icon from "@base/Icon";
import Link from "@base/Link";
import type { LucideIcon } from "lucide-react";

type SidebarItemProps = {
	exclude?: string[];
	icon: LucideIcon;
	link: string;
	title: string;
};

const baseClassName = cn(
	"text-gray-500",
	"cursor-pointer",
	"pb-5",
	"flex flex-col items-center",
	"w-full",
	"hover:text-gray-700",
);

const activeClassName = cn(
	baseClassName,
	"text-primary",
	"font-medium",
	"hover:text-primary",
	"focus:text-primary",
);

function parseLinkSearch(link: string): Record<string, string> | undefined {
	const qIndex = link.indexOf("?");
	if (qIndex === -1) {
		return undefined;
	}
	const params = new URLSearchParams(link.slice(qIndex));
	const result: Record<string, string> = {};
	for (const [key, value] of params) {
		result[key] = value;
	}
	return result;
}

export default function SidebarLink({
	icon,
	link,
	title,
	exclude,
}: SidebarItemProps) {
	const isActive = useMatchPartialPath(link, exclude);
	const to = link.split("?")[0];
	const search = parseLinkSearch(link) as any;

	return (
		<Link
			to={to}
			search={search}
			className={isActive ? activeClassName : baseClassName}
		>
			<Icon icon={icon} className="text-lg" />
			<p className="block text-md my-2">{title}</p>
		</Link>
	);
}
