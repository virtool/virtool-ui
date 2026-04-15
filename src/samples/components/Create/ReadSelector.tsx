import { cn } from "@app/utils";
import Box from "@base/Box";
import BoxGroup from "@base/BoxGroup";
import Button from "@base/Button";
import CompactScrollList from "@base/CompactScrollList";
import Icon from "@base/Icon";
import InputError from "@base/InputError";
import InputSearch from "@base/InputSearch";
import Link from "@base/Link";
import NoneFoundSection from "@base/NoneFoundSection";
import PseudoLabel from "@base/PseudoLabel";
import Toolbar from "@base/Toolbar";
import type {
	FetchNextPageOptions,
	InfiniteData,
	InfiniteQueryObserverResult,
} from "@tanstack/react-query/";
import { Repeat, Undo } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { useValidateFiles } from "@/uploads/hooks";
import { type FileResponse, UploadType } from "@/uploads/types";
import ReadSelectorItem from "./ReadSelectorItem";

type ReadSelectorProps = {
	/** Samples uploads on current page */
	data: InfiniteData<FileResponse>;
	/** Whether the next page is being fetched */
	isFetchingNextPage: boolean;
	/** Fetches the next page of data */
	fetchNextPage: (
		options?: FetchNextPageOptions,
	) => Promise<InfiniteQueryObserverResult>;
	/** Whether the data is fetched */
	isPending: boolean;
	/** A callback function to handle file selection */
	onSelect: (selected: number[]) => void;
	/** Errors occurred on sample creation */
	error: string;
	/** The selected uploads */
	selected: number[];
};

/**
 * A list of read uploads with option to filter by file name
 */
export default function ReadSelector({
	data,
	isFetchingNextPage,
	fetchNextPage,
	isPending,
	onSelect,
	error,
	selected,
}: ReadSelectorProps) {
	useValidateFiles(UploadType.reads, selected, onSelect);

	const [term, setTerm] = useState("");
	const [selectedFiles, setSelectedFiles] = useState(selected);

	const { total_count } = data.pages[0];

	function handleSelect(selectedId: number) {
		setSelectedFiles((prevArray) => {
			if (prevArray.includes(selectedId)) {
				const newArray = prevArray.filter((id) => id !== selectedId);
				onSelect(newArray);
				return newArray;
			}
			const newArray = [...prevArray, selectedId];
			if (newArray.length === 3) {
				newArray.shift();
			}
			onSelect(newArray);
			return newArray;
		});
	}

	useEffect(() => {
		setSelectedFiles(selected);
	}, [selected]);

	function swap() {
		onSelect(selected.slice().reverse());
	}

	function reset() {
		setTerm("");
		onSelect([]);
	}

	const loweredFilter = term.toLowerCase();

	const items = data.pages.flatMap((page) => page.items);
	const files = items.filter(
		(file) => !term || file.name.toLowerCase().includes(loweredFilter),
	);

	function renderRow(item) {
		const index = selectedFiles.indexOf(item.id);

		return (
			<ReadSelectorItem
				{...item}
				key={item.id}
				index={index}
				selected={index > -1}
				onSelect={handleSelect}
			/>
		);
	}

	const noneFound = total_count === 0 && (
		<BoxGroup>
			<NoneFoundSection noun="files">
				<Link to="/samples/files">Upload some</Link>
			</NoneFoundSection>
		</BoxGroup>
	);

	let pairedness: ReactNode | undefined;

	if (selected.length === 1) {
		pairedness = <span>Unpaired | </span>;
	}

	if (selected.length === 2) {
		pairedness = <span>Paired | </span>;
	}

	return (
		<div>
			<label className="flex items-center font-medium [&_label]:m-0 [&_span]:text-gray-500 [&_span]:ml-auto">
				<PseudoLabel>Read files</PseudoLabel>
				<span>
					{pairedness}
					{selected.length} of {total_count} selected
				</span>
			</label>

			<Box className={cn(error && "border-red-600")}>
				<Toolbar>
					<div className="flex-grow">
						<InputSearch
							placeholder="Filename"
							value={term}
							onChange={(e) => setTerm(e.target.value)}
						/>
					</div>
					<Button className="inline-flex gap-2" onClick={reset}>
						<Icon icon={Undo} /> Reset
					</Button>
					<Button className="inline-flex gap-2" type="button" onClick={swap}>
						<Icon icon={Repeat} /> Swap
					</Button>
				</Toolbar>
				{noneFound || (
					<>
						<CompactScrollList
							className="border border-gray-300 rounded h-96"
							fetchNextPage={fetchNextPage}
							isFetchingNextPage={isFetchingNextPage}
							isPending={isPending}
							items={files}
							renderRow={renderRow}
						/>

						<InputError className="mb-2.5">{error}</InputError>
					</>
				)}
			</Box>
		</div>
	);
}
