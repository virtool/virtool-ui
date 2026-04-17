import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import Box from "@base/Box";
import Button from "@base/Button";
import ExternalLink from "@base/ExternalLink";
import Icon from "@base/Icon";
import { CloudDownload } from "lucide-react";
import { useRemoteReference } from "../queries";

type ReferenceOfficialProps = {
	officialInstalled: boolean;
};

/**
 * Displays a component to install the official reference from Virtool's repository
 */
export default function ReferenceOfficial({
	officialInstalled,
}: ReferenceOfficialProps) {
	const { hasPermission } = useCheckAdminRoleOrPermission("create_ref");
	const mutation = useRemoteReference();
	const show = !officialInstalled && hasPermission;

	return show ? (
		<Box className="flex items-center">
			<div>
				<h5 className="text-base font-medium">Official Reference</h5>
				<p>
					<span>We have published an official </span>
					<ExternalLink href="https://github.com/virtool/ref-plant-viruses">
						plant virus reference
					</ExternalLink>
					<span>
						{" "}
						that can be installed automatically. Once installed, it can easily
						be kept up-to-date.
					</span>
				</p>
			</div>
			<Button
				className="ml-auto"
				color="blue"
				onClick={() =>
					mutation.mutate({
						remotes_from: "virtool/ref-plant-viruses",
					})
				}
			>
				<Icon icon={CloudDownload} /> Install
			</Button>
		</Box>
	) : null;
}
