import { CircleAlert } from "lucide-react";
import { cn } from "@/app/utils";
import { noneFoundStyle } from "./noneFoundStyle";

interface NoneFoundProps {
	noun: string;
	className?: string;
}

export default function NoneFound({ noun, className }: NoneFoundProps) {
	return (
		<div className={cn(noneFoundStyle, className)}>
			<CircleAlert size={18} /> No {noun} found
		</div>
	);
}
