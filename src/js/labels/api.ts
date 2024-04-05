import { Label } from "@labels/types";
import { Request } from "../app/request";

export const listLabels = () => Request.get("/labels");

/**
 * Fetch a list of labels
 *
 * @returns A promise resolving to a list of labels
 */
export function fetchLabels(): Promise<Label[]> {
    return Request.get("/labels").then(res => res.body);
}

/**
 * Creates a label
 *
 * @param name - The name of the label
 * @param description - The description of the subtraction
 * @param color - The hex encoded color for the label
 * @returns A promise resolving to creating a label
 */
export function createLabel(name: string, description: string, color: string): Promise<Label> {
    return Request.post("/labels")
        .send({
            name,
            description,
            color,
        })
        .then(res => res.body);
}

/**
 * Updates the data for the label
 *
 * @param labelId - The id of the label to be updated
 * @param name - The updated name of the label
 * @param description - The updated description of the label
 * @param color - The updated color of the label
 * @returns A promise resolving to updating a label
 */
export function updateLabel(labelId: number, name: string, description: string, color: string): Promise<Label> {
    return Request.patch(`/labels/${labelId}`)
        .send({
            name,
            description,
            color,
        })
        .then(res => res.body);
}

/**
 * Removes a label
 *
 * @param labelId - The id of the label to be removed
 * @returns A promise resolving to removing a label
 */
export function removeLabel(labelId: number): Promise<null> {
    return Request.delete(`/labels/${labelId}`).then(res => res.body);
}
