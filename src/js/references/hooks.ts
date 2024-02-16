import { yupResolver } from "@hookform/resolvers/yup";
import { difference, filter, find, includes, some, union } from "lodash-es";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as Yup from "yup";
import { useFetchAccount } from "../account/querys";
import { AdministratorRoles } from "../administration/types";
import { Request } from "../app/request";
import { getReference } from "./api";
import { Reference, ReferenceTarget } from "./types";

export function useGetReference(refId) {
    return useQuery(["reference", refId], () => getReference(refId));
}

export function useUpdateReference(refId: string, onSuccess?: () => void) {
    const queryClient = useQueryClient();

    const mutation = useMutation(
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

/**
 * Check if the logged in account has the passed `right` on the reference detail is loaded for.
 *
 * @param reference - The reference to check
 * @param right - The right to check for (eg. modify_otu)
 * @returns Whether the right is possessed by the account
 */
export function useCheckReferenceRight(reference: Reference, right: string) {
    const { data: account, isLoading } = useFetchAccount();

    if (isLoading || reference === null) {
        return;
    }

    if (account.administrator_role === AdministratorRoles.FULL) {
        return true;
    }

    const user = find(reference.users, { id: account.id });

    if (user && user[right]) {
        return true;
    }

    // Groups user is a member of.
    const memberGroups = account.groups;

    // Groups in common between the user and the registered ref groups.
    const groups = filter(reference.groups, group => includes(memberGroups, group.id));

    if (!groups) {
        return false;
    }

    return some(groups, { [right]: true });
}

/**
 * Get a boolean indicating whether the logged in account can modify the OTUs of the
 * reference detail is loaded for.
 *
 * The result depends on the account's rights on the reference. It also depends on whether the reference is a remote
 * reference. Remote references cannot be modified by any user.
 *
 * @param reference - The reference to check
 * @returns The OTU modification right of the account
 */
export function useCanModifyReferenceOTU(reference: Reference) {
    const canModifyOTU = useCheckReferenceRight(reference, "modify_otu");
    return !reference.remotes_from && canModifyOTU;
}
