import ExternalLink from "@base/ExternalLink";
import SectionHeader from "@base/SectionHeader";
import { useUpdateSettings } from "../queries";
import type { Settings } from "../types";
import SettingsCheckbox from "./SettingsCheckbox";

type ApiProps = {
	/** The settings data used for configuring the external API access */
	settings: Settings;
};

/**
 * A component managing JSON API settings, allowing users to toggle external API access
 */
export default function Api({ settings: { enable_api } }: ApiProps) {
	const mutation = useUpdateSettings();

	return (
		<section>
			<SectionHeader>
				<h2>JSON API</h2>
				<p>
					Enable API access for clients other than Virtool. See{" "}
					<ExternalLink href="https://www.virtool.ca/docs/api/overview/authentication/">
						API documentation
					</ExternalLink>
					.
				</p>
			</SectionHeader>
			<SettingsCheckbox
				enabled={enable_api}
				id="EnableApi"
				onToggle={() => mutation.mutate({ enable_api: !enable_api })}
			>
				<h2>Enable API</h2>
				<small>Allow non-Virtool clients to access the JSON API.</small>
			</SettingsCheckbox>
		</section>
	);
}
