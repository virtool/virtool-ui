export type ErrorResponse = {
    response: {
        status: number;
        notFound: boolean;
        statusText: string;
        badRequest: boolean;
        statusCode: number;
        body: { [key: string]: any };
    };
};

export type LocationType = {
    activeIsolateId?: string;
    addSequence?: boolean;
    activeHitId?: number;
    cloneReference?: string;
    createReference?: boolean;
    createSubtraction?: boolean;
    editIsolate?: boolean;
    deactivateUser?: boolean;
    editReference?: boolean;
    editSequence?: boolean;
    emptyReference?: boolean;
    export?: boolean;
    devCommands?: boolean;
    importReference?: boolean;
    removeIsolate?: boolean;
    removeSequence?: string;
    reactivateUser?: boolean;
};
