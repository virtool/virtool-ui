/**
 * Initiate and track uploads using Zustand.
 */
import { Request } from "@app/request";
import { FileType, Upload } from "@files/types";
import { createRandomString } from "@utils/utils";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface UploaderState {
    /** The ID of the interval that tracks the upload progress. */
    intervalId?: number;

    /** The list of uploads. */
    uploads: Upload[];

    /** The remaining time for all uploads in seconds. */
    remaining: number;

    /** The samples of the loaded bytes for the uploads. Used to estimate speed and time remaining. */
    samples: number[];

    /** The current estimated upload speed in bytes per second. */
    speed: number;

    /** Add an upload to the list of uploads. */
    addUpload: (file: Upload) => void;

    /** Remove an upload from the list of uploads. */
    removeUpload: (localId: string) => void;

    /** Set an upload as failed. */
    setFailure: (localId: string) => void;

    /** Set the progress of an upload. */
    setProgress: (localId: string, loaded: number, progress: number) => void;
}

/**
 * Zustand store to track the current uploads and their progress.
 */
export const useUploaderStore = create<UploaderState>()(
    subscribeWithSelector(set => ({
        intervalId: 0,
        uploads: [],
        remaining: 0,
        samples: [],
        speed: 0,
        addUpload: upload => set(state => ({ uploads: [...state.uploads, upload] })),
        removeUpload: localId =>
            set(state => {
                const uploads = state.uploads.filter(upload => upload.localId !== localId);
                return uploads.length === 0 ? { uploads, remaining: 0, speed: 0 } : { uploads };
            }),
        setFailure: localId =>
            set(state => ({
                uploads: state.uploads.map(upload =>
                    upload.localId === localId ? { ...upload, failed: true } : upload
                ),
            })),
        setProgress: (localId, loaded, progress) =>
            set(state => ({
                uploads: state.uploads.map(upload =>
                    upload.localId === localId ? { ...upload, loaded, progress } : upload
                ),
            })),
    }))
);

/**
 * Upload a file to Virtool server.
 *
 * This function ties in with the Zustand store `useUploaderStore` to track the progress of the upload.
 */
export function upload(file: File, fileType: FileType) {
    const { name, size } = file;
    const localId = createRandomString();

    useUploaderStore.getState().addUpload({
        failed: false,
        fileType,
        loaded: 0,
        localId,
        name,
        progress: 0,
        size,
    });

    function onProgress(e: ProgressEvent) {
        if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            useUploaderStore.getState().setProgress(localId, e.loaded, progress);
        }
    }

    Request.post("/uploads")
        .query({ name: file.name, type: fileType })
        .attach("file", file)
        .on("progress", onProgress)
        .then(() => useUploaderStore.getState().removeUpload(localId))
        .catch(() => useUploaderStore.getState().setFailure(localId));
}

/**
 * Update the remaining time and speed of the uploads every 500 milliseconds.
 * Poll the uploads to calculate the remaining time and speed of the uploads.
 */
function watchUploadTiming(): void {
    const { getState, setState } = useUploaderStore;
    const { samples, uploads } = getState();

    if (uploads.every(upload => upload.progress === 100)) {
        return;
    }

    const { loaded, total } = uploads.reduce(
        (acc, upload) => ({
            loaded: acc.loaded + upload.loaded,
            total: acc.total + upload.size,
        }),
        { loaded: 0, total: 0 }
    );

    const newSamples = [...samples.slice(-9), loaded];

    let speed: number;

    if (newSamples.length > 1) {
        speed = Math.abs(newSamples[newSamples.length - 1] - newSamples[0]) / newSamples.length;
    } else {
        speed = 0;
    }

    setState({ remaining: speed > 0 ? (total - loaded) / speed : 0, samples: newSamples, speed });
}

useUploaderStore.subscribe(
    state => state.uploads.length,
    (uploadsLength, previousUploadsLength) => {
        const { getState, setState } = useUploaderStore;

        if (uploadsLength === 0 && previousUploadsLength > 0) {
            window.clearInterval(getState().intervalId);
            setState({ intervalId: 0, remaining: 0, samples: [], speed: 0 });
        } else {
            const intervalId = window.setInterval(() => {
                watchUploadTiming();
            }, 500);

            setState({ intervalId });
        }
    }
);
