import { cn } from "@app/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import NoneFound from "./NoneFound";

type MarkdownProps = {
	markdown?: string;
};

/**
 * A styled component that parses, formats, and displays markdown content
 */
export default function Markdown({ markdown = "" }: MarkdownProps) {
	return (
		<div
			className={cn("overflow-y-scroll", "max-h-96", "mb-0", "py-2.5", "px-4")}
		>
			{markdown ? (
				<ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
			) : (
				<NoneFound noun="notes" />
			)}
		</div>
	);
}
