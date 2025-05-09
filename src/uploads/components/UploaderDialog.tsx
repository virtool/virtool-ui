import { formatRoundedDuration } from "@app/utils";
import Badge from "@base/Badge";
import numbro from "numbro";
import React from "react";
import { UploadInProgress } from "../types";
import { UploaderItem } from "./UploaderItem";

type UploaderDialogProps = {
    /** Total upload time remaining in seconds */
    remaining: number;

    /** Current estimated upload speed in bytes */
    speed: number;

    /** The list of uploads */
    uploads: UploadInProgress[];
};

/**
 * A dialog that displays the progress of file uploads.
 *
 * This component is used in `UploadOverlay`, which provides the upload state, controls
 * visibility, and positions the dialog.
 */
export default function UploaderDialog({
    remaining,
    speed,
    uploads,
}: UploaderDialogProps): JSX.Element {
    if (uploads.length === 0) {
        return null;
    }

    const formattedRemaining = formatRoundedDuration(remaining);

    const formattedSpeed = numbro(speed).format({
        base: "decimal",
        mantissa: 1,
        output: "byte",
        spaceSeparated: true,
    });

    return (
        <div className="bg-white border border-slate-400 overflow-hidden rounded-md shadow-lg">
            <div className="bg-slate-300 p-4">
                <div className="flex gap-1.5 font-medium items-center text-xl mb-2">
                    <span>Uploads</span>
                    <Badge>{uploads.length}</Badge>
                </div>
                <div className="flex justify-between">
                    {uploads.every((upload) => upload.progress === 100) ? (
                        <>Finishing uploads</>
                    ) : (
                        <>
                            {formattedRemaining && (
                                <span>{formattedRemaining} remaining</span>
                            )}
                            <span>{formattedSpeed}/s</span>
                        </>
                    )}
                </div>
            </div>
            <div className="max-h-96 overflow-y-scroll">
                {uploads.map((upload) => (
                    <UploaderItem key={upload.localId} {...upload} />
                ))}
            </div>
        </div>
    );
}
