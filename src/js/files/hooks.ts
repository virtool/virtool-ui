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

    function getData() {
        if (hasNextPage) {
            void fetchNextPage();
        }
        return data.pages.flatMap(page => page.items);
    }

    useEffect(() => {
        if (!isLoading && selected.length) {
            const documents = getData();

            if (!hasNextPage) {
                const matchingDocument = documents.find(item => selected.includes(item.id));

                if (matchingDocument) {
                    setSelected([matchingDocument.id]);
                } else {
                    setSelected([]);
                }
            }
        }
    }, [data]);
}
