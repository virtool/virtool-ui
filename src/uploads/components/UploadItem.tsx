import { byteSize } from "@app/utils";
import Attribution from "@base/Attribution";
import BoxGroupSection from "@base/BoxGroupSection";
import IconButton from "@base/IconButton";
import RelativeTime from "@base/RelativeTime";
import { UserNested } from "@users/types";
import { Trash } from "lucide-react";
import { useDeleteFile } from "../queries";

export type UploadItemProps = {
    canDelete: boolean;
    id: number;
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

    return (
        <BoxGroupSection>
            <div className="grid grid-cols-3">
                <div className="flex font-medium items-center text-lg">
                    {name}
                </div>
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
                <div className="flex font-medium items-center gap-6 justify-end text-lg">
                    <div>{byteSize(size, true)}</div>
                    {canDelete && (
                        <IconButton
                            color="red"
                            IconComponent={Trash}
                            tip="remove"
                            onClick={() => handleRemove({ id })}
                        />
                    )}
                </div>
            </div>
        </BoxGroupSection>
    );
}
