import { useUpdateUser } from "@administration/queries";
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import InputContainer from "@base/InputContainer";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputSimple from "@base/InputSimple";
import SaveButton from "@base/SaveButton";
import { useForm } from "react-hook-form";

type HandleProps = {
	/** The users unique id */
	id: number;
	/** The users current handle */
	handle: string;
};

type FormValues = {
	handle: string;
};

/**
 * The handle view to change a user's handle
 */
export default function Handle({ id, handle }: HandleProps) {
	const mutation = useUpdateUser();
	const {
		formState: { errors },
		handleSubmit,
		register,
	} = useForm<FormValues>({ defaultValues: { handle } });

	return (
		<BoxGroup>
			<BoxGroupHeader>
				<h2>Change Handle</h2>
				<p>The username this person signs in with.</p>
			</BoxGroupHeader>
			<BoxGroupSection>
				<form
					onSubmit={handleSubmit((values) =>
						mutation.mutate({
							userId: id,
							update: { handle: values.handle },
						}),
					)}
				>
					<InputGroup>
						<InputContainer>
							<InputSimple
								aria-label="handle"
								id="handle"
								autoComplete="off"
								{...register("handle", {
									required: "Please specify a username",
								})}
							/>
							<InputError>
								{errors.handle?.message ||
									(mutation.isError ? mutation.error.message : "")}
							</InputError>
						</InputContainer>
					</InputGroup>

					<div className="flex items-center justify-end">
						<SaveButton />
					</div>
				</form>
			</BoxGroupSection>
		</BoxGroup>
	);
}
