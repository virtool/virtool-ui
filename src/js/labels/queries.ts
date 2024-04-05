import { ErrorResponse } from "@/types/types";
import { Label } from "@labels/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createLabel, fetchLabels, removeLabel, updateLabel } from "./api";

export const labelQueryKeys = {
    all: () => ["label"] as const,
    lists: () => ["label", "list"] as const,
    list: (filters: Array<string | number | boolean>) => ["label", "list", "single", ...filters] as const,
};

/**
 * Fetch a list of labels from the API
 *
 * @returns A list of labels
 */
export function useFetchLabels() {
    return useQuery<Label[]>(labelQueryKeys.list([]), fetchLabels);
}

/**
 * Initializes a mutator for creating a label
 *
 * @returns A mutator for creating a label
 */
export function useCreateLabel() {
    return useMutation<Label, ErrorResponse, { name: string; description: string; color: string }>(
        ({ name, description, color }) => createLabel(name, description, color),
    );
}

/**
 * Initializes a mutator for updating a label
 *
 * @returns A mutator for updating a label
 */
export function useUpdateLabel() {
    return useMutation<Label, unknown, { labelId: number; name: string; description: string; color: string }>(
        ({ labelId, name, description, color }) => updateLabel(labelId, name, description, color),
    );
}

/**
 * Initializes a mutator for removing a label
 *
 * @returns A mutator for removing a label
 */
export function useRemoveLabel() {
    return useMutation<null, unknown, { labelId: number }>(({ labelId }) => removeLabel(labelId));
}
