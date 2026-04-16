import { useDialogParam } from "@app/hooks";
import Button from "@base/Button";
import { Dialog, DialogContent, DialogTitle } from "@base/Dialog";
import { usePostDevCommand } from "../queries";

/**
 * Displays a dialog for developer commands
 */
export default function DeveloperDialog() {
	const { open: openDev, setOpen: setOpenDev } = useDialogParam("openDev");
	const mutation = usePostDevCommand();

	return (
		<Dialog open={openDev} onOpenChange={() => setOpenDev(false)}>
			<DialogContent size="lg">
				<DialogTitle>Developer</DialogTitle>
				<div className="flex items-center p-4">
					<div>
						<h3 className="mb-1 mt-0">Clear Users</h3>
						<p className="m-0">
							Remove existing users. You will be required to create a first
							user.
						</p>
					</div>
					<div className="ml-auto">
						<Button
							color="red"
							onClick={() =>
								mutation.mutate(
									{ command: "clear_users" },
									{
										onSuccess: () => {
											setOpenDev(false);
											location.reload();
										},
									},
								)
							}
						>
							Clear Users
						</Button>
					</div>
				</div>
				<div className="flex items-center p-4">
					<div>
						<h3 className="mb-1 mt-0">Create Sample</h3>
						<p className="m-0">Creates a sample that is ready for use.</p>
					</div>
					<div className="ml-auto">
						<Button
							color="red"
							onClick={() =>
								mutation.mutate({
									command: "create_sample",
								})
							}
						>
							Create Sample
						</Button>
					</div>
				</div>
				<div className="flex items-center p-4">
					<div>
						<h3 className="mb-1 mt-0">Create Subtraction</h3>
						<p className="m-0">Creates a subtraction that is ready for use.</p>
					</div>
					<div className="ml-auto">
						<Button
							color="red"
							onClick={() =>
								mutation.mutate({
									command: "create_subtraction",
								})
							}
						>
							Create Subtraction
						</Button>
					</div>
				</div>
				<div className="flex items-center p-4">
					<div>
						<h3 className="mb-1 mt-0">Create Subtraction</h3>
						<p className="m-0">Creates a subtraction that is ready for use.</p>
					</div>
					<div className="ml-auto">
						<Button
							color="red"
							onClick={() =>
								mutation.mutate({
									command: "create_subtraction",
								})
							}
						>
							Create Subtraction
						</Button>
					</div>
				</div>
				<div className="flex items-center p-4">
					<div>
						<h3 className="mb-1 mt-0">Force Delete Jobs</h3>
						<p className="m-0">
							Forces cancellation, then deletion of all jobs regardless of
							status.
						</p>
					</div>
					<div className="ml-auto">
						<Button
							color="red"
							onClick={() =>
								mutation.mutate({
									command: "force_delete_jobs",
								})
							}
						>
							Force Delete Jobs
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
