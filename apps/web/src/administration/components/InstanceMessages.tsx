import BoxGroup from "@base/BoxGroup";
import BoxGroupSection from "@base/BoxGroupSection";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundSection from "@base/NoneFoundSection";
import { RadioGroup, RadioGroupItem } from "@base/RadioGroup";
import SectionHeader from "@base/SectionHeader";
import {
	useClearActiveMessage,
	useCreateMessage,
	useDeleteMessage,
	useFetchMessages,
	useSetActiveMessage,
	useUpdateMessage,
} from "@message/queries";
import CreateInstanceMessage from "./CreateInstanceMessage";
import InstanceMessageItem from "./InstanceMessageItem";

/**
 * Display and manage the list of instance messages. Admins can create, edit,
 * activate, deactivate, and delete entries; the banner exposes the single
 * active row to all users.
 */
export default function InstanceMessages() {
	const { data, isPending } = useFetchMessages();
	const createMutation = useCreateMessage();
	const updateMutation = useUpdateMessage();
	const deleteMutation = useDeleteMessage();
	const setActiveMutation = useSetActiveMessage();
	const clearActiveMutation = useClearActiveMessage();

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	const activeMessage = data.find((item) => item.active);
	const selectedValue = activeMessage?.id.toString() ?? "off";

	function handleChange(value: string) {
		if (value === "off") {
			void clearActiveMutation.mutateAsync();
			return;
		}
		void setActiveMutation.mutateAsync({ id: Number(value) });
	}

	return (
		<section>
			<SectionHeader className="flex items-start justify-between">
				<div>
					<h2>Instance Messages</h2>
					<p>
						Manage the message displayed to all users above the navigation bar.
					</p>
				</div>
				<CreateInstanceMessage
					onSubmit={(values) => createMutation.mutateAsync(values)}
				/>
			</SectionHeader>
			{data.length ? (
				<RadioGroup
					aria-label="Active instance message"
					value={selectedValue}
					onValueChange={handleChange}
				>
					<BoxGroup>
						<BoxGroupSection className="flex items-center gap-3">
							<RadioGroupItem id="instance-message-off" value="off" />
							<label
								htmlFor="instance-message-off"
								className="grow cursor-pointer text-gray-600"
							>
								Off — no message displayed
							</label>
						</BoxGroupSection>
						{data.map((item) => (
							<InstanceMessageItem
								key={item.id}
								color={item.color}
								id={item.id}
								message={item.message}
								onEdit={(id, values) =>
									updateMutation.mutateAsync({ id, ...values })
								}
								onRemove={(id) => deleteMutation.mutateAsync({ id })}
							/>
						))}
					</BoxGroup>
				</RadioGroup>
			) : (
				<BoxGroup>
					<NoneFoundSection noun="instance messages" />
				</BoxGroup>
			)}
		</section>
	);
}
