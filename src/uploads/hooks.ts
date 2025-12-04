import { useEffect } from "react";
import { useInfiniteFindFiles } from "./queries";
import { UploadType } from "./types";

/**
 * Hook for validating selected uploads from paginated data
 *
 * @param type - The file type
 * @param selected - The selected file id
 * @param setSelected - A callback function to handle file selection
 */
export function useValidateFiles(
    type: UploadType,
    selected: number[],
    setSelected: (selected: number[]) => void,
) {
    const { data, isPending, fetchNextPage, hasNextPage } =
        useInfiniteFindFiles(type, 25);

    useEffect(() => {
        if (!isPending && selected.length) {
            const documents = data.pages.flatMap((page) => page.items);
            const selectedFilesExist = selected.every((itemId) =>
                documents.some((item) => item.id === itemId),
            );

            if (!selectedFilesExist) {
                void fetchNextPage();
            }

            if (!hasNextPage && !selectedFilesExist) {
                setSelected([]);
            }
        }
    }, [data]);
}
