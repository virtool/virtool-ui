export function SequenceTitleValue({ label, value }) {
	return (
		<div className="flex flex-col min-w-0 flex-1">
			<p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap">
				{value}
			</p>
			<small className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-gray-500 text-xs font-bold uppercase">
				{label}
			</small>
		</div>
	);
}

export function SequenceAccessionValue({ accession }) {
	return (
		<div className="flex flex-col min-w-0 w-24 mr-5">
			<p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap">
				{accession}
			</p>
			<small className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-gray-500 text-xs font-bold uppercase">
				ACCESSION
			</small>
		</div>
	);
}
