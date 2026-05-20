import { Dialog, DialogContent, DialogTitle } from "@base/Dialog";
import ExternalLink from "@base/ExternalLink";
import { useRootQuery } from "@wall/queries";

type AboutDialogProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

/**
 * Dialog showing the Virtool server and web app versions and a link to the
 * documentation.
 */
export default function AboutDialog({ open, setOpen }: AboutDialogProps) {
	const { data } = useRootQuery();

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogTitle>About Virtool</DialogTitle>
				<p className="text-slate-600 pb-6">
					Virtool runs as two pieces: a server that stores your data and runs
					analyses, and a web app that you use in your browser to interact with
					it. Each is released independently.
				</p>

				<section className="pb-6">
					<h3 className="font-medium pb-3 text-lg">Versions</h3>
					<dl className="grid grid-cols-[8rem_1fr] gap-y-3">
						<dt className="font-medium">Server</dt>
						<dd>
							<div className="font-mono">{data?.version ?? "—"}</div>
							<div className="text-slate-600 text-sm">
								Stores data and runs analyses.
							</div>
						</dd>
						<dt className="font-medium">Web app</dt>
						<dd>
							<div className="font-mono">{__APP_VERSION__}</div>
							<div className="text-slate-600 text-sm">
								The pages you see in your browser.
							</div>
						</dd>
					</dl>
				</section>

				<section className="border-t border-gray-200 pt-6">
					<h3 className="font-medium pb-2 text-lg">Documentation</h3>
					<p className="text-slate-600 pb-2">
						Guides for installing, configuring, and using Virtool.
					</p>
					<ExternalLink
						className="text-blue-600 hover:underline"
						href="https://virtool.ca/docs/manual/start/installation/"
					>
						virtool.ca/docs
					</ExternalLink>
				</section>
			</DialogContent>
		</Dialog>
	);
}
