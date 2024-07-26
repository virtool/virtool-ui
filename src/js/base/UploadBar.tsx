import { Icon } from "@base/Icon";
import { cn } from "@utils/utils";
import React, { useCallback } from "react";
import { FileError, useDropzone } from "react-dropzone";
import { Button } from "./Button";

type UploadBarProps = {
    /* The message to display in the upload bar */
    message?: React.ReactNode;
    /* Whether multiple files can be uploaded */
    multiple?: boolean;
    /* Callback when the upload bar loses focus */
    onBlur?: () => void;
    /* Callback when files are dropped */
    onDrop: (acceptedFiles: File[]) => void;
    /* Validates if a file is allowed */
    validator?: (file: File) => FileError;
};

/*
 * Allows files to be dragged and dropped or selected from the file system.
 */
export function UploadBar({
    message = "Drag file here to upload",
    multiple = true,
    onBlur,
    onDrop,
    validator,
}: UploadBarProps) {
    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            onDrop(acceptedFiles);
        },
        [onDrop]
    );

    const { fileRejections, getRootProps, getInputProps, open } = useDropzone({
        onDrop: handleDrop,
        validator,
    });

    const rootProps = getRootProps({
        onClick: e => e.stopPropagation(),
    });

    return (
        <div
            className={cn("bg-zinc-100", "flex", "flex-col", "items-center", "mb-4", "p-2", "pt-10", "rounded-md")}
            {...rootProps}
        >
            <input {...getInputProps()} aria-label="Upload file" multiple={multiple} />
            <div className="gap-2 grid grid-cols-11 place-items-stretch">
                <div className="col-span-5 flex items-center justify-end">{message}</div>
                <div className="col-span-1 flex font-bold items-center justify-center text-gray-600">OR</div>
                <div className="col-span-5 flex items-center justify-start">
                    <Button color="blue" onBlur={onBlur} onClick={open}>
                        <Icon name="upload" /> Browse Files
                    </Button>
                </div>
            </div>
            <div className="font-medium h-6 mt-4 text-red-600 text-sm">
                {fileRejections.length > 0 &&
                    "Invalid names: " + fileRejections.map(({ file }) => file.name).join(", ")}
            </div>
        </div>
    );
}
