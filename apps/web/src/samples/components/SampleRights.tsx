import { useUpdateSettings } from "@administration/queries";
import type { Settings } from "@administration/types";
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import { SelectBox, SelectBoxItem } from "@base/SelectBox";
import RightsSelect from "./RightsSelect";

type SampleRightsProps = {
	/** The settings data used for configuring sample rights */
	settings: Settings;
};

/**
 * A component managing sample settings, allowing users to configure sample rights
 */
export default function SampleRights({ settings }: SampleRightsProps) {
	const mutation = useUpdateSettings();

	const {
		sample_group,
		sample_group_read,
		sample_group_write,
		sample_all_read,
		sample_all_write,
	} = settings;

	const group =
		(sample_group_read ? "r" : "") + (sample_group_write ? "w" : "");
	const all = (sample_all_read ? "r" : "") + (sample_all_write ? "w" : "");

	return (
		<BoxGroup>
			<BoxGroupHeader>
				<h2>Default Sample Rights</h2>
				<p>
					Set the method used to assign groups to new samples and the default
					rights.
				</p>
			</BoxGroupHeader>
			<BoxGroupSection>
				<SelectBox
					className="grid-cols-3"
					label="Sample Group"
					onValueChange={(value) => mutation.mutate({ sample_group: value })}
					value={sample_group}
				>
					<SelectBoxItem value="none">
						<strong>None</strong>
						<p>
							Samples are assigned no group and only
							<em> all {"users'"}</em> rights apply
						</p>
					</SelectBoxItem>
					<SelectBoxItem value="force_choice">
						<strong>Force choice</strong>
						<p>
							Samples are automatically assigned the creating
							{"user's"} primary group
						</p>
					</SelectBoxItem>
					<SelectBoxItem value="users_primary_group">
						<strong>{"User's"} primary group</strong>
						<p>Samples are assigned by the user in the creation form</p>
					</SelectBoxItem>
				</SelectBox>

				<InputGroup>
					<InputLabel htmlFor="group">Group Rights</InputLabel>
					<RightsSelect
						id="group"
						value={group}
						onChange={(value) =>
							mutation.mutate({
								sample_group_read: value.includes("r"),
								sample_group_write: value.includes("w"),
							})
						}
					/>
				</InputGroup>

				<InputGroup>
					<InputLabel htmlFor="all">All {"Users'"} Rights</InputLabel>
					<RightsSelect
						id="all"
						value={all}
						onChange={(value) =>
							mutation.mutate({
								sample_all_read: value.includes("r"),
								sample_all_write: value.includes("w"),
							})
						}
					/>
				</InputGroup>
			</BoxGroupSection>
		</BoxGroup>
	);
}
