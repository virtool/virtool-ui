import BoxGroup from "@base/BoxGroup";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundSection from "@base/NoneFoundSection";
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
			<BoxGroup>
				{data.length ? (
					data.map((item) => (
						<InstanceMessageItem
							key={item.id}
							active={item.active}
							color={item.color}
							id={item.id}
							message={item.message}
							onActivate={(id) => setActiveMutation.mutateAsync({ id })}
							onDeactivate={() => clearActiveMutation.mutateAsync()}
							onEdit={(id, values) =>
								updateMutation.mutateAsync({ id, ...values })
							}
							onRemove={(id) => deleteMutation.mutateAsync({ id })}
						/>
					))
				) : (
					<NoneFoundSection noun="instance messages" />
				)}
			</BoxGroup>
		</section>
	);
}
