import { cn } from "@app/utils";
import BoxGroup from "@base/BoxGroup";
import BoxGroupSection from "@base/BoxGroupSection";
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

const offRadioClasses = cn(
	"appearance-none",
	"h-5",
	"w-5",
	"shrink-0",
	"rounded-full",
	"border-2",
	"border-gray-300",
	"cursor-pointer",
	"checked:border-gray-900",
	"checked:bg-gray-900",
	"focus-visible:ring-2",
	"focus-visible:ring-blue-500",
	"focus-visible:outline-none",
);

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

	const hasActive = data.some((item) => item.active);

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
				<div role="radiogroup" aria-label="Active instance message">
					<BoxGroup>
						<BoxGroupSection className="flex items-center gap-3">
							<input
								type="radio"
								id="instance-message-off"
								name="instance-message-active"
								checked={!hasActive}
								onChange={() => void clearActiveMutation.mutateAsync()}
								className={offRadioClasses}
							/>
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
								active={item.active}
								color={item.color}
								id={item.id}
								message={item.message}
								onActivate={(id) => setActiveMutation.mutateAsync({ id })}
								onEdit={(id, values) =>
									updateMutation.mutateAsync({ id, ...values })
								}
								onRemove={(id) => deleteMutation.mutateAsync({ id })}
							/>
						))}
					</BoxGroup>
				</div>
			) : (
				<BoxGroup>
					<NoneFoundSection noun="instance messages" />
				</BoxGroup>
			)}
		</section>
	);
}
