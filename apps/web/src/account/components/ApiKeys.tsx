import { cn } from "@app/utils";
import BoxGroup from "@base/BoxGroup";
import Button from "@base/Button";
import ExternalLink from "@base/ExternalLink";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import { useFetchAPIKeys } from "../queries";
import ApiKey from "./ApiKey";
import ApiKeyCreate from "./ApiKeyCreate";

type ApiKeysProps = {
	openCreateKey?: boolean;
	setOpenCreateKey?: (open: boolean) => void;
};

/**
 * A component to manage and display API keys
 */
export default function ApiKeys({
	openCreateKey = false,
	setOpenCreateKey = () => {},
}: ApiKeysProps) {
	const { data, isPending } = useFetchAPIKeys();

	if (isPending) {
		return <LoadingPlaceholder className="mt-36" />;
	}

	const keyComponents =
		data.length && data.map((key) => <ApiKey key={key.id} apiKey={key} />);

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
				<Button color="blue" onClick={() => setOpenCreateKey(true)}>
					Create
				</Button>
			</header>

			{keyComponents.length ? (
				<BoxGroup>{keyComponents}</BoxGroup>
			) : (
				<NoneFoundBox noun="API keys" />
			)}

			<ApiKeyCreate open={openCreateKey} setOpen={setOpenCreateKey} />
		</div>
	);
}
