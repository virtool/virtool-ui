import Button from "@base/Button";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import { usePasswordRules } from "@forms/password";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useCreateFirstUser } from "../queries";
import { WallContainer } from "./WallContainer";
import { WallTitle } from "./WallTitle";

type FormValues = {
	username: string;
	password: string;
};

/**
 * A form for creating the first instance user
 */
export default function FirstUser() {
	const mutation = useCreateFirstUser();
	const navigate = useNavigate();
	const passwordRules = usePasswordRules();

	const {
		formState: { errors },
		handleSubmit,
		register,
	} = useForm<FormValues>();

	function onSubmit(data: FormValues) {
		mutation.mutate(
			{ handle: data.username, password: data.password },
			{ onSuccess: () => navigate({ to: "/" }) },
		);
	}

	return (
		<WallContainer>
			<WallTitle
				title="Create First User"
				subtitle="Create an administrative user that can be used to configure your new Virtool instance."
			/>

			<form onSubmit={handleSubmit(onSubmit)}>
				<InputGroup>
					<InputLabel htmlFor="username">Username</InputLabel>
					<InputSimple
						aria-label="username"
						id="username"
						autoComplete="username"
						{...register("username", { required: true })}
					/>
				</InputGroup>
				<InputGroup>
					<InputLabel htmlFor="password">Password</InputLabel>
					<InputSimple
						aria-label="password"
						id="password"
						type="password"
						autoComplete="new-password"
						{...register("password", passwordRules)}
					/>
					{errors.password?.message && (
						<InputError>{errors.password.message}</InputError>
					)}
				</InputGroup>

				<Button type="submit" color="blue">
					Create User
				</Button>
				{mutation.isError && (
					<InputError>
						{mutation.error.message || "Could not create user"}
					</InputError>
				)}
			</form>
		</WallContainer>
	);
}
