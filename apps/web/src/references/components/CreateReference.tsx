import { Dialog, DialogContent, DialogTitle } from "@base/Dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@base/Tabs";
import { useState } from "react";
import EmptyReference from "./EmptyReference";
import ImportReference from "./ImportReference";

type CreateReferenceProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

/**
 * The create reference view with options to create an empty reference or import a reference
 */
export function CreateReference({ open, onOpenChange }: CreateReferenceProps) {
	const [tab, setTab] = useState<"empty" | "import">("empty");

	function handleOpenChange(open: boolean) {
		onOpenChange(open);
		if (!open) {
			setTab("empty");
		}
	}

	function handleSuccess() {
		onOpenChange(false);
		setTab("empty");
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent size="lg">
				<DialogTitle>Create Reference</DialogTitle>
				<Tabs
					value={tab}
					onValueChange={(value) => setTab(value as "empty" | "import")}
				>
					<TabsList>
						<TabsTrigger value="empty">Empty</TabsTrigger>
						<TabsTrigger value="import">Import</TabsTrigger>
					</TabsList>
					<TabsContent
						value="empty"
						forceMount
						className="data-[state=inactive]:hidden"
					>
						<EmptyReference onSuccess={handleSuccess} />
					</TabsContent>
					<TabsContent
						value="import"
						forceMount
						className="data-[state=inactive]:hidden"
					>
						<ImportReference onSuccess={handleSuccess} />
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
