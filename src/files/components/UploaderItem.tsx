import { byteSize, cn } from "../../app/utils";
import IconButton from "../../base/IconButton";
import Loader from "../../base/Loader";
import ProgressBarAffixed from "../../base/ProgressBarAffixed";
import { useUploaderStore } from "../uploader";
import React from "react";

type UploadItemProps = {
    /* Whether the upload failed */
    failed: boolean;

    /* Local id of the file being uploaded */
    localId: string;

    /* Name of the file being uploaded */
    name: string;

    /* Progress of the upload in percentage */
    progress: number;

    /* Size of the file being uploaded */
    size: number;
};

/**
 * Progress tracker for a single uploaded file
 */
export function UploaderItem({
    failed,
    localId,
    name,
    progress,
    size,
}: UploadItemProps): JSX.Element {
    const removeUpload = useUploaderStore((state) => state.removeUpload);

    let end: React.ReactNode;

    if (failed) {
        end = (
            <span className="flex font-medium gap-2">
                <span>Failed</span>
                <IconButton
                    name="trash"
                    color="red"
                    tip="remove"
                    onClick={() => removeUpload(localId)}
                />
            </span>
        );
    } else if (progress === 100) {
        end = <Loader size="14px" />;
    } else {
        end = byteSize(size, true);
    }

    return (
        <div className="relative p-0">
            <ProgressBarAffixed
                now={progress}
                color={failed ? "red" : "blue"}
            />
            <div className="flex justify-between p-4">
                <span className="font-medium">{name}</span>
                <span
                    className={cn({
                        "text-red-500": failed,
                        "text-gray-500": !failed,
                    })}
                >
                    {end}
                </span>
            </div>
        </div>
    );
}
