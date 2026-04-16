import CompactScrollList from "@base/CompactScrollList";
import InputError from "@base/InputError";
import Link from "@base/Link";
import NoneFoundBox from "@base/NoneFoundBox";
import type { InfiniteData } from "@tanstack/react-query";
import type {
	FetchNextPageOptions,
	InfiniteQueryObserverResult,
} from "@tanstack/react-query/";
import { useValidateFiles } from "@/uploads/hooks";
import { type FileResponse, type Upload, UploadType } from "@/uploads/types";
import { SubtractionFileItem } from "./SubtractionFileItem";

type SubtractionFileSelectorProps = {
	/** The subtraction uploads */
	files: InfiniteData<FileResponse>;

	/** The number of subtraction uploads */
	foundCount: number;

	/** The selected file id */
	selected: number[];

	/** A callback function to handle file selection */
	onClick: (selected: number[]) => void;

	/** Errors occurred on sample creation */
	error: string;

	/** Fetches the next page of data */
	fetchNextPage: (
		options?: FetchNextPageOptions,
	) => Promise<InfiniteQueryObserverResult>;

	/** Whether the data is fetched */
	isPending: boolean;

	/** Whether the next page is being fetched */
	isFetchingNextPage: boolean;
};

/**
 * A list of subtraction uploads
 */
export function SubtractionFileSelector({
	files,
	foundCount,
	selected,
	onClick,
	error,
	fetchNextPage,
	isPending,
	isFetchingNextPage,
}: SubtractionFileSelectorProps) {
	useValidateFiles(UploadType.subtraction, selected, onClick);

	const items = files.pages.flatMap((page) => page.items);

	function renderRow(item: Upload) {
		return (
			<SubtractionFileItem
				key={item.id}
				{...item}
				active={selected?.includes(item.id)}
				onClick={onClick}
				error={error}
			/>
		);
	}

	return foundCount === 0 ? (
		<NoneFoundBox noun="files">
			<Link to="/subtractions/files">Upload some</Link>
		</NoneFoundBox>
	) : (
		<>
			<CompactScrollList
				className="max-h-96"
				fetchNextPage={fetchNextPage}
				isFetchingNextPage={isFetchingNextPage}
				isPending={isPending}
				items={items}
				renderRow={renderRow}
			/>
			<InputError className="mb-1">{error}</InputError>
		</>
	);
}
