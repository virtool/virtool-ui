import {
    BoxGroup,
    BoxGroupHeader,
    BoxGroupSection,
    Button,
    Icon,
    IconButton,
    Loader,
    ProgressCircle,
    RelativeTime,
} from "@base";
import { JobState } from "@jobs/types";
import { cn } from "@utils/utils";
import React from "react";
import {
    useCheckReferenceUpdates,
    useUpdateRemoteReference,
} from "../../queries";

function Release({ release, checking, updating, onCheckUpdates, onUpdate }) {
    const hasUpdate = !updating && release.newer;

    const colorClassname = cn({
        "text-green-600": release.newer,
        "text-blue-600": !release.newer,
    });

    return (
        <BoxGroupSection>
            <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5">
                    <Icon
                        className={colorClassname}
                        name={release.newer ? "arrow-alt-circle-up" : "check"}
                    />
                    <strong className={colorClassname}>
                        {release.newer ? "Update Available" : "Up-to-date"}
                    </strong>

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
            <ProgressCircle progress={progress} state={JobState.running} />
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
                        className="text-base"
                        href={`https://github.com/${slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Icon faStyle="fab" name="github" /> {slug}
                    </a>
                </h2>
            </BoxGroupHeader>

            {installed && (
                <BoxGroupSection>
                    <div className="flex items-center gap-1.5">
                        <Icon name="hdd" />
                        <strong>Installed Version</strong>
                        <span>/</span>
                        <span>{installed.name}</span>
                        <span>/</span>
                        <span>Published</span>
                        <RelativeTime time={installed.published_at} />
                    </div>
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
