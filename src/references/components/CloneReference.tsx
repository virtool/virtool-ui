import Attribution from "@base/Attribution";
import Badge from "@base/Badge";
import Box from "@base/Box";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@base/Dialog";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import PseudoLabel from "@base/PseudoLabel";
import SaveButton from "@base/SaveButton";
import { useCloneReference } from "@references/queries";
import type { ReferenceMinimal } from "@references/types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
	name: string;
};

type CloneReferenceProps = {
	cloneReferenceId?: string;
	/** A list of minimal references */
	references: ReferenceMinimal[];
	unsetCloneReferenceId: () => void;
};

/**
 * Displays a form used for creating a clone of a reference
 */
export default function CloneReference({
	cloneReferenceId,
	references,
	unsetCloneReferenceId,
}: CloneReferenceProps) {
	const {
		formState: { errors },
		register,
		handleSubmit,
		setValue,
	} = useForm<FormValues>();

	const mutation = useCloneReference();

	const reference = references.find(
		(reference) => reference.id === cloneReferenceId,
	);

	useEffect(() => {
		if (reference) {
			setValue("name", `Clone of ${reference.name}`);
		}
	}, [reference, setValue]);

	function onSubmit({ name }: FormValues) {
		mutation.mutate(
			{
				name,
				description: `Cloned from ${reference.name}`,
				refId: reference.id,
			},
			{
				onSuccess: () => {
					unsetCloneReferenceId();
				},
			},
		);
	}

	return (
		<Dialog
			onOpenChange={() => unsetCloneReferenceId()}
			open={Boolean(cloneReferenceId)}
		>
			<DialogContent>
				<DialogTitle>Clone Reference</DialogTitle>
				<form onSubmit={handleSubmit(onSubmit)}>
					<PseudoLabel>Selected reference</PseudoLabel>
					{reference && (
						<Box className="flex items-center">
							<strong>{reference.name}</strong>
							<Badge className="ml-1.5">{reference.otu_count} OTUs</Badge>
							<Attribution
								className="ml-auto"
								time={reference.created_at}
								user={reference.user.handle}
							/>
						</Box>
					)}
					<InputGroup>
						<InputLabel htmlFor="name">Name</InputLabel>
						<InputSimple
							id="name"
							{...register("name", {
								required: "Required Field",
							})}
						/>
						<InputError>{errors.name?.message}</InputError>
					</InputGroup>
					<DialogFooter>
						<SaveButton disabled={!references.length} altText="Clone" />
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
