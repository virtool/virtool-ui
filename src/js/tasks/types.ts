export type Task = {
    complete: boolean;
    created_at: Date;
    error: string | null;
    id: number;
    progress: number;
    step: string;
    type: string;
};
