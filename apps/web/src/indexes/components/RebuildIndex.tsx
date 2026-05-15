import Button from "@base/Button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@base/Dialog";
import { useCreateIndex, useFetchUnbuiltChanges } from "../queries";
import RebuildHistory from "./History";
import RebuildIndexError from "./RebuildIndexError";

type RebuildIndexProps = {
	open: boolean;
	refId: string;
	setOpen: (open: boolean) => void;
};

/**
 * Displays a dialog to rebuild an index
 */
export default function RebuildIndex({
	open,
	refId,
	setOpen,
}: RebuildIndexProps) {
	const { data, isPending } = useFetchUnbuiltChanges(refId);
	const mutation = useCreateIndex();

	if (isPending) {
		return null;
	}

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
		<Dialog open={open} onOpenChange={() => setOpen(false)}>
			<DialogContent>
				<DialogTitle>Rebuild Index</DialogTitle>
				<form onSubmit={handleSubmit}>
					<RebuildIndexError
						error={mutation.isError && mutation.error.response.body.message}
					/>
					<RebuildHistory unbuilt={data} />
					<DialogFooter>
						<Button type="submit" color="blue">
							Start
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
