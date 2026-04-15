import { cn } from "@app/utils";

type SequenceValueProps = {
	className?: string;
	children: React.ReactNode;
};

function SequenceValue({ className, children }: SequenceValueProps) {
	return (
		<div
			className={cn(
				"flex min-w-0 flex-col [&>p]:m-0 [&>p]:overflow-hidden [&>p]:text-ellipsis [&>p]:whitespace-nowrap [&>small]:m-0 [&>small]:overflow-hidden [&>small]:text-ellipsis [&>small]:whitespace-nowrap [&>small]:text-xs [&>small]:font-bold [&>small]:uppercase [&>small]:text-gray-500",
				className,
			)}
		>
			{children}
		</div>
	);
}

export function SequenceTitleValue({ label, value }) {
	return (
		<SequenceValue className="flex-1">
			<p>{value}</p>
			<small>{label}</small>
		</SequenceValue>
	);
}

export function SequenceAccessionValue({ accession }) {
	return (
		<SequenceValue className="mr-5 w-25">
			<p>{accession}</p>
			<small>ACCESSION</small>
		</SequenceValue>
	);
}
