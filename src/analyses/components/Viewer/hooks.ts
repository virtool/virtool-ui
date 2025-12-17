import { Virtualizer } from "@tanstack/react-virtual";
import { useEffect } from "react";

export function useKeyNavigation(
    virtualizer: Virtualizer<HTMLDivElement, Element>,
    nextId: string | undefined,
    nextIndex: number | undefined,
    previousId: string | undefined,
    previousIndex: number | undefined,
    onSetActiveId: (id: string) => void,
) {
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
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
        };

        window.addEventListener("keydown", handleKeyPress, true);
        return () => {
            window.removeEventListener("keydown", handleKeyPress, true);
        };
    }, [
        virtualizer,
        nextId,
        nextIndex,
        previousId,
        previousIndex,
        onSetActiveId,
    ]);
}
