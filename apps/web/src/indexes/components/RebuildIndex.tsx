import Button from "@base/Button";
import { buttonVariants } from "@base/buttonVariants";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "@base/Dialog";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { useState } from "react";
import { useCreateIndex, useFetchUnbuiltChanges } from "../queries";
import RebuildHistory from "./History";
import RebuildIndexError from "./RebuildIndexError";

type RebuildIndexProps = {
	refId: string;
};

/**
 * A "Create" button that opens a dialog for rebuilding the reference index.
 */
export default function RebuildIndex({ refId }: RebuildIndexProps) {
	const [open, setOpen] = useState(false);
	const { data, isPending } = useFetchUnbuiltChanges(refId);
	const mutation = useCreateIndex();

	function handleSubmit(e) {
		e.preventDefault();
		mutation.mutate(
			{ refId },
			{
				onSuccess: () => {
					setOpen(false);
				},
			},
		);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className={buttonVariants({ color: "blue" })}>
				Create
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Rebuild Index</DialogTitle>
				{isPending ? (
					<LoadingPlaceholder />
				) : (
					<form onSubmit={handleSubmit}>
						<RebuildIndexError
							error={mutation.error?.response?.body?.message}
						/>
						<RebuildHistory unbuilt={data} />
						<DialogFooter>
							<Button
								type="submit"
								color="blue"
								disabled={mutation.isPending}
							>
								Start
							</Button>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
