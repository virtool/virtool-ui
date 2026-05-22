import { Dialog, DialogContent, DialogTitle } from "@base/Dialog";
import Tabs from "@base/Tabs";
import TabsLink from "@base/TabsLink";
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
				<Tabs>
					<TabsLink
						to="."
						search={{ createReferenceType: "empty" }}
						isActive={createReferenceType === "empty"}
					>
						Empty
					</TabsLink>
					<TabsLink
						to="."
						search={{ createReferenceType: "import" }}
						isActive={createReferenceType === "import"}
					>
						Import
					</TabsLink>
				</Tabs>

				{createReferenceType === "import" ? (
					<ImportReference />
				) : (
					<EmptyReference />
				)}
			</DialogContent>
		</Dialog>
	);
}
