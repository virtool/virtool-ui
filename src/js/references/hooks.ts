import { yupResolver } from "@hookform/resolvers/yup";
import { difference, union } from "lodash-es";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as Yup from "yup";
import { Request } from "../app/request";
import { ErrorResponse } from "../types/types";
import { getReference } from "./api";
import { Reference, ReferenceTarget } from "./types";

export function useGetReference(refId) {
    return useQuery(["reference", refId], () => getReference(refId));
}

export function useUpdateReference(refId: string, onSuccess?: () => void) {
    const queryClient = useQueryClient();

    const mutation = useMutation<Reference, ErrorResponse, unknown>(
        (data: { restrict_source_types?: boolean; targets?: ReferenceTarget[] }) => {
            return Request.patch(`/refs/${refId}`)
                .send(data)
                .then(res => res.body);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["reference", refId]).then(() => onSuccess && onSuccess());
            },
        },
    );

    return { mutation };
}

export function getValidationSchema(sourceTypes: string[]) {
    return Yup.object({
        sourceType: Yup.string()
            .lowercase()
            .notOneOf(sourceTypes, "Source type already exists")
            .test("containsNoSpaces", "Source types may not contain spaces", value => !value.includes(" "))
            .trim(),
    });
}

export function useSourceTypesForm(sourceTypes: string[]) {
    const {
        formState: { errors },
        handleSubmit,
        register,
        reset,
    } = useForm({
        defaultValues: { sourceType: "" },
        resolver: yupResolver(getValidationSchema(sourceTypes)),
    });

    return { errors, handleSubmit, register, reset };
}

export function useUpdateSourceTypes(
    key: "default_source_types" | "source_types",
    path: string,
    queryKey: string | string[],
    sourceTypes: string[],
) {
    const queryClient = useQueryClient();

    const [lastRemoved, setLastRemoved] = useState("");

    const mutation = useMutation(
        (sourceTypes: string[]) => {
            return Request.patch(path).send({ [key]: sourceTypes });
        },
        {
            onSuccess: (data: Response) => {
                const updatedSourceTypes = data.body[key];

                if (sourceTypes.length > updatedSourceTypes) {
                    setLastRemoved(difference(sourceTypes, updatedSourceTypes)[0]);
                } else {
                    setLastRemoved("");
                }

                queryClient.invalidateQueries(queryKey);
            },
        },
    );

    const { errors, handleSubmit, register, reset } = useSourceTypesForm(sourceTypes);

    function handleAdd({ sourceType }) {
        if (sourceType) {
            mutation.mutate(union(sourceTypes, [sourceType]), {
                onSuccess: () => {
                    reset();
                    setLastRemoved("");
                },
            });
        }
    }

    function handleRemove(sourceType) {
        mutation.mutate(
            sourceTypes.filter(s => s !== sourceType),
            {
                onSuccess: () => {
                    setLastRemoved(sourceType);
                },
            },
        );
    }

    function handleUndo() {
        if (lastRemoved) {
            mutation.mutate(union(sourceTypes, [lastRemoved]), {
                onSuccess: () => {
                    setLastRemoved("");
                },
            });
        }
    }

    return {
        error: errors.sourceType?.message,
        lastRemoved,
        mutation,
        handleRemove,
        handleSubmit: handleSubmit(handleAdd),
        handleUndo,
        register,
    };
}
