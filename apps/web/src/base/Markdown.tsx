import { cn } from "@app/utils";
import { FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "./Empty";

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
				<Empty className="py-12">
					<EmptyMedia className="text-gray-400">
						<FileText size={40} strokeWidth={1.5} />
					</EmptyMedia>
					<EmptyTitle>No notes found</EmptyTitle>
					<EmptyDescription>No notes have been added yet.</EmptyDescription>
				</Empty>
			)}
		</div>
	);
}
