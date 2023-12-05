import { useEffect } from "react";
import { useInfiniteFindFiles } from "./querys";
import { FileType } from "./types";

/**
 * Hook for validating selected files from paginated data
 *
 * @param type - The file type
 * @param selected - The selected file id
 * @param setSelected - A callback function to handle file selection
 */
export function useValidateFiles(type: FileType, selected: string[], setSelected: (selected: string[]) => void) {
    const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteFindFiles(type, 25);

    useEffect(() => {
        if (!isLoading && selected.length) {
            if (hasNextPage) {
                void fetchNextPage();
            }
            const documents = data.pages.flatMap(page => page.items);

            if (!hasNextPage) {
                const matchingIds = documents.filter(item => selected.includes(item.id)).map(item => item.id);

                matchingIds ? setSelected(matchingIds) : setSelected([]);
            }
        }
    }, [data]);
}
