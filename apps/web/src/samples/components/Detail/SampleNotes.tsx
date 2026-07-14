import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@base/Empty";
import Markdown from "@base/Markdown";
import { FileText } from "lucide-react";

type SampleNotesProps = {
	notes?: string;
};

/**
 * The notes a user has written about a sample, rendered as markdown.
 */
export default function SampleNotes({ notes }: SampleNotesProps) {
	if (!notes) {
		return (
			<Empty className="py-12">
				<EmptyMedia className="text-gray-400">
					<FileText size={40} strokeWidth={1.5} />
				</EmptyMedia>
				<EmptyTitle>No notes found</EmptyTitle>
				<EmptyDescription>No notes have been added yet.</EmptyDescription>
			</Empty>
		);
	}

	return (
		<Markdown
			className="overflow-y-scroll max-h-96 mb-0 py-2.5 px-4"
			markdown={notes}
		/>
	);
}
