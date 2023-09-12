/* A partial label including essentials for rendering a list of labels */
export type LabelNested = {
    /* The hex encoded color */
    color: string;
    /* The detailed description */
    description: string;
    /* The unique identifier */
    id: number;
    name: string;
};

/* A sample label */
export type Label = LabelNested & {
    /* The number of samples the label is associated with */
    count: number;
};
