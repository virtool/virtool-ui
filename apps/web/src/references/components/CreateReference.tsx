import { Dialog, DialogContent, DialogTitle } from "@base/Dialog";
import NavTab from "@base/NavTab";
import NavTabs from "@base/NavTabs";
import EmptyReference from "./EmptyReference";
import ImportReference from "./ImportReference";

type CreateReferenceProps = {
	createReferenceType?: string;
	setCreateReferenceType: (type?: string) => void;
};

/**
 * The create reference view with options to create an empty reference or import a reference
 */
export function CreateReference({
	createReferenceType,
	setCreateReferenceType,
}: CreateReferenceProps) {
	return (
		<Dialog
			open={Boolean(createReferenceType)}
			onOpenChange={() => {
				setCreateReferenceType(undefined);
			}}
		>
			<DialogContent size="lg">
				<DialogTitle>Create Reference</DialogTitle>
				<NavTabs>
					<NavTab
						to="."
						search={{ createReferenceType: "empty" }}
						isActive={createReferenceType === "empty"}
					>
						Empty
					</NavTab>
					<NavTab
						to="."
						search={{ createReferenceType: "import" }}
						isActive={createReferenceType === "import"}
					>
						Import
					</NavTab>
				</NavTabs>

				{createReferenceType === "import" ? (
					<ImportReference />
				) : (
					<EmptyReference />
				)}
			</DialogContent>
		</Dialog>
	);
}
