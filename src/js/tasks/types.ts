export type Task = {
    complete: boolean;
    /** The iso formatted date of creation */
    created_at: string;
    error: string | null;
    id: number;
    progress: number;
    step: string;
    type: string;
};
