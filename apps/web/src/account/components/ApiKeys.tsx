import { cn } from "@app/utils";
import Box from "@base/Box";
import BoxGroup from "@base/BoxGroup";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@base/Empty";
import ExternalLink from "@base/ExternalLink";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import QueryError from "@base/QueryError";
import { KeyRound } from "lucide-react";
import { useFetchAPIKeys } from "../queries";
import ApiKey from "./ApiKey";
import ApiKeyCreate from "./ApiKeyCreate";

/**
 * A component to manage and display API keys
 */
export default function ApiKeys() {
	const { data, isPending, isError } = useFetchAPIKeys();

	if (isError && !data) {
		return <QueryError noun="API keys" />;
	}

	if (isPending) {
		return <LoadingPlaceholder className="mt-36" />;
	}

	const keyComponents = data.map((key) => <ApiKey key={key.id} apiKey={key} />);

	return (
		<div>
			<header
				className={cn(
					"flex",
					"font-medium",
					"items-center",
					"justify-between",
					"mb-4",
					"text-lg",
				)}
			>
				<h3>
					Manage API keys for accessing the{" "}
					<ExternalLink href="https://www.virtool.ca/docs/developer/api_account/">
						Virtool API
					</ExternalLink>
					.
				</h3>
				<ApiKeyCreate />
			</header>

			{keyComponents.length ? (
				<BoxGroup>{keyComponents}</BoxGroup>
			) : (
				<Box>
					<Empty className="h-72">
						<EmptyMedia className="text-gray-400">
							<KeyRound size={40} strokeWidth={1.5} />
						</EmptyMedia>
						<EmptyTitle>No API keys found</EmptyTitle>
						<EmptyDescription>
							You have not created any API keys yet.
						</EmptyDescription>
					</Empty>
				</Box>
			)}
		</div>
	);
}
