import { createFileRoute } from "@tanstack/react-router";
import FirstUser from "@wall/components/FirstUser";

export const Route = createFileRoute("/setup")({
	component: FirstUser,
});
