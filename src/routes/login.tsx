import { createFileRoute } from "@tanstack/react-router";
import LoginWall from "@wall/components/LoginWall";

export const Route = createFileRoute("/login")({
	component: LoginWall,
});
