import { zodResolver } from "@hookform/resolvers/zod";
import type { UseMutateFunction } from "@tanstack/react-query";
import { union } from "es-toolkit/array";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

function getValidationSchema(sourceTypes: string[]) {
	return z.object({
		sourceType: z
			.string()
			.transform((val) => val.toLowerCase().trim())
			.refine(
				(val) => !val.includes(" "),
				"Source types may not contain spaces",
			)
			.refine(
				(val) => !sourceTypes.includes(val),
				"Source type already exists",
			),
	});
}

/**
 * A mutator that replaces a source type list wholesale, as returned by
 * `useUpdateReferenceSourceTypes` or `useUpdateDefaultSourceTypes`.
 */
type UpdateSourceTypes = UseMutateFunction<unknown, unknown, string[], unknown>;

/**
 * Drives the add / remove / undo form shared by the reference and default
 * source type editors.
 *
 * The caller supplies the `mutate` of whichever update mutation writes its
 * list. Every write sends the complete list, so this derives the next list from
 * `sourceTypes` and hands it over.
 *
 * @param sourceTypes - The source types currently on the server
 * @param mutate - Replaces the stored list with the one passed to it
 */
export default function useSourceTypeEditor(
	sourceTypes: string[],
	mutate: UpdateSourceTypes,
) {
	const [lastRemoved, setLastRemoved] = useState("");

	const {
		formState: { errors },
		handleSubmit,
		register,
		reset,
	} = useForm({
		defaultValues: { sourceType: "" },
		resolver: zodResolver(getValidationSchema(sourceTypes)),
	});

	function handleAdd({ sourceType }: { sourceType: string }) {
		if (sourceType) {
			mutate(union(sourceTypes, [sourceType]), {
				onSuccess: () => {
					reset();
					setLastRemoved("");
				},
			});
		}
	}

	function handleRemove(sourceType: string) {
		mutate(
			sourceTypes.filter((s) => s !== sourceType),
			{
				onSuccess: () => {
					setLastRemoved(sourceType);
				},
			},
		);
	}

	function handleUndo() {
		if (lastRemoved) {
			mutate(union(sourceTypes, [lastRemoved]), {
				onSuccess: () => {
					setLastRemoved("");
				},
			});
		}
	}

	return {
		error: errors.sourceType?.message,
		lastRemoved,
		handleRemove,
		handleSubmit: handleSubmit(handleAdd),
		handleUndo,
		register,
	};
}
