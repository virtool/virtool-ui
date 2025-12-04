import { cn } from "@/app/utils";
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import Button from "@base/Button";
import IconButton from "@base/IconButton";
import Loader from "@base/Loader";
import ProgressCircle from "@base/ProgressCircle";
import RelativeTime from "@base/RelativeTime";
import {
    useCheckReferenceUpdates,
    useUpdateRemoteReference,
} from "@references/queries";
import {
    CircleCheck,
    CircleFadingArrowUp,
    GitFork,
    HardDrive,
} from "lucide-react";

function Release({ release, checking, updating, onCheckUpdates, onUpdate }) {
    const hasUpdate = !updating && release.newer;

    return (
        <BoxGroupSection>
            <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5">
                    <div
                        className={cn("flex items-center gap-1.5", {
                            "text-blue-600": !hasUpdate,
                            "text-green-600": hasUpdate,
                        })}
                    >
                        {release.newer ? (
                            <CircleFadingArrowUp size={18} />
                        ) : (
                            <CircleCheck size={18} />
                        )}
                        <strong>
                            {release.newer ? "Update Available" : "Up-to-date"}
                        </strong>
                    </div>

                    {hasUpdate && (
                        <>
                            <span>/</span>
                            <span>{release.name}</span>
                            <span>/</span>
                            <span>
                                Published{" "}
                                <RelativeTime time={release.published_at} />
                            </span>
                        </>
                    )}
                </div>

                <div className="flex items-center">
                    {release.retrieved_at && (
                        <span>
                            Last checked{" "}
                            <RelativeTime time={release.retrieved_at} />
                        </span>
                    )}
                    {checking ? (
                        <Loader size="14px" />
                    ) : (
                        <IconButton
                            name="sync"
                            onClick={onCheckUpdates}
                            tip="Refresh"
                        />
                    )}
                </div>
            </div>

            {hasUpdate && (
                <div className="m-0 pt-2">
                    <Button color="blue" disabled={updating} onClick={onUpdate}>
                        Install
                    </Button>
                </div>
            )}
        </BoxGroupSection>
    );
}

function Upgrade({ progress }) {
    return (
        <BoxGroupSection className="flex gap-1.5 items-center text-blue-600">
            <ProgressCircle progress={progress} state="pending" />
            <strong>Updating</strong>
        </BoxGroupSection>
    );
}

export default function Remote({ detail }) {
    const { id, installed, release, remotes_from, updating, task } = detail;

    const slug = remotes_from.slug;

    const {
        mutate: checkReferenceUpdate,
        isPending: isPendingReferenceUpdate,
    } = useCheckReferenceUpdates(id);
    const { mutate: updateRemoteReference } = useUpdateRemoteReference(id);

    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2 className="flex items-center justify-between">
                    Remote Reference
                    <a
                        className="flex gap-1 items-center text-base"
                        href={`https://github.com/${slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <GitFork size={18} />
                        {slug}
                    </a>
                </h2>
            </BoxGroupHeader>

            {installed && (
                <BoxGroupSection className="flex items-center gap-1.5">
                    <HardDrive size={18} />
                    <strong>Installed Version</strong>
                    <span>/</span>
                    <span>{installed.name}</span>
                    <span>/</span>
                    <span>Published</span>
                    <RelativeTime time={installed.published_at} />
                </BoxGroupSection>
            )}

            {updating ? (
                <Upgrade progress={task.progress} />
            ) : (
                <Release
                    release={release}
                    checking={isPendingReferenceUpdate}
                    updating={updating}
                    onCheckUpdates={checkReferenceUpdate}
                    onUpdate={updateRemoteReference}
                />
            )}
        </BoxGroup>
    );
}
