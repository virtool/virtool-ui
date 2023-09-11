/**
 * LabelNested
 * @prop color - the color of the label
 * @prop description - the description of the label
 * @prop id - the unique identifier of the label
 * @prop name - the name of the label
 */
export type LabelNested = {
    color: string;
    description: string;
    id: number;
    name: string;
};

/**
 * Label
 * @extends LabelNested
 * @prop count - the count associated with the label
 */
export type Label = LabelNested & {
    count: number;
};
