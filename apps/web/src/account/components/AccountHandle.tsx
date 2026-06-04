import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import SaveButton from "@base/SaveButton";
import { useForm } from "react-hook-form";
import { useUpdateHandle } from "../queries";

type FormValues = {
	handle: string;
};

type HandleProps = {
	/** The users current handle */
	handle: string;
};

/**
 * A component to update the account's handle
 */
export default function AccountHandle({ handle }: HandleProps) {
	const {
		formState: { errors },
		handleSubmit,
		register,
	} = useForm<FormValues>({ defaultValues: { handle } });
	const mutation = useUpdateHandle();

	function onSubmit(values: FormValues) {
		mutation.mutate({ handle: values.handle });
	}

	return (
		<BoxGroup>
			<BoxGroupHeader>
				<h2>Handle</h2>
			</BoxGroupHeader>
			<form onSubmit={handleSubmit(onSubmit)}>
				<BoxGroupSection>
					<InputGroup>
						<InputLabel htmlFor="handle">Username</InputLabel>
						<InputSimple
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
					</InputGroup>
					<footer className="flex items-center justify-end mb-4">
						<SaveButton altText="Change" />
					</footer>
				</BoxGroupSection>
			</form>
		</BoxGroup>
	);
}
