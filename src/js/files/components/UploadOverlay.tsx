import UploaderDialog from "@files/components/UploaderDialog";
import { useUploaderStore } from "@files/uploader";
import { cn } from "@utils/utils";
import React from "react";

/**
 * Overlay uploads with their progress and speeds.
 */
export default function UploadOverlay(): JSX.Element | null {
    const uploads = useUploaderStore(state => state.uploads);
    const remaining = useUploaderStore(state => state.remaining);
    const speed = useUploaderStore(state => state.speed);

    if (uploads.length === 0) {
        return null;
    }

    return (
        <div className={cn("fixed bottom-0 right-0 w-96 pr-4 pb-4 z-50")}>
            <UploaderDialog remaining={remaining} speed={speed} uploads={uploads} />
        </div>
    );
}
