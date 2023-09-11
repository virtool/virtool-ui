/* Smaller label object for representing labels in a list */
export type LabelNested = {
    /* A hex encoded color */
    color: string;
    /* A detailed description */
    description: string;
    /* A unique identifier */
    id: number;
    /* A name for the label */
    name: string;
};

/* A label object that extends LabelNested */
export type Label = LabelNested & {
    /* The count associated with the label */
    count: number;
};
