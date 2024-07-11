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
    deactivateUser?: boolean;
    editReference?: boolean;
    editSequence?: boolean;
    export?: boolean;
    devCommands?: boolean;
    reactivateUser?: boolean;
};
