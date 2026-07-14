import Alert from "@base/Alert";
import { getRouteApi } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import LoginForm from "./LoginForm";
import ResetForm from "./ResetForm";
import { WallContainer } from "./WallContainer";

const loginRouteApi = getRouteApi("/login");

export default function LoginWall() {
	const [resetCode, setResetCode] = useState<string | null>(null);
	const { reason, redirect } = loginRouteApi.useSearch();

	return (
		<WallContainer>
			{reason === "session-ended" && (
				<Alert color="orange" icon={TriangleAlert} level>
					Your session ended. Please log in again.
				</Alert>
			)}
			{resetCode ? (
				<ResetForm redirect={redirect} resetCode={resetCode} />
			) : (
				<LoginForm redirect={redirect} setResetCode={setResetCode} />
			)}
		</WallContainer>
	);
}
