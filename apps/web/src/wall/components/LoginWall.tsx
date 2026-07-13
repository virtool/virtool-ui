import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import LoginForm from "./LoginForm";
import ResetForm from "./ResetForm";
import { WallContainer } from "./WallContainer";

const loginRouteApi = getRouteApi("/login");

export default function LoginWall() {
	const [resetCode, setResetCode] = useState<string | null>(null);
	const { redirect } = loginRouteApi.useSearch();

	return (
		<WallContainer>
			{resetCode ? (
				<ResetForm redirect={redirect} resetCode={resetCode} />
			) : (
				<LoginForm redirect={redirect} setResetCode={setResetCode} />
			)}
		</WallContainer>
	);
}
