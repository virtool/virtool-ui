import { cn } from "@app/utils";
import Attribution from "./Attribution";

type ViewHeaderAttributionProps = {
	className?: string;
	time: string | Date;
	user?: string;
	verb?: string;
};

export default function ViewHeaderAttribution({
	className,
	...rest
}: ViewHeaderAttributionProps) {
	return <Attribution className={cn("text-sm mt-1", className)} {...rest} />;
}
