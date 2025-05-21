import { byteSize } from "@app/utils";
import Attribution from "@base/Attribution";
import BoxGroupSection from "@base/BoxGroupSection";
import IconButton from "@base/IconButton";
import RelativeTime from "@base/RelativeTime";
import { UserNested } from "@users/types";
import React, { useCallback } from "react";
import { useDeleteFile } from "../queries";

export type UploadItemProps = {
    canDelete: boolean;
    id: string;
    name: string;
    size: number;
    uploaded_at: string;
    user: UserNested;
};

export default function UploadItem({
    canDelete,
    id,
    name,
    size,
    uploaded_at,
    user,
}: UploadItemProps) {
    const { mutate: handleRemove } = useDeleteFile();

    const handleDelete = useCallback(() => {
        handleRemove({ id });
    }, [handleRemove, id]);

    return (
        <BoxGroupSection>
            <div className="grid grid-cols-3">
                <div className="font-medium text-lg">{name}</div>
                <div className="flex">
                    {user === null ? (
                        <span>
                            Retrieved <RelativeTime time={uploaded_at} />
                        </span>
                    ) : (
                        <>
                            <Attribution
                                time={uploaded_at}
                                user={user.handle}
                                verb="uploaded"
                            />
                        </>
                    )}
                </div>
                <div className="flex font-medium gap-6 justify-end text-lg">
                    <span>{byteSize(size, true)}</span>
                    {canDelete && (
                        <IconButton
                            color="red"
                            name="trash"
                            tip="remove"
                            onClick={handleDelete}
                        />
                    )}
                </div>
            </div>
        </BoxGroupSection>
    );
}
