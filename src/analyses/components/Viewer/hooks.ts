import { Virtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect } from "react";

export function useKeyNavigation(
    virtualizer: Virtualizer<HTMLDivElement, Element>,
    nextId: string | undefined,
    nextIndex: number | undefined,
    previousId: string | undefined,
    previousIndex: number | undefined,
    onSetActiveId: (id: string) => void,
) {
    const handleKeyPress = useCallback(
        (e: KeyboardEvent) => {
            if (e.target !== window.document.body) {
                return;
            }

            if (e.key === "w" && previousIndex !== undefined) {
                virtualizer.scrollToIndex(previousIndex);
                onSetActiveId(previousId);
            } else if (e.key === "s" && nextIndex !== undefined) {
                virtualizer.scrollToIndex(nextIndex);
                onSetActiveId(nextId);
            }
        },
        [
            virtualizer,
            nextId,
            nextIndex,
            previousId,
            previousIndex,
            onSetActiveId,
        ],
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress, true);
        return () => {
            window.removeEventListener("keydown", handleKeyPress, true);
        };
    }, [handleKeyPress]);
}
